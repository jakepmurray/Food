/*
 * Shopping List: three sections.
 *  1. "Ingredients for meals" — auto-generated from the weekly plan (skips
 *     cookunity prepared meals), plus manual extras.
 *  2. "Ingredients for Viv" — manual.
 *  3. "Other" — manual.
 * Manual items, check state, and hidden auto items live in localStorage
 * (this device only). Depends on app.js globals: DAYS, plan, recipeById,
 * ingredientsFor, hasQty, fmtQty.
 */
const SHOP_KEY = "shoppingList.v1";
const SHOP_SECTIONS = [
  { id: "meals", title: "Ingredients for meals", icon: "🍽️", placeholder: "Add an extra item…" },
  { id: "viv", title: "Ingredients for Viv", icon: "💚", placeholder: "Add something for Viv…" },
  { id: "other", title: "Other", icon: "🧺", placeholder: "Add household items, snacks…" },
];
const SHOP_CATEGORY_ORDER = ["Produce", "Meat", "Dairy", "Bakery", "Pantry", "Frozen", "Freezer", "Other"];

function shopLoad() {
  try {
    const s = JSON.parse(localStorage.getItem(SHOP_KEY) || "{}");
    return { manual: s.manual || { meals: [], viv: [], other: [] }, checked: s.checked || {}, hidden: s.hidden || {}, planSig: s.planSig || "" };
  } catch (e) {
    return { manual: { meals: [], viv: [], other: [] }, checked: {}, hidden: {}, planSig: "" };
  }
}
function shopSave(st) { localStorage.setItem(SHOP_KEY, JSON.stringify(st)); }

function isPreparedMeal(r) {
  return String(r.tags || "").toLowerCase().split(",").map((t) => t.trim()).includes("cookunity");
}

function planSignature() {
  return JSON.stringify(DAYS.map((d) => (plan[d] || []).map((i) => `${i.recipe_id}x${i.servings}`)));
}

