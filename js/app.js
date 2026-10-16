/* Meal Planner — app logic. Works against whatever DataSource.load() returns
 * (mock data today, live Google Sheet later) since both resolve to the same
 * { recipes, ingredients, instructions, wasteReduction, nutritionTargets } shape. */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PLAN_STORAGE_KEY = "mealPlan.v1";

let DATA = { recipes: [], ingredients: [], instructions: [], wasteReduction: [], nutritionTargets: [] };
let plan = loadPlan(); // { Mon: [{recipe_id, servings}], ... }

// ---------- persistence ----------
function loadPlan() {
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore corrupt storage */ }
  const empty = {};
  DAYS.forEach((d) => (empty[d] = []));
  return empty;
}

function savePlan() {
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
  schedulePlanPush();
}

// ---------- cross-device sync ----------
// Debounced so a burst of edits (e.g. a drag reorder followed by a servings tweak)
// sends one push instead of one per keystroke/click.
let pushTimer = null;
function schedulePlanPush() {
  if (!PlanSync.isConfigured()) return;
  clearTimeout(pushTimer);
  setSyncBadge("saving");
  pushTimer = setTimeout(async () => {
    const ok = await PlanSync.pushPlan(plan);
    setSyncBadge(ok ? "synced" : "error");
  }, 800);
}

function setSyncBadge(state) {
  const badge = document.getElementById("plan-sync-badge");
  const syncBtn = document.getElementById("sync-now-btn");
  if (!PlanSync.isConfigured()) {
    badge.classList.add("hidden");
    syncBtn.classList.add("hidden");
    return;
  }
  badge.classList.remove("hidden");
  syncBtn.classList.remove("hidden");
  badge.classList.toggle("badge-error", state === "error");
  const labels = {
    loading: "Loading plan…",
    saving: "Saving…",
    synced: "Plan synced",
    error: "Sync failed — saved locally",
  };
  badge.textContent = labels[state] || "";
}

// Pulls the latest plan from the shared sheet and re-renders everything that
// depends on it. Used both at startup and from the manual "Sync now" button.
async function pullPlan() {
  setSyncBadge("loading");
  const remote = await PlanSync.fetchPlan();
  if (!remote) {
    setSyncBadge(PlanSync.isConfigured() ? "error" : "");
    return false;
  }
  DAYS.forEach((d) => { if (!Array.isArray(remote[d])) remote[d] = []; });
  plan = remote;
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
  setSyncBadge("synced");
  renderPlanner();
  renderShoppingList();
  renderWasteTips();
  renderRecipeGrid();
  if (typeof TodayTasks !== "undefined") TodayTasks.render();
  return true;
}

// ---------- helpers ----------
function recipeById(id) {
  return DATA.recipes.find((r) => String(r.recipe_id) === String(id));
}

function ingredientsFor(id) {
  return DATA.ingredients.filter((i) => String(i.recipe_id) === String(id));
}

function instructionsFor(id) {
  return DATA.instructions
    .filter((i) => String(i.recipe_id) === String(id))
    .sort((a, b) => Number(a.step_number) - Number(b.step_number));
}

