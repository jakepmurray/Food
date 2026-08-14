/*
 * Data adapter — the ONLY file you need to touch to switch this app
 * from placeholder data to your real, published Google Sheet.
 *
 * ── How this is wired up ──────────────────────────────────────────
 * CONFIG.source = "sheet" reads from the workbook published at:
 *   https://docs.google.com/spreadsheets/d/e/2PACX-1vSurFaIeECFQs0rus1xlvaTKNh5_5_ryoF3-58xaBIli2hwA70VR9rQM-IwmgEq_QuV9mpwUpkuz3ag/pubhtml
 * (File > Share > Publish to web). Each tab's numeric gid below was read
 * out of the published sheet's own tab switcher (open the pubhtml link
 * and inspect network requests, or check the iframe src when a tab is
 * selected).
 *
 * If you republish under a different link (e.g. from a new copy of the
 * workbook), update CONFIG.publishedId to the new "2PACX-..." segment
 * from the pubhtml URL, and re-check each gid the same way — a fresh
 * publish can reassign them. sheets/meal_planner_master.xlsx has the
 * matching tab layout.
 */

const CONFIG = {
  // "mock" = use the placeholder data in mock-data.js
  // "sheet" = fetch live CSV from the published Google Sheet below
  source: "sheet",

  // The "2PACX-..." id from the published pubhtml URL (not the regular
  // edit-link spreadsheet id — publishing to web issues its own id).
  publishedId: "2PACX-1vSurFaIeECFQs0rus1xlvaTKNh5_5_ryoF3-58xaBIli2hwA70VR9rQM-IwmgEq_QuV9mpwUpkuz3ag",
  // Same gids as the previous publish — a republish of the same file keeps each tab's
  // gid stable, it only issues a new "2PACX-..." publication id above.
  gids: {
    recipes: "235011287",
    ingredients: "687348207",
    instructions: "326115605",
    wasteReduction: "959856370",
    nutritionTargets: "199518097",
  },

  // Cross-device sync for the weekly plan (which recipes are on which day).
  // Leave this as-is to keep the plan local-storage-only, single-device.
  // See js/plan-sync.js for the one-time setup that gets you this URL.
  planSyncUrl: "https://script.google.com/macros/s/AKfycbwNUhrycoFmZJlEpE4HG2Gs6rtGFXXtsICitZF3dHjisTnWdN9DUBk0gsb1jqwpPCs/exec",
};

const DataSource = (() => {
  function csvUrl(gid) {
    return `https://docs.google.com/spreadsheets/d/e/${CONFIG.publishedId}/pub?gid=${gid}&single=true&output=csv`;
  }

  // Minimal RFC 4180 CSV parser: handles quoted fields, escaped quotes,
  // and commas/newlines inside quotes — enough for Sheets' CSV export.
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += c;
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field); field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); field = "";
        if (row.length > 1 || row[0] !== "") rows.push(row);
        row = [];
      } else {
        field += c;
      }
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }

    const headers = rows.shift().map((h) => h.trim());
    return rows
      .filter((r) => r.some((cell) => cell.trim() !== ""))
      .map((r) => {
        const obj = {};
        headers.forEach((h, idx) => {
          const raw = (r[idx] ?? "").trim();
          obj[h] = raw !== "" && !isNaN(raw) && raw !== "" ? Number(raw) : raw;
        });
        return obj;
      });
  }

  async function fetchSheet(tabName) {
    const res = await fetch(csvUrl(CONFIG.gids[tabName]));
    if (!res.ok) throw new Error(`Failed to load "${tabName}" tab (HTTP ${res.status})`);
    return parseCsv(await res.text());
  }

  async function load() {
    if (CONFIG.source === "mock") {
      return {
        recipes: MOCK_RECIPES,
        ingredients: MOCK_INGREDIENTS,
        instructions: MOCK_INSTRUCTIONS,
        wasteReduction: MOCK_WASTE_REDUCTION,
        nutritionTargets: MOCK_NUTRITION_TARGETS,
      };
    }

    const [recipes, ingredients, instructions, wasteReduction, nutritionTargets] = await Promise.all([
      fetchSheet("recipes"),
      fetchSheet("ingredients"),
      fetchSheet("instructions"),
      fetchSheet("wasteReduction"),
      fetchSheet("nutritionTargets"),
    ]);
    return { recipes, ingredients, instructions, wasteReduction, nutritionTargets };
  }

  return { load };
})();
