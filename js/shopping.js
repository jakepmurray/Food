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
const SHOP_KEY = "shoppingList.v2";      // synced state (local cache)
const SHOP_OLD_KEY = "shoppingList.v1";  // pre-sync format, migrated once
const SHOP_PREFS_KEY = "shoppingPrefs.v1"; // device-only prefs (day range)
const SHOP_SECTIONS = [
  { id: "meals", title: "Ingredients for meals", icon: "🍽️", placeholder: "Add an extra item…" },
  { id: "viv", title: "Ingredients for Viv", icon: "💚", placeholder: "Add something for Viv…" },
  { id: "other", title: "Other", icon: "🧺", placeholder: "Add household items, snacks…" },
];
const SHOP_CATEGORY_ORDER = ["Produce", "Meat", "Dairy", "Bakery", "Pantry", "Frozen", "Freezer", "Other"];

/*
 * Synced state: { items, checks, hidden, meta } — each a map of key -> entry
 * with a numeric updatedAt. Merging keeps the newer entry per key; deletes are
 * tombstones ({deleted:true}). The same merge runs in apps-script/PlanSync.gs.
 */
function shopEmpty() { return { items: {}, checks: {}, hidden: {}, meta: {} }; }

function shopMerge(a, b) {
  const out = {};
  ["items", "checks", "hidden", "meta"].forEach((bucket) => {
    const merged = { ...((a && a[bucket]) || {}) };
    Object.entries((b && b[bucket]) || {}).forEach(([k, inc]) => {
      if (!inc || typeof inc !== "object") return;
      const cur = merged[k];
      if (!cur || Number(inc.updatedAt || 0) > Number(cur.updatedAt || 0)) merged[k] = inc;
    });
    out[bucket] = merged;
  });
  return out;
}

function shopNow() { return Date.now(); }

// Seeds use stable ids and updatedAt 1, so every device seeds the same entries
// (no duplicates after merge) and any real edit/removal (updatedAt = now) wins.
const SHOP_SEED_VERSION = 1;
const LATTE_SEED = [
  ["Pumpkin spice latte", ["2 shots espresso (2 oz)", "3/4 cup milk", "2 tbsp pumpkin puree", "1/2 tsp pumpkin pie spice", "1 tbsp maple syrup or brown sugar", "1/4 tsp vanilla extract"]],
  ["Maple cinnamon latte", ["2 shots espresso (2 oz)", "3/4 cup milk", "1 tbsp maple syrup", "1/4 tsp ground cinnamon (+ pinch to top)"]],
  ["Ube latte", ["2 shots espresso (2 oz)", "3/4 cup milk", "1 tbsp ube halaya (or 1/4 tsp ube extract)", "1-2 tsp sweetened condensed milk or sugar"]],
];
function shopApplySeeds(st) {
  LATTE_SEED.forEach(([group, items]) => items.forEach((text, i) => {
    const id = `seed1:${group}:${i}`;
    if (!st.items[id]) st.items[id] = { id, section: "other", text, group, updatedAt: 1 };
  }));
  if (!st.meta.seedVersion) st.meta.seedVersion = { v: SHOP_SEED_VERSION, updatedAt: 1 };
  return st;
}

function shopMigrateV1(st) {
  let old;
  try { old = JSON.parse(localStorage.getItem(SHOP_OLD_KEY) || "null"); } catch (e) { old = null; }
  if (!old) return st;
  const t = shopNow();
  Object.entries(old.manual || {}).forEach(([section, arr]) => (arr || []).forEach((m) => {
    if (!st.items[m.id]) st.items[m.id] = { id: m.id, section, text: m.text, group: m.group || "", updatedAt: String(m.id).startsWith("seed") ? 1 : t };
  }));
  // Seeds the v1 user removed must stay removed.
  if ((old.seedVersion || 0) >= 1) LATTE_SEED.forEach(([group, items]) => items.forEach((_, i) => {
    const id = `seed1:${group}:${i}`;
    if (!st.items[id]) st.items[id] = { id, section: "other", deleted: true, updatedAt: t };
  }));
  Object.keys(old.checked || {}).forEach((id) => (st.checks[id] = { v: true, updatedAt: t }));
  Object.keys(old.hidden || {}).forEach((k) => (st.hidden[k] = { v: true, sig: old.planSig || "", updatedAt: t }));
  if (old.range) {
    const prefs = shopPrefs();
    if (!prefs.range) { prefs.range = old.range; localStorage.setItem(SHOP_PREFS_KEY, JSON.stringify(prefs)); }
  }
  localStorage.removeItem(SHOP_OLD_KEY);
  return st;
}