function fmtQty(n) {
  const rounded = Math.round(n * 100) / 100;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

// Sheet-sourced booleans arrive as the strings "TRUE"/"FALSE"; mock data uses real booleans.
function isTrue(v) {
  return v === true || String(v).trim().toUpperCase() === "TRUE";
}

function hasQty(ingredient) {
  const q = ingredient.quantity_per_serving;
  return q !== "" && q !== null && q !== undefined && !isNaN(Number(q)) && Number(q) > 0;
}

function hasMacros(recipe) {
  const c = recipe.calories_per_serving;
  return c !== "" && c !== null && c !== undefined && !isNaN(Number(c)) && Number(c) > 0;
}

function vegBadge(recipe) {
  if (isTrue(recipe.is_vegan)) return `<span class="tag veg-badge vegan">Vegan</span>`;
  if (isTrue(recipe.is_vegetarian)) return `<span class="tag veg-badge vegetarian">Vegetarian</span>`;
  return "";
}

// Numeric daily target for a metric (calories/protein/carbohydrates/fat), or null if the
// NutritionTargets row is missing/blank/a range like "35-40" that isn't a single number.
function numericTarget(metric) {
  const row = DATA.nutritionTargets.find((t) => t.metric === metric);
  if (!row) return null;
  const n = Number(row.target_amount);
  return !isNaN(n) && n > 0 ? n : null;
}

// Maps JS's Sunday-first getDay() (0-6) onto our Monday-first DAYS array.
function todayDayName() {
  return DAYS[(new Date().getDay() + 6) % 7];
}

// Meal-chronological grouping for the Recipe Library: any category not listed here
// (typos, a new category added straight in the sheet, etc.) falls into "Other" rather
// than being dropped.
const CATEGORY_ORDER = ["Breakfast", "Lunch", "Dinner", "Snack", "Side", "Other"];
const CATEGORY_GROUP_LABEL = { Breakfast: "Breakfast", Lunch: "Lunch", Dinner: "Dinner", Snack: "Snacks", Side: "Sides", Other: "Other" };

function categoryGroup(cat) {
  const match = CATEGORY_ORDER.find((c) => c.toLowerCase() === String(cat || "").trim().toLowerCase());
  return match || "Other";
}

// ---------- tabs ----------
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    // Re-render on every visit, not just once at load — the library's Today/This week
    // filters and the shopping list/waste tips all depend on plan state that can have
    // changed on another tab (or, once synced, on another device) since last shown.
    if (btn.dataset.tab === "library") renderRecipeGrid();
    if (btn.dataset.tab === "planner") renderPlanner();
    if (btn.dataset.tab === "shopping") renderShoppingList();
    if (btn.dataset.tab === "tasks") TodayTasks.render();
    if (btn.dataset.tab === "waste") renderWasteTips();
  });
});

// ---------- Recipe Library ----------
function renderCategoryFilter() {
  const sel = document.getElementById("category-filter");
  const cats = [...new Set(DATA.recipes.map((r) => r.category))].sort((a, b) => {
    const groupDiff = CATEGORY_ORDER.indexOf(categoryGroup(a)) - CATEGORY_ORDER.indexOf(categoryGroup(b));
    return groupDiff !== 0 ? groupDiff : a.localeCompare(b);
  });
  cats.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}

