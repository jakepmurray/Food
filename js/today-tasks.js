/*
 * Today's Tasks — day-of cooking checklist derived from the weekly plan.
 * Depends on globals from app.js: DAYS, plan, DATA, recipeById, ingredientsFor,
 * instructionsFor, hasQty, fmtQty, categoryGroup, todayDayName, openRecipeModal.
 */

const TodayTasks = (() => {
  const MEALTIMES_KEY = "mealTimes.v1";
  const CHECKLIST_KEY = "mealTasksChecklist.v1";

  const DEFAULT_MEALTIMES = {
    breakfast: "07:30",
    lunch: "12:30",
    dinner: "18:30",
    snack: "15:30",
  };

  const SLOT_DEFAULT_MIN = {
    breakfast: 15,
    lunch: 30,
    dinner: 45,
    snack: 10,
  };

  const SLOT_LABEL = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
  };

  const SLOT_ICON = {
    breakfast: "🌅",
    lunch: "☀️",
    dinner: "🌙",
    snack: "🍎",
  };

  let viewOffset = 0; // 0 = today, 1 = tomorrow
  let expanded = new Set(); // recipe keys currently expanded

  function localDateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function addDays(base, n) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    d.setDate(d.getDate() + n);
    return d;
  }

  function dayNameForDate(d) {
    return DAYS[(d.getDay() + 6) % 7];
  }

  function formatLongDate(d) {
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  function loadMealTimes() {
    try {
      const raw = localStorage.getItem(MEALTIMES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_MEALTIMES, ...parsed };
      }
    } catch (e) { /* ignore */ }
    return { ...DEFAULT_MEALTIMES };
  }

  function saveMealTimes(times) {
    localStorage.setItem(MEALTIMES_KEY, JSON.stringify(times));
  }

  function loadChecklist() {
    try {
      const raw = localStorage.getItem(CHECKLIST_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return {};
  }

  function saveChecklist(all) {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(all));
  }

  function isChecked(dateKey, id) {
    const all = loadChecklist();
    return !!(all[dateKey] && all[dateKey][id]);
  }

  function setChecked(dateKey, id, value) {
    const all = loadChecklist();
    if (!all[dateKey]) all[dateKey] = {};
    if (value) all[dateKey][id] = true;
    else delete all[dateKey][id];
    // Drop empty day maps and prune entries older than ~14 days
    if (!Object.keys(all[dateKey]).length) delete all[dateKey];
    const cutoff = addDays(new Date(), -14);
    Object.keys(all).forEach((k) => {
      const parts = k.split("-").map(Number);
      if (parts.length === 3) {
        const dk = new Date(parts[0], parts[1] - 1, parts[2]);
        if (dk < cutoff) delete all[k];
      }
    });
    saveChecklist(all);
  }

  function parseTimeToMinutes(hhmm) {
    const [h, m] = String(hhmm || "12:00").split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  function formatClock(totalMin) {
    let m = ((totalMin % (24 * 60)) + 24 * 60) % (24 * 60);
    const h24 = Math.floor(m / 60);
    const mins = m % 60;
    const ampm = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 || 12;
    return `${h12}:${String(mins).padStart(2, "0")} ${ampm}`;
  }

  function recipeDurationMin(recipe, slot) {
    const prep = Number(recipe.prep_time_min) || 0;
    const cook = Number(recipe.cook_time_min) || 0;
    if (prep + cook > 0) return prep + cook;
    // Sensible defaults when the sheet left times blank
    const cat = categoryGroup(recipe.category).toLowerCase();
    if (cat === "breakfast") return SLOT_DEFAULT_MIN.breakfast;
    if (cat === "snack" || cat === "side") return SLOT_DEFAULT_MIN.snack;
    if (cat === "dinner") return SLOT_DEFAULT_MIN.dinner;
    return SLOT_DEFAULT_MIN[slot] || 30;
  }

  function detectAdvanceTasks(recipe) {
    const tags = String(recipe.tags || "").toLowerCase();
    const notes = String(recipe.notes || "").toLowerCase();
    const name = String(recipe.name || "").toLowerCase();
    const steps = instructionsFor(recipe.recipe_id)
      .map((s) => String(s.instruction_text || "").toLowerCase())
      .join(" ");
    const blob = `${tags} ${notes} ${name} ${steps}`;
    const out = [];

    const longCook =
      Number(recipe.cook_time_min) >= 240 ||
      /slow[\s-]?cooker|crock[\s-]?pot|\b\d+\s*-\s*\d+\s*hours?\b|\b\d+\s*hours?\s+on\s+low\b/.test(blob);
    if (longCook || /slow[\s-]?cooker/.test(tags)) {
      out.push({
        when: "morning",
        id: `adv:morning:${recipe.recipe_id}`,
        label: `Start early / slow cooker for ${recipe.name}`,
        detail: "Long cook — begin this morning so it’s ready by mealtime.",
      });
    }
    if (/thaw|defrost/.test(blob)) {
      out.push({
        when: "night",
        id: `adv:night-thaw:${recipe.recipe_id}`,
        label: `Thaw ingredients for ${recipe.name}`,
        detail: "Move from freezer to fridge the night before.",
      });
    }
    if (/marinate|marinade/.test(blob)) {
      out.push({
        when: "night",
        id: `adv:night-marinate:${recipe.recipe_id}`,
        label: `Marinate for ${recipe.name}`,
        detail: "Do the night before so flavors develop.",
      });
    }
    if (/soak|overnight|night before|make[\s-]?ahead/.test(blob) && !longCook) {
      // Avoid double-flagging slow-cooker recipes that also say "overnight"
      if (/soak|overnight oats|night before/.test(blob)) {
        out.push({
          when: "night",
          id: `adv:night-prep:${recipe.recipe_id}`,
          label: `Prep ahead for ${recipe.name}`,
          detail: "Soak / overnight step — do the night before.",
        });
      }
    }
    return out;
  }

  // Assign plan items to breakfast / lunch / dinner / snack.
  // Sides ride with dinner. If there is no Dinner-category recipe but multiple
  // Lunch items, the later ones become dinner (common bowl-for-dinner pattern).
  function assignSlots(dayItems) {
    const slots = { breakfast: [], lunch: [], dinner: [], snack: [] };
    const lunchish = [];

    (dayItems || []).forEach((item, idx) => {
      const recipe = recipeById(item.recipe_id);
      if (!recipe) return;
      const cat = categoryGroup(recipe.category);
      const entry = { item, recipe, idx };
      if (cat === "Breakfast") slots.breakfast.push(entry);
      else if (cat === "Snack") slots.snack.push(entry);
      else if (cat === "Dinner") slots.dinner.push(entry);
      else if (cat === "Side") slots.dinner.push(entry);
      else lunchish.push(entry); // Lunch + Other
    });

    const hasTrueDinner = slots.dinner.some(
      (e) => categoryGroup(e.recipe.category) === "Dinner"
    );
    if (!hasTrueDinner && lunchish.length > 1) {
      slots.lunch = lunchish.slice(0, 1);
      slots.dinner = [...lunchish.slice(1), ...slots.dinner];
    } else {
      slots.lunch = lunchish;
    }
    return slots;
  }

  function keyIngredients(recipe, servings) {
    const ings = ingredientsFor(recipe.recipe_id);
    if (!ings.length) return "No ingredients listed yet.";
    const shown = ings.slice(0, 8).map((i) => {
      if (hasQty(i)) return `${fmtQty(i.quantity_per_serving * servings)} ${i.unit} ${i.ingredient_name}`;
      return i.ingredient_name;
    });
    const more = ings.length > 8 ? ` (+${ings.length - 8} more)` : "";
    return shown.join(" · ") + more;
  }

  function slotLeadTime(entries, slot) {
    if (!entries.length) return SLOT_DEFAULT_MIN[slot];
    return Math.max(...entries.map((e) => recipeDurationMin(e.recipe, slot)));
  }

  function render() {
    const root = document.getElementById("today-tasks-root");
    if (!root) return;

    const today = new Date();
    const viewDate = addDays(today, viewOffset);
    const dayName = dayNameForDate(viewDate);
    const dateKey = localDateKey(viewDate);
    const times = loadMealTimes();
    const dayItems = plan[dayName] || [];
    const slots = assignSlots(dayItems);

    // Collect advance tasks (dedupe by id)
    const advanceMap = new Map();
    dayItems.forEach((item) => {
      const recipe = recipeById(item.recipe_id);
      if (!recipe) return;
      detectAdvanceTasks(recipe).forEach((a) => {
        if (!advanceMap.has(a.id)) advanceMap.set(a.id, a);
      });
    });
    const advances = [...advanceMap.values()].sort((a, b) => {
      if (a.when === b.when) return a.label.localeCompare(b.label);
      return a.when === "night" ? -1 : 1;
    });

    // Checklist ids for progress
    const checkIds = [
      ...advances.map((a) => a.id),
      ...["breakfast", "lunch", "dinner", "snack"].flatMap((slot) =>
        (slots[slot] || []).map((e) => `meal:${e.recipe.recipe_id}:${e.idx}`)
      ),
    ];
    const doneCount = checkIds.filter((id) => isChecked(dateKey, id)).length;
    const totalCount = checkIds.length;
    const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

    const heading =
      viewOffset === 0
        ? `Today · ${formatLongDate(viewDate)}`
        : `Tomorrow · ${formatLongDate(viewDate)}`;

    let bodyHtml = "";

    if (!dayItems.length) {
      bodyHtml = `
        <div class="tasks-empty">
          <p>Nothing on the plan for <strong>${dayName}</strong> yet.</p>
          <p>Add recipes in the <span class="linkish" id="tasks-goto-planner">Weekly Planner</span> tab, then come back here for a timed checklist.</p>
        </div>`;
    } else {
      if (advances.length) {
        bodyHtml += `
          <div class="advance-section">
            <div class="section-label">Do ahead</div>
            ${advances
              .map((a) => {
                const checked = isChecked(dateKey, a.id);
                return `
                <label class="advance-card ${a.when}${checked ? " done" : ""}">
                  <input type="checkbox" class="task-check" data-check-id="${a.id}" ${checked ? "checked" : ""} />
                  <div>
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:2px;">
                      <span class="advance-badge">${a.when === "night" ? "Night before" : "This morning"}</span>
                      <strong>${a.label}</strong>
                    </div>
                    <div class="muted-note">${a.detail}</div>
                  </div>
                </label>`;
              })
              .join("")}
          </div>`;
      }

      ["breakfast", "lunch", "dinner", "snack"].forEach((slot) => {
        const entries = slots[slot];
        if (!entries.length) return;
        const eatMin = parseTimeToMinutes(times[slot]);
        const lead = slotLeadTime(entries, slot);
        const startMin = eatMin - lead;
        const timeKnown = entries.some((e) => {
          const p = Number(e.recipe.prep_time_min) || 0;
          const c = Number(e.recipe.cook_time_min) || 0;
          return p + c > 0;
        });

        bodyHtml += `
          <section class="meal-slot" data-slot="${slot}">
            <div class="meal-slot-header">
              <h3><span class="slot-icon">${SLOT_ICON[slot]}</span> ${SLOT_LABEL[slot]}</h3>
              <div style="text-align:right;">
                <div class="meal-slot-time">Eat at ${formatClock(eatMin)}</div>
                <div class="meal-slot-start">Start ~${lead} min before · ${formatClock(startMin)}${timeKnown ? "" : " (est.)"}</div>
              </div>
            </div>
            ${entries
              .map((e) => {
                const id = `meal:${e.recipe.recipe_id}:${e.idx}`;
                const checked = isChecked(dateKey, id);
                const expandKey = `${dateKey}:${id}`;
                const isOpen = expanded.has(expandKey);
                const steps = instructionsFor(e.recipe.recipe_id);
                const dur = recipeDurationMin(e.recipe, slot);
                const prep = Number(e.recipe.prep_time_min) || 0;
                const cook = Number(e.recipe.cook_time_min) || 0;
                const timeBits =
                  prep + cook > 0
                    ? `${prep ? `${prep} min prep` : ""}${prep && cook ? " · " : ""}${cook ? `${cook} min cook` : ""}`
                    : `~${dur} min (default for ${SLOT_LABEL[slot].toLowerCase()})`;

                return `
                <div class="task-recipe${checked ? " done" : ""}">
                  <div class="task-recipe-row">
                    <input type="checkbox" class="task-check" data-check-id="${id}" ${checked ? "checked" : ""} />
                    <div class="task-recipe-body">
                      <p class="task-recipe-title">${e.recipe.name}</p>
                      <div class="task-recipe-meta">${e.item.servings} serving${e.item.servings === 1 ? "" : "s"} · ${e.recipe.category} · ${timeBits}</div>
                      <p class="task-ingredients"><strong>Ingredients</strong><br>${keyIngredients(e.recipe, e.item.servings)}</p>
                      <button type="button" class="task-expand-btn" data-expand="${expandKey}" data-recipe-id="${e.recipe.recipe_id}">
                        ${isOpen ? "Hide instructions ▴" : "Show instructions ▾"}
                      </button>
                      ${
                        isOpen
                          ? `<div class="task-instructions">
                              <ol>${
                                steps.length
                                  ? steps.map((s) => `<li>${s.instruction_text}</li>`).join("")
                                  : `<li class="muted-note">No instructions added yet.</li>`
                              }</ol>
                              <button type="button" class="btn-secondary task-open-modal" data-recipe-id="${e.recipe.recipe_id}" style="margin-top:10px;font-size:0.8rem;">Open full recipe</button>
                            </div>`
                          : ""
                      }
                    </div>
                  </div>
                </div>`;
              })
              .join("")}
          </section>`;
      });
    }

    root.innerHTML = `
      <div class="tasks-header">
        <div>
          <h2>${heading}</h2>
          <p class="tasks-subheader">Plan day: <strong>${dayName}</strong> · tournament-ready prep checklist</p>
        </div>
        <div class="tasks-day-toggle">
          <button type="button" class="btn-secondary${viewOffset === 0 ? " active" : ""}" id="tasks-view-today">Today</button>
          <button type="button" class="btn-secondary${viewOffset === 1 ? " active" : ""}" id="tasks-view-tomorrow">Tomorrow</button>
        </div>
      </div>

      ${
        totalCount
          ? `<div class="tasks-progress">
              <div class="tasks-progress-bar"><div class="tasks-progress-fill" style="width:${pct}%"></div></div>
              <span class="tasks-progress-label">${doneCount} of ${totalCount} done</span>
            </div>`
          : ""
      }

      <div class="mealtimes-card">
        <h4>Meal times</h4>
        <div class="mealtimes-row">
          ${["breakfast", "lunch", "dinner", "snack"]
            .map(
              (slot) => `
            <div class="mealtime-field">
              <label for="mealtime-${slot}">${SLOT_LABEL[slot]}</label>
              <input type="time" id="mealtime-${slot}" data-slot="${slot}" value="${times[slot]}" />
            </div>`
            )
            .join("")}
        </div>
        <div class="muted-note" style="margin-top:8px;">Times stay on this device. Start times use each recipe’s prep + cook minutes when set; otherwise a slot default.</div>
      </div>

      ${bodyHtml}
    `;

    // Events
    document.getElementById("tasks-view-today")?.addEventListener("click", () => {
      viewOffset = 0;
      render();
    });
    document.getElementById("tasks-view-tomorrow")?.addEventListener("click", () => {
      viewOffset = viewOffset === 1 ? 0 : 1;
      render();
    });

    document.getElementById("tasks-goto-planner")?.addEventListener("click", () => {
      document.querySelector('.tab-btn[data-tab="planner"]')?.click();
    });

    root.querySelectorAll('input[type="time"][data-slot]').forEach((input) => {
      input.addEventListener("change", () => {
        const next = loadMealTimes();
        next[input.dataset.slot] = input.value || DEFAULT_MEALTIMES[input.dataset.slot];
        saveMealTimes(next);
        render();
      });
    });

    root.querySelectorAll("input.task-check[data-check-id]").forEach((box) => {
      box.addEventListener("change", () => {
        setChecked(dateKey, box.dataset.checkId, box.checked);
        render();
      });
    });

    root.querySelectorAll(".task-expand-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.expand;
        if (expanded.has(key)) expanded.delete(key);
        else expanded.add(key);
        render();
      });
    });

    root.querySelectorAll(".task-open-modal").forEach((btn) => {
      btn.addEventListener("click", () => openRecipeModal(btn.dataset.recipeId));
    });
  }

  return { render };
})();