function shopLoad() {
  let st;
  try { st = JSON.parse(localStorage.getItem(SHOP_KEY) || "null"); } catch (e) { st = null; }
  const fresh = !st;
  st = shopMerge(shopEmpty(), st || {});
  if (fresh) st = shopMigrateV1(st);
  shopApplySeeds(st);
  if (fresh) localStorage.setItem(SHOP_KEY, JSON.stringify(st));
  return st;
}

function shopSave(st, { push = true } = {}) {
  localStorage.setItem(SHOP_KEY, JSON.stringify(st));
  if (push) ShopSync.schedulePush();
}

function shopPrefs() {
  try { return JSON.parse(localStorage.getItem(SHOP_PREFS_KEY) || "{}"); } catch (e) { return {}; }
}
function shopSavePrefs(p) { localStorage.setItem(SHOP_PREFS_KEY, JSON.stringify(p)); }

// ---- accessors over the synced state ----
function shopIsChecked(st, id) { return !!(st.checks[id] && st.checks[id].v); }
function shopSetChecked(st, id, v) { st.checks[id] = { v: !!v, updatedAt: shopNow() }; }
function shopIsHidden(st, key, sig) { const h = st.hidden[key]; return !!(h && h.v && h.sig === sig); }
function shopHide(st, key, sig) { st.hidden[key] = { v: true, sig, updatedAt: shopNow() }; }
function shopManual(st, section) {
  return Object.values(st.items)
    .filter((m) => !m.deleted && m.section === section)
    .sort((a, b) => (a.group || "").localeCompare(b.group || "") || String(a.id).localeCompare(String(b.id)));
}
function shopAddItem(st, section, text) {
  const id = `m:${shopNow().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  st.items[id] = { id, section, text, group: "", updatedAt: shopNow() };
}
function shopDeleteItem(st, id) {
  const cur = st.items[id] || { id };
  st.items[id] = { id, section: cur.section, deleted: true, updatedAt: shopNow() };
}

// ---- cross-device sync (separate "ShoppingSync" tab via ?action=shopping) ----
// Only ever POSTs after a GET proves the endpoint speaks the shopping protocol,
// so an older deployment (which would treat any POST as a plan write) is never
// sent shopping data.
const ShopSync = (() => {
  let status = "unknown"; // unknown | on | off | error
  let timer = null;
  const url = () => (typeof CONFIG !== "undefined" && typeof CONFIG.planSyncUrl === "string" && CONFIG.planSyncUrl.startsWith("https://")) ? CONFIG.planSyncUrl : "";

  async function pull() {
    if (!url()) { status = "off"; renderNote(); return; }
    try {
      const res = await fetch(`${url()}?action=shopping`, { cache: "no-store" });
      const data = await res.json();
      if (!data || data.kind !== "shoppingSync") { status = "off"; renderNote(); return; }
      status = "on";
      const merged = shopMerge(shopLoad(), data.state || {});
      shopSave(merged, { push: false });
      // Push back anything only this device had (e.g. first sync, offline edits).
      schedulePush(0);
      if (typeof renderShoppingList === "function") renderShoppingList();
    } catch (e) {
      status = status === "on" ? "error" : "off";
      console.warn("Shopping sync: pull failed; using this device's copy.", e);
      renderNote();
    }
  }

  function schedulePush(delay = 800) {
    if (status !== "on") return;
    clearTimeout(timer);
    timer = setTimeout(push, delay);
  }

  async function push() {
    if (status !== "on") return;
    try {
      const res = await fetch(url(), {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ __action: "shoppingMerge", state: shopLoad() }),
      });
      const data = await res.json();
      if (!data || data.kind !== "shoppingSync") throw new Error("unexpected response");
      const merged = shopMerge(shopLoad(), data.state || {});
      const before = localStorage.getItem(SHOP_KEY);
      shopSave(merged, { push: false });
      status = "on";
      if (localStorage.getItem(SHOP_KEY) !== before && typeof renderShoppingList === "function") renderShoppingList();
      else renderNote();
    } catch (e) {
      status = "error";
      console.warn("Shopping sync: push failed; kept on this device for now.", e);
      renderNote();
    }
  }

  function renderNote() {
    const el = document.getElementById("shop-sync-note");
    if (!el) return;
    const text = {
      unknown: "Checking sync…",
      on: "✓ Synced across your devices",
      off: "Sync off — saved on this device only",
      error: "Sync failed — saved on this device; will retry",
    }[status];
    el.textContent = text;
    el.className = `shop-sync-note ${status}`;
  }

  return { pull, schedulePush, renderNote, get status() { return status; } };
})();

// ---- day range (device-only pref) ----
function shopDefaultRange() { return { mode: "through", end: "Tue" }; }
function shopRange() { return shopPrefs().range || shopDefaultRange(); }
function shopSetRange(r) { const p = shopPrefs(); p.range = r; shopSavePrefs(p); }
function shopSelectedDays() {
  const r = shopRange();
  if (r.mode === "custom") return DAYS.filter((d) => (r.days || []).includes(d));
  const order = shopDayOrderFromToday();
  const endIdx = order.indexOf(r.end);
  return endIdx < 0 ? order : order.slice(0, endIdx + 1);
}
function shopDayOrderFromToday() {
  const i = DAYS.indexOf(todayDayName());
  return [...DAYS.slice(i), ...DAYS.slice(0, i)];
}

function isPreparedMeal(r) {
  return String(r.tags || "").toLowerCase().split(",").map((t) => t.trim()).includes("cookunity");
}

function planSignature() {
  return JSON.stringify(shopSelectedDays().map((d) => [d, (plan[d] || []).map((i) => `${i.recipe_id}x${i.servings}`)]));
}

function shopMode() { return shopPrefs().mode === "exact" ? "exact" : "batch"; }
function shopSetMode(m) { const p = shopPrefs(); p.mode = m; shopSavePrefs(p); }
function shopNum(v) { const n = Number(v); return v !== "" && v !== null && v !== undefined && !isNaN(n) && n > 0 ? n : 0; }

// Totals planned servings per recipe across the selected days, then (in batch
// mode) rounds up to whole batches of default_servings. Recipes with a blank or
// 1 default_servings stay per serving.
function autoMealItems() {
  const perRecipe = {};
  shopSelectedDays().forEach((day) => (plan[day] || []).forEach((item) => {
    const r = recipeById(item.recipe_id);
    if (!r || isPreparedMeal(r)) return;
    const e = (perRecipe[r.recipe_id] = perRecipe[r.recipe_id] || { r, servings: 0 });
    e.servings += Number(item.servings || 1);
  }));
  const batchMode = shopMode() === "batch";
  const totals = {};
  Object.values(perRecipe).forEach(({ r, servings }) => {
    const ds = shopNum(r.default_servings);
    const byBatch = batchMode && ds > 1;
    const batches = byBatch ? Math.ceil(servings / ds) : 0;
    const label = byBatch ? `${r.name} ×${batches} batch${batches === 1 ? "" : "es"}` : `${r.name} (${fmtQty(servings)} serving${servings === 1 ? "" : "s"})`;
    ingredientsFor(r.recipe_id).forEach((ing) => {
      let qty = 0, unit = ing.unit || "";
      if (byBatch && shopNum(ing.quantity_per_batch)) { qty = shopNum(ing.quantity_per_batch) * batches; unit = ing.unit_per_batch || unit; }
      else if (hasQty(ing)) qty = Number(ing.quantity_per_serving) * (byBatch ? ds * batches : servings);
      const key = `auto:${String(ing.ingredient_name).toLowerCase()}|${unit}`;
      if (!totals[key]) totals[key] = { key, name: ing.ingredient_name, unit, qty: 0, needsQty: false, category: String(ing.shopping_category || "").trim() || "Other groceries", recipes: new Set() };
      const t = totals[key];
      if (qty > 0) t.qty += qty; else t.needsQty = true;
      t.recipes.add(label);
    });
  });
  return Object.values(totals);
}

const SHOP_FRACTION_UNITS = /^(cups?|c|tbsp|tablespoons?|tsp|teaspoons?)$/i;
const SHOP_COUNT_UNITS = /^(|each|ea|whole|pieces?|pcs?|cloves?|cans?|eggs?|large|medium|small|slices?|stalks?|heads?|bunch(es)?|sprigs?|fillets?|breasts?|thighs?|bags?|packages?|pkg|jars?|bottles?|loaf|loaves|links?)$/i;
function shopFmtAmount(q, unit) {
  const u = String(unit || "").trim();
  if (SHOP_COUNT_UNITS.test(u)) return String(Math.ceil(q - 1e-9));
  if (SHOP_FRACTION_UNITS.test(u)) {
    const step = /tsp|teaspoon|tbsp|tablespoon/i.test(u) ? 8 : 4;
    const n = Math.max(1, Math.round(q * step)); const w = Math.floor(n / step), f = n % step;
    const g = (x, y) => (y ? g(y, x % y) : x); const d = g(f, step);
    const frac = f ? `${f / d}/${step / d}` : "";
    return [w || "", frac].filter(Boolean).join(" ") || "0";
  }
  return fmtQty(q);
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function autoQtyText(t) {
  if (t.qty > 0) return `${shopFmtAmount(t.qty, t.unit)} ${t.unit}${t.needsQty ? " +" : ""}`.trim();
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

  const auto = autoMealItems().filter((t) => !shopIsHidden(st, t.key, sig));
  const skipped = new Set();
  shopSelectedDays().forEach((d) => (plan[d] || []).forEach((i) => { const r = recipeById(i.recipe_id); if (r && isPreparedMeal(r)) skipped.add(r.name); }));

  const byCat = {};
  auto.forEach((t) => (byCat[t.category] = byCat[t.category] || []).push(t));
  const cats = Object.keys(byCat).sort((a, b) => {
    const ia = a === "Other groceries" ? 99 : (SHOP_CATEGORY_ORDER.indexOf(a) + 1 || 50);
    const ib = b === "Other groceries" ? 99 : (SHOP_CATEGORY_ORDER.indexOf(b) + 1 || 50);
    return ia - ib || a.localeCompare(b);
  });

  let total = 0, done = 0;
  const count = (id) => { total++; if (shopIsChecked(st, id)) done++; };

  const sectionsHtml = SHOP_SECTIONS.map((sec) => {
    let body = "";
    if (sec.id === "meals") {
      body += shopRangeHtml(st);
      if (!auto.length) body += `<p class="muted-note shop-empty">No plan ingredients yet — add recipes in the Weekly Planner.</p>`;
      cats.forEach((cat) => {
        const items = byCat[cat].sort((a, b) => a.name.localeCompare(b.name));
        body += `<div class="shop-subcat">${escHtml(cat)}</div><ul class="shop-items">${items.map((t) => {
          count(t.key);
          return shopItemRow(t.key, t.name, [...t.recipes].join(", "), autoQtyText(t), shopIsChecked(st, t.key));
        }).join("")}</ul>`;
      });
      if (skipped.size) body += `<p class="muted-note">Skipped prepared meals: ${escHtml([...skipped].join(", "))}</p>`;
    }
    const manual = shopManual(st, sec.id);
    if (manual.length) {
      if (sec.id === "meals") body += `<div class="shop-subcat">Extras</div>`;
      const groups = [];
      manual.forEach((m) => { const g = m.group || ""; let e = groups.find((x) => x.g === g); if (!e) groups.push((e = { g, items: [] })); e.items.push(m); });
      groups.sort((a, b) => (a.g === "" ? 1 : 0) - (b.g === "" ? 1 : 0));
      body += groups.map((grp) => `${grp.g ? `<div class="shop-subcat">☕ ${escHtml(grp.g)}</div>` : (groups.length > 1 ? `<div class="shop-subcat">Added</div>` : "")}<ul class="shop-items">${grp.items.map((m) => { count(m.id); return shopItemRow(m.id, m.text, "", "", shopIsChecked(st, m.id)); }).join("")}</ul>`).join("");
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
    <p id="shop-sync-note" class="shop-sync-note"></p>
    ${total ? `<div class="tasks-progress"><div class="tasks-progress-bar"><div class="tasks-progress-fill" style="width:${Math.round((done / total) * 100)}%"></div></div><span class="tasks-progress-label">${done} of ${total} in the cart</span></div>` : ""}
    ${sectionsHtml}`;

  ShopSync.renderNote();
  container.querySelectorAll(".shop-mode-btn").forEach((b) => b.addEventListener("click", () => { shopSetMode(b.dataset.mode); renderShoppingList(); }));
  container.querySelectorAll(".shop-day-chip").forEach((chip) => chip.addEventListener("click", () => {
    const cur = new Set(shopSelectedDays());
    cur.has(chip.dataset.day) ? cur.delete(chip.dataset.day) : cur.add(chip.dataset.day);
    shopSetRange({ mode: "custom", days: DAYS.filter((d) => cur.has(d)) });
    renderShoppingList();
  }));
  const thru = container.querySelector("#shop-through");
  if (thru) thru.addEventListener("change", () => {
    const r = shopRange();
    shopSetRange(thru.value ? { mode: "through", end: thru.value } : (r.mode === "custom" ? r : { mode: "custom", days: shopSelectedDays() }));
    renderShoppingList();
  });

  container.querySelectorAll(".shop-add").forEach((form) => form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    const s = shopLoad();
    shopAddItem(s, form.dataset.section, text);
    shopSave(s);
    renderShoppingList();
    const again = document.querySelector(`.shop-add[data-section="${form.dataset.section}"] input`);
    if (again) again.focus();
  }));

  container.querySelectorAll(".shop-check").forEach((box) => box.addEventListener("change", () => {
    const s = shopLoad();
    shopSetChecked(s, box.dataset.id, box.checked);
    shopSave(s);
    renderShoppingList();
  }));

  container.querySelectorAll(".shop-remove").forEach((btn) => btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const s = shopLoad();
    if (id.startsWith("auto:")) shopHide(s, id, planSignature());
    else shopDeleteItem(s, id);
    shopSetChecked(s, id, false);
    shopSave(s);
    renderShoppingList();
  }));
}