function renderRecipeGrid() {
  const grid = document.getElementById("recipe-grid");
  const search = document.getElementById("recipe-search").value.trim().toLowerCase();
  const cat = document.getElementById("category-filter").value;
  const vegetarianOnly = document.getElementById("filter-vegetarian").checked;
  const veganOnly = document.getElementById("filter-vegan").checked;
  const todayOnly = document.getElementById("filter-today").checked;
  const thisWeekOnly = document.getElementById("filter-thisweek").checked;

  const today = todayDayName();
  document.getElementById("today-label").textContent = today;
  const todayIds = new Set((plan[today] || []).map((item) => String(item.recipe_id)));
  const weekIds = new Set(DAYS.flatMap((d) => (plan[d] || []).map((item) => String(item.recipe_id))));

  const filtered = DATA.recipes.filter((r) => {
    const matchesSearch = !search || r.name.toLowerCase().includes(search) || String(r.tags).toLowerCase().includes(search);
    const matchesCat = !cat || r.category === cat;
    const matchesVegetarian = !vegetarianOnly || isTrue(r.is_vegetarian);
    const matchesVegan = !veganOnly || isTrue(r.is_vegan);
    const matchesToday = !todayOnly || todayIds.has(String(r.recipe_id));
    const matchesWeek = !thisWeekOnly || weekIds.has(String(r.recipe_id));
    return matchesSearch && matchesCat && matchesVegetarian && matchesVegan && matchesToday && matchesWeek;
  });

  // Meal-chronological groups (Breakfast/Lunch/Dinner/Snacks/Sides/Other), alphabetical
  // by name within each group.
  filtered.sort((a, b) => {
    const groupDiff = CATEGORY_ORDER.indexOf(categoryGroup(a.category)) - CATEGORY_ORDER.indexOf(categoryGroup(b.category));
    return groupDiff !== 0 ? groupDiff : a.name.localeCompare(b.name);
  });

  grid.innerHTML = "";
  let currentGroup = null;
  filtered.forEach((r) => {
    const group = categoryGroup(r.category);
    if (group !== currentGroup) {
      currentGroup = group;
      const heading = document.createElement("div");
      heading.className = "recipe-group-heading";
      heading.textContent = CATEGORY_GROUP_LABEL[group];
      grid.appendChild(heading);
    }
    const card = document.createElement("div");
    card.className = "recipe-card";
    const tags = String(r.tags || "").split(",").filter(Boolean).map((t) => `<span class="tag">${t.trim()}</span>`).join("");
    const totalTime = Number(r.prep_time_min || 0) + Number(r.cook_time_min || 0);
    const timeText = totalTime > 0 ? ` · ${totalTime} min` : "";
    const servingsText = r.default_servings !== "" && r.default_servings != null ? ` · Serves ${r.default_servings}` : "";
    const macroRow = hasMacros(r)
      ? `<div class="macro-row">
          <span>${r.calories_per_serving} kcal</span>
          <span>${r.protein_g_per_serving}g P</span>
          <span>${r.carbs_g_per_serving}g C</span>
          <span>${r.fat_g_per_serving}g F</span>
        </div>`
      : `<div class="macro-row muted-note">Macros not yet added</div>`;
    card.innerHTML = `
      <h3>${r.name}</h3>
      <div class="meta">${r.category}${servingsText}${timeText}</div>
      <div>${vegBadge(r)}${tags}</div>
      ${macroRow}`;
    card.addEventListener("click", () => openRecipeModal(r.recipe_id));
    grid.appendChild(card);
  });

  if (!filtered.length) {
    grid.innerHTML = `<p style="color:var(--muted)">No recipes match your search.</p>`;
  }
}

document.getElementById("recipe-search").addEventListener("input", renderRecipeGrid);
document.getElementById("category-filter").addEventListener("change", renderRecipeGrid);
document.getElementById("filter-vegetarian").addEventListener("change", renderRecipeGrid);
document.getElementById("filter-vegan").addEventListener("change", renderRecipeGrid);
document.getElementById("filter-today").addEventListener("change", renderRecipeGrid);
document.getElementById("filter-thisweek").addEventListener("change", renderRecipeGrid);

// ---------- Recipe modal (detail + add-to-plan) ----------
const modalOverlay = document.getElementById("recipe-modal");
const modalContent = document.getElementById("modal-content");

document.getElementById("modal-close").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });

function closeModal() {
  modalOverlay.classList.add("hidden");
}