function autoMealItems() {
  const totals = {};
  DAYS.forEach((day) => (plan[day] || []).forEach((item) => {
    const r = recipeById(item.recipe_id);
    if (!r || isPreparedMeal(r)) return;
    ingredientsFor(item.recipe_id).forEach((ing) => {
      const key = `auto:${String(ing.ingredient_name).toLowerCase()}|${ing.unit || ""}`;
      if (!totals[key]) totals[key] = { key, name: ing.ingredient_name, unit: ing.unit || "", qty: 0, needsQty: false, category: String(ing.shopping_category || "").trim() || "Other groceries", recipes: new Set() };
      const t = totals[key];
      if (hasQty(ing)) t.qty += Number(ing.quantity_per_serving) * Number(item.servings || 1);
      else t.needsQty = true;
      t.recipes.add(r.name);
    });
  }));
  return Object.values(totals);
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function autoQtyText(t) {
  if (t.qty > 0) return `${fmtQty(t.qty)} ${t.unit}${t.needsQty ? " +" : ""}`.trim();
  return "";
}

function shopItemRow(id, label, sub, qty, checked) {
  return `
    <li class="shop-item${checked ? " checked" : ""}" data-id="${escHtml(id)}">
      <label class="shop-item-main">
        <input type="checkbox" class="shop-check" data-id="${escHtml(id)}" ${checked ? "checked" : ""} />
        <span class="shop-item-text">
          <span class="shop-item-name">${escHtml(label)}</span>
          ${sub ? `<span class="shop-item-sub">${escHtml(sub)}</span>` : ""}
        </span>
      </label>
      ${qty ? `<span class="qty">${escHtml(qty)}</span>` : ""}
      <button type="button" class="shop-remove" data-id="${escHtml(id)}" title="Remove" aria-label="Remove ${escHtml(label)}">&times;</button>
    </li>`;
}

function renderShoppingList() {
  const container = document.getElementById("shopping-list");
  if (!container) return;
  const st = shopLoad();
  const sig = planSignature();
  if (st.planSig !== sig) { st.hidden = {}; st.planSig = sig; shopSave(st); }

  const auto = autoMealItems().filter((t) => !st.hidden[t.key]);
  const skipped = new Set();
  DAYS.forEach((d) => (plan[d] || []).forEach((i) => { const r = recipeById(i.recipe_id); if (r && isPreparedMeal(r)) skipped.add(r.name); }));

  const byCat = {};
  auto.forEach((t) => (byCat[t.category] = byCat[t.category] || []).push(t));
  const cats = Object.keys(byCat).sort((a, b) => {
    const ia = a === "Other groceries" ? 99 : (SHOP_CATEGORY_ORDER.indexOf(a) + 1 || 50);
    const ib = b === "Other groceries" ? 99 : (SHOP_CATEGORY_ORDER.indexOf(b) + 1 || 50);
    return ia - ib || a.localeCompare(b);
  });

  let total = 0, done = 0;
  const count = (id) => { total++; if (st.checked[id]) done++; };

  const sectionsHtml = SHOP_SECTIONS.map((sec) => {
    let body = "";
    if (sec.id === "meals") {
      if (!auto.length) body += `<p class="muted-note shop-empty">No plan ingredients yet — add recipes in the Weekly Planner.</p>`;
      cats.forEach((cat) => {
        const items = byCat[cat].sort((a, b) => a.name.localeCompare(b.name));
        body += `<div class="shop-subcat">${escHtml(cat)}</div><ul class="shop-items">${items.map((t) => {
          count(t.key);
          return shopItemRow(t.key, t.name, [...t.recipes].join(", "), autoQtyText(t), !!st.checked[t.key]);
        }).join("")}</ul>`;
      });
      if (skipped.size) body += `<p class="muted-note">Skipped prepared meals: ${escHtml([...skipped].join(", "))}</p>`;
    }
    const manual = st.manual[sec.id] || [];
    if (manual.length) {
      if (sec.id === "meals") body += `<div class="shop-subcat">Extras</div>`;
      body += `<ul class="shop-items">${manual.map((m) => { count(m.id); return shopItemRow(m.id, m.text, "", "", !!st.checked[m.id]); }).join("")}</ul>`;
    } else if (sec.id !== "meals") {
      body += `<p class="muted-note shop-empty">Nothing here yet.</p>`;
    }
    return `
      <section class="shop-section" data-section="${sec.id}">
        <h3 class="shop-section-title"><span>${sec.icon}</span> ${escHtml(sec.title)}</h3>
        <form class="shop-add" data-section="${sec.id}">
          <input type="text" class="shop-add-input" placeholder="${escHtml(sec.placeholder)}" aria-label="${escHtml(sec.placeholder)}" />
          <button type="submit" class="shop-add-btn" aria-label="Add">+</button>
        </form>
        ${body}
      </section>`;
  }).join("");

  container.innerHTML = `
    ${total ? `<div class="tasks-progress"><div class="tasks-progress-bar"><div class="tasks-progress-fill" style="width:${Math.round((done / total) * 100)}%"></div></div><span class="tasks-progress-label">${done} of ${total} in the cart</span></div>` : ""}
    ${sectionsHtml}`;

  container.querySelectorAll(".shop-add").forEach((form) => form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    const s = shopLoad();
    s.manual[form.dataset.section] = s.manual[form.dataset.section] || [];
    s.manual[form.dataset.section].push({ id: `m:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, text });
    shopSave(s);
    renderShoppingList();
    const again = document.querySelector(`.shop-add[data-section="${form.dataset.section}"] input`);
    if (again) again.focus();
  }));

  container.querySelectorAll(".shop-check").forEach((box) => box.addEventListener("change", () => {
    const s = shopLoad();
    if (box.checked) s.checked[box.dataset.id] = true; else delete s.checked[box.dataset.id];
    shopSave(s);
    renderShoppingList();
  }));

  container.querySelectorAll(".shop-remove").forEach((btn) => btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const s = shopLoad();
    if (id.startsWith("auto:")) s.hidden[id] = true;
    else Object.keys(s.manual).forEach((k) => (s.manual[k] = s.manual[k].filter((m) => m.id !== id)));
    delete s.checked[id];
    shopSave(s);
    renderShoppingList();
  }));
}

function shoppingListAsText() {
  const st = shopLoad();
  const lines = ["Shopping List"];
  const auto = autoMealItems().filter((t) => !st.hidden[t.key] && !st.checked[t.key]);
  SHOP_SECTIONS.forEach((sec) => {
    const rows = [];
    if (sec.id === "meals") auto.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
      .forEach((t) => rows.push(`- ${t.name}${autoQtyText(t) ? ` (${autoQtyText(t)})` : ""}`));
    (st.manual[sec.id] || []).filter((m) => !st.checked[m.id]).forEach((m) => rows.push(`- ${m.text}`));
    if (rows.length) lines.push("", `${sec.title}:`, ...rows);
  });
  return lines.join("\n");
}

function shopToast(msg) {
  const el = document.getElementById("shop-toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(shopToast._t);
  shopToast._t = setTimeout(() => el.classList.add("hidden"), 2200);
}

document.getElementById("shop-clear-checked")?.addEventListener("click", () => {
  const s = shopLoad();
  const ids = Object.keys(s.checked);
  if (!ids.length) { shopToast("Nothing checked yet"); return; }
  ids.forEach((id) => {
    if (id.startsWith("auto:")) s.hidden[id] = true;
    else Object.keys(s.manual).forEach((k) => (s.manual[k] = s.manual[k].filter((m) => m.id !== id)));
  });
  s.checked = {};
  shopSave(s);
  renderShoppingList();
  shopToast(`Cleared ${ids.length} item${ids.length === 1 ? "" : "s"}`);
});

document.getElementById("shop-share")?.addEventListener("click", async () => {
  const text = shoppingListAsText();
  try {
    if (navigator.share) { await navigator.share({ title: "Shopping List", text }); return; }
  } catch (e) { if (e && e.name === "AbortError") return; }
  try {
    await navigator.clipboard.writeText(text);
    shopToast("Copied to clipboard");
  } catch (e) {
    window.prompt("Copy your list:", text);
  }
});