function shoppingListAsText() {
  const st = shopLoad();
  const lines = ["Shopping List"];
  const sig = planSignature();
  const auto = autoMealItems().filter((t) => !shopIsHidden(st, t.key, sig) && !shopIsChecked(st, t.key));
  SHOP_SECTIONS.forEach((sec) => {
    const rows = [];
    if (sec.id === "meals") auto.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
      .forEach((t) => rows.push(`- ${t.name}${autoQtyText(t) ? ` (${autoQtyText(t)})` : ""}`));
    shopManual(st, sec.id).filter((m) => !shopIsChecked(st, m.id)).forEach((m) => rows.push(`- ${m.text}${m.group ? ` (${m.group})` : ""}`));
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
  const ids = Object.keys(s.checks).filter((id) => shopIsChecked(s, id));
  if (!ids.length) { shopToast("Nothing checked yet"); return; }
  const sig = planSignature();
  ids.forEach((id) => {
    if (id.startsWith("auto:")) shopHide(s, id, sig);
    else shopDeleteItem(s, id);
    shopSetChecked(s, id, false);
  });
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

function shopRangeHtml(st) {
  const sel = new Set(shopSelectedDays());
  const r = shopRange();
  const order = shopDayOrderFromToday();
  const today = todayDayName();
  return `
    <div class="shop-range">
      <div class="shop-range-row">
        <label for="shop-through">From today (${today}) through</label>
        <select id="shop-through">
          <option value=""${r.mode === "custom" ? " selected" : ""}>Custom days…</option>
          ${order.map((d) => `<option value="${d}"${r.mode === "through" && r.end === d ? " selected" : ""}>${d === today ? `${d} (today only)` : d}</option>`).join("")}
        </select>
      </div>
      <div class="shop-range-row shop-mode">
        <span>Shop by:</span>
        <button type="button" class="shop-mode-btn${shopMode() === "batch" ? " on" : ""}" data-mode="batch">full batches</button>
        <button type="button" class="shop-mode-btn${shopMode() === "exact" ? " on" : ""}" data-mode="exact">exact servings</button>
      </div>
      <div class="shop-days">
        ${order.map((d) => `<button type="button" class="shop-day-chip${sel.has(d) ? " on" : ""}" data-day="${d}" aria-pressed="${sel.has(d)}">${d}</button>`).join("")}
      </div>
    </div>`;
}

// Pull shared shopping state on load and whenever "Sync now" is pressed.
document.getElementById("sync-now-btn")?.addEventListener("click", () => ShopSync.pull());
window.addEventListener("focus", () => { if (ShopSync.status === "on") ShopSync.pull(); });
ShopSync.pull();