function openRecipeModal(recipeId, preselectDay) {
  const recipe = recipeById(recipeId);
  if (!recipe) return;
  const ingredients = ingredientsFor(recipeId);
  const steps = instructionsFor(recipeId);
  const selectedDays = new Set(preselectDay ? [preselectDay] : []);
  let servings = Number(recipe.default_servings) || 1;

  function render() {
    const macroRow = hasMacros(recipe)
      ? `<div class="macro-row" style="font-size:0.85rem;">
          <span><strong>${Math.round(recipe.calories_per_serving * servings)}</strong> kcal</span>
          <span><strong>${Math.round(recipe.protein_g_per_serving * servings)}</strong>g protein</span>
          <span><strong>${Math.round(recipe.carbs_g_per_serving * servings)}</strong>g carbs</span>
          <span><strong>${Math.round(recipe.fat_g_per_serving * servings)}</strong>g fat</span>
        </div>`
      : `<p class="muted-note">Macro data not yet added for this recipe.</p>`;

    const defaultServingsText = recipe.default_servings !== "" && recipe.default_servings != null
      ? `(default ${recipe.default_servings})`
      : `(default not set)`;

    const totalTime = Number(recipe.prep_time_min || 0) + Number(recipe.cook_time_min || 0);

    modalContent.innerHTML = `
      <h2>${recipe.name}</h2>
      <div class="meta" style="color:var(--muted);font-size:0.85rem;">${recipe.category}${totalTime > 0 ? ` · ${totalTime} min total` : ""}</div>
      <div style="margin-top:6px;">${vegBadge(recipe)}</div>

      <div class="servings-control">
        <label for="servings-input"><strong>Servings</strong></label>
        <input type="number" id="servings-input" min="1" step="1" value="${servings}" style="width:70px" />
        <span style="color:var(--muted);font-size:0.8rem;">${defaultServingsText}</span>
      </div>

      ${macroRow}

      <div class="section-label">Ingredients</div>
      <ul class="ingredient-list">
        ${ingredients.map((i) => hasQty(i)
          ? `<li>${fmtQty(i.quantity_per_serving * servings)} ${i.unit} ${i.ingredient_name}</li>`
          : `<li>${i.ingredient_name} <span class="muted-note">(add quantity)</span></li>`
        ).join("")}
      </ul>

      <div class="section-label">Instructions</div>
      <ol class="instruction-list">
        ${steps.map((s) => `<li>${s.instruction_text}</li>`).join("") || `<li class="muted-note">No instructions added yet.</li>`}
      </ol>

      ${recipe.waste_tips ? `
        <div class="section-label">Waste reduction tip</div>
        <p>${recipe.waste_tips}</p>
      ` : ""}

      <div class="section-label">Add to weekly plan</div>
      <div class="day-picker" id="day-picker">
        ${DAYS.map((d) => `<button type="button" data-day="${d}" class="${selectedDays.has(d) ? "selected" : ""}">${d}</button>`).join("")}
      </div>
      <button class="btn-secondary" id="add-to-plan-btn" style="background:var(--accent);color:#fff;border-color:var(--accent);">Add to selected day(s)</button>
    `;

    document.getElementById("servings-input").addEventListener("input", (e) => {
      const v = Number(e.target.value);
      servings = v > 0 ? v : 1;
      render();
    });

    modalContent.querySelectorAll("#day-picker button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const d = btn.dataset.day;
        selectedDays.has(d) ? selectedDays.delete(d) : selectedDays.add(d);
        btn.classList.toggle("selected");
      });
    });

    document.getElementById("add-to-plan-btn").addEventListener("click", () => {
      if (!selectedDays.size) { alert("Pick at least one day first."); return; }
      selectedDays.forEach((d) => {
        plan[d].push({ recipe_id: recipe.recipe_id, servings });
      });
      savePlan();
      closeModal();
      renderPlanner();
    });
  }

  render();
  modalOverlay.classList.remove("hidden");
}

// ---------- Weekly Planner ----------
// Reorders/moves a plan item. sourceDay/targetDay may be the same day (pure reorder) or
// different (move to another day); targetIdx is where it should land in the target day's array.
function moveItem(sourceDay, sourceIdx, targetDay, targetIdx) {
  if (sourceDay === targetDay && sourceIdx === targetIdx) return;
  const [item] = plan[sourceDay].splice(sourceIdx, 1);
  let insertIdx = targetIdx;
  if (sourceDay === targetDay && sourceIdx < targetIdx) insertIdx -= 1;
  plan[targetDay].splice(insertIdx, 0, item);
  savePlan();
  renderPlanner();
}

function renderPlanner() {
  const grid = document.getElementById("planner-grid");
  grid.innerHTML = "";

  DAYS.forEach((day) => {
    const col = document.createElement("div");
    col.className = "day-col";
    const items = plan[day] || [];

    const itemsHtml = items.map((item, idx) => {
      const r = recipeById(item.recipe_id);
      if (!r) return "";
      return `
        <div class="plan-item" draggable="true" data-day="${day}" data-idx="${idx}">
          <div class="row1">
            <span class="drag-handle" title="Drag to reorder">&#8942;&#8942;</span>
            <span class="plan-item-name">${r.name}</span>
            <div class="item-controls">
              <button class="move-btn" data-day="${day}" data-idx="${idx}" data-dir="-1" title="Move earlier" ${idx === 0 ? "disabled" : ""}>&#9650;</button>
              <button class="move-btn" data-day="${day}" data-idx="${idx}" data-dir="1" title="Move later" ${idx === items.length - 1 ? "disabled" : ""}>&#9660;</button>
              <button class="remove-btn" data-day="${day}" data-idx="${idx}" title="Remove">&times;</button>
            </div>
          </div>
          <input type="number" min="1" value="${item.servings}" data-day="${day}" data-idx="${idx}" class="servings-edit" /> servings
        </div>`;
    }).join("");

    col.innerHTML = `<h4>${day}</h4><div class="day-items" data-day="${day}">${itemsHtml}</div>`;

    const addBtn = document.createElement("button");
    addBtn.className = "add-recipe-btn";
    addBtn.textContent = "+ Add recipe";
    addBtn.addEventListener("click", () => openDayPicker(day));
    col.appendChild(addBtn);

    grid.appendChild(col);
  });

  grid.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const { day, idx } = btn.dataset;
      plan[day].splice(Number(idx), 1);
      savePlan();
      renderPlanner();
    });
  });

  grid.querySelectorAll(".move-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const day = btn.dataset.day;
      const idx = Number(btn.dataset.idx);
      const newIdx = idx + Number(btn.dataset.dir);
      if (newIdx < 0 || newIdx >= plan[day].length) return;
      const arr = plan[day];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      savePlan();
      renderPlanner();
    });
  });

  grid.querySelectorAll(".servings-edit").forEach((input) => {
    input.addEventListener("change", () => {
      const { day, idx } = input.dataset;
      const v = Number(input.value);
      plan[day][Number(idx)].servings = v > 0 ? v : 1;
      savePlan();
      renderPlanner();
    });
  });

  // Drag and drop: grab a card by anywhere on it and drop it on another card. Dropping on
  // the top half of the target inserts before it; the bottom half inserts after it — so
  // dragging a card down past its neighbor actually moves it past, instead of snapping
  // back to the same spot. Dropping on the empty space below a day's cards appends to the
  // end of that day.
  let dragged = null; // { day, idx }

  grid.querySelectorAll(".plan-item").forEach((el) => {
    el.addEventListener("dragstart", () => {
      dragged = { day: el.dataset.day, idx: Number(el.dataset.idx) };
      el.classList.add("dragging");
    });
    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
      grid.querySelectorAll(".drag-over").forEach((n) => n.classList.remove("drag-over"));
    });
    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      el.classList.add("drag-over");
    });
    el.addEventListener("dragleave", () => el.classList.remove("drag-over"));
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove("drag-over");
      if (!dragged) return;
      const rect = el.getBoundingClientRect();
      const dropAfter = (e.clientY - rect.top) >= rect.height / 2;
      const targetIdx = Number(el.dataset.idx) + (dropAfter ? 1 : 0);
      moveItem(dragged.day, dragged.idx, el.dataset.day, targetIdx);
      dragged = null;
    });
  });

  grid.querySelectorAll(".day-items").forEach((container) => {
    container.addEventListener("dragover", (e) => e.preventDefault());
    container.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!dragged) return;
      const targetDay = container.dataset.day;
      moveItem(dragged.day, dragged.idx, targetDay, plan[targetDay].length);
      dragged = null;
    });
  });

  renderTargetsSummary();
  renderDailyMacros();
}

function openDayPicker(day) {
  modalContent.innerHTML = `
    <h2>Add a recipe to ${day}</h2>
    <input type="search" id="picker-search" placeholder="Search recipes…" style="width:100%;margin-bottom:12px;" />
    <div id="picker-list"></div>
  `;
  modalOverlay.classList.remove("hidden");

  function renderList() {
    const q = document.getElementById("picker-search").value.trim().toLowerCase();
    const list = document.getElementById("picker-list");
    const matches = DATA.recipes.filter((r) => !q || r.name.toLowerCase().includes(q));
    list.innerHTML = matches.map((r) => `
      <div class="plan-item" style="cursor:pointer;" data-id="${r.recipe_id}">
        <div class="row1"><span>${r.name}</span><span style="color:var(--muted)">${r.category}</span></div>
      </div>`).join("") || `<p style="color:var(--muted)">No matches.</p>`;

    list.querySelectorAll("[data-id]").forEach((el) => {
      el.addEventListener("click", () => openRecipeModal(el.dataset.id, day));
    });
  }

  document.getElementById("picker-search").addEventListener("input", renderList);
  renderList();
}

function renderTargetsSummary() {
  const container = document.getElementById("targets-summary");
  const targetRows = DATA.nutritionTargets;
  if (!targetRows.length) { container.innerHTML = ""; return; }

  const find = (m) => targetRows.find((t) => t.metric === m);
  const rows = [
    ["Calories", find("calories")],
    ["Protein", find("protein")],
    ["Carbs", find("carbohydrates")],
    ["Fat", find("fat")],
    ["Fiber", find("fiber")],
    ["Sugar", find("sugar")],
    ["Sodium", find("sodium")],
    ["Fruit + veg", find("fruit_veg_servings")],
  ].filter(([, row]) => row);

  container.innerHTML = `
    <div class="targets-card">
      <h4>Daily targets</h4>
      <div class="targets-row">
        ${rows.map(([label, row]) => `<span><strong>${row.target_amount}</strong> ${row.unit} ${label}</span>`).join("")}
      </div>
      <div class="muted-note">From your 2/14/2025 dietician consult. See the NutritionTargets tab for details.</div>
    </div>
  `;
}

function renderDailyMacros() {
  const container = document.getElementById("daily-macros");
  container.innerHTML = "";

  const targetCalories = numericTarget("calories");
  const targetProtein = numericTarget("protein");
  const targetCarbs = numericTarget("carbohydrates");
  const targetFat = numericTarget("fat");
  const pct = (value, target) => (target ? `<span class="muted-note">${Math.round((value / target) * 100)}% of goal</span>` : "");

  DAYS.forEach((day) => {
    const items = plan[day] || [];
    let missing = 0;
    const totals = items.reduce((acc, item) => {
      const r = recipeById(item.recipe_id);
      if (!r) return acc;
      if (!hasMacros(r)) { missing++; return acc; }
      acc.calories += r.calories_per_serving * item.servings;
      acc.protein += r.protein_g_per_serving * item.servings;
      acc.carbs += r.carbs_g_per_serving * item.servings;
      acc.fat += r.fat_g_per_serving * item.servings;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const card = document.createElement("div");
    card.className = "macro-card";
    card.innerHTML = `
      <h5>${day}</h5>
      <div><strong>${Math.round(totals.calories)}</strong> kcal ${pct(totals.calories, targetCalories)}</div>
      <div><strong>${Math.round(totals.protein)}</strong>g protein ${pct(totals.protein, targetProtein)}</div>
      <div><strong>${Math.round(totals.carbs)}</strong>g carbs ${pct(totals.carbs, targetCarbs)}</div>
      <div><strong>${Math.round(totals.fat)}</strong>g fat ${pct(totals.fat, targetFat)}</div>
      ${missing ? `<div class="muted-note">${missing} recipe${missing > 1 ? "s" : ""} missing macro data</div>` : ""}
    `;
    container.appendChild(card);
  });
}

// ---------- Shopping List ----------
// See js/shopping.js (renderShoppingList).

function clearPlan() {
  if (!confirm("Clear the entire weekly plan? This can't be undone.")) return;
  DAYS.forEach((d) => (plan[d] = []));
  savePlan();
  renderPlanner();
  renderShoppingList();
  renderWasteTips();
  if (typeof TodayTasks !== "undefined") TodayTasks.render();
}

document.getElementById("clear-plan-btn").addEventListener("click", clearPlan);
document.getElementById("clear-plan-btn-planner").addEventListener("click", clearPlan);

// ---------- Waste Tips ----------
// Reuse ideas fall into two buckets the user cares about: turning scraps into
// another meal (Broth/Stock, Repurposed Meal) vs. everything else (compost,
// cleaning, etc.). match_keywords is matched case-insensitively as a substring
// against every ingredient name in this week's plan.
const MEAL_REUSE_TYPES = ["Broth/Stock", "Repurposed Meal"];

function renderWasteTips() {
  const container = document.getElementById("waste-tips");

  const planRecipeIds = new Set();
  DAYS.forEach((day) => (plan[day] || []).forEach((item) => planRecipeIds.add(String(item.recipe_id))));

  if (!planRecipeIds.size) {
    container.innerHTML = `<p style="color:var(--muted)">Your plan is empty — add recipes in the Weekly Planner tab to see waste-reduction ideas for the week.</p>`;
    return;
  }

  const planRecipes = [...planRecipeIds].map(recipeById).filter(Boolean);
  const planIngredientNames = planRecipes
    .flatMap((r) => ingredientsFor(r.recipe_id))
    .map((i) => i.ingredient_name.toLowerCase());

  const recipeTips = planRecipes.filter((r) => r.waste_tips);

  const matchedScraps = DATA.wasteReduction.filter((w) => {
    const keywords = String(w.match_keywords || "").split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
    if (!keywords.length) return false;
    return keywords.some((k) => planIngredientNames.some((name) => name.includes(k)));
  });
  const generalScraps = DATA.wasteReduction.filter((w) => !String(w.match_keywords || "").trim());

  const allScraps = [...matchedScraps, ...generalScraps];
  const mealScraps = allScraps.filter((w) => MEAL_REUSE_TYPES.includes(w.reuse_type));
  const otherScraps = allScraps.filter((w) => !MEAL_REUSE_TYPES.includes(w.reuse_type));

  function scrapCard(w) {
    return `
      <div class="waste-card">
        <div class="row1"><strong>${w.scrap_source}</strong><span class="tag">${w.reuse_type}</span></div>
        <div>${w.reuse_description}</div>
        ${w.store_method ? `<div class="muted-note">Store: ${w.store_method}</div>` : ""}
      </div>`;
  }

  container.innerHTML = `
    ${recipeTips.length ? `
      <div class="section-label">This week's recipe-specific tips</div>
      ${recipeTips.map((r) => `<div class="waste-card"><strong>${r.name}</strong><div>${r.waste_tips}</div></div>`).join("")}
    ` : ""}

    <div class="section-label">♻️ Use scraps to prep another meal</div>
    ${mealScraps.length ? mealScraps.map(scrapCard).join("") : `<p class="muted-note">No matches for this week's ingredients yet.</p>`}

    <div class="section-label">🌱 Other uses (compost, cleaning, etc.)</div>
    ${otherScraps.length ? otherScraps.map(scrapCard).join("") : `<p class="muted-note">No matches for this week's ingredients yet.</p>`}
  `;
}

// ---------- Init ----------
document.getElementById("sync-now-btn").addEventListener("click", pullPlan);

async function init() {
  const badge = document.getElementById("data-source-badge");
  badge.textContent = CONFIG.source === "mock" ? "Placeholder data" : "Live Google Sheet";
  try {
    DATA = await DataSource.load();
  } catch (err) {
    badge.textContent = "Data load failed — check console";
    console.error(err);
    return;
  }
  renderCategoryFilter();
  if (PlanSync.isConfigured()) {
    await pullPlan(); // renders the recipe grid, planner, shopping list, waste tips, and today's tasks itself
  } else {
    renderRecipeGrid();
    renderPlanner();
    if (typeof TodayTasks !== "undefined") TodayTasks.render();
  }
}

init();
