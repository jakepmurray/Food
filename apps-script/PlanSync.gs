/**
 * PlanSync — a tiny read/write API for the Meal Planner app, bound to this
 * spreadsheet. Deploy this as a Web App (see README.md -> "Cross-device sync")
 * and paste the resulting URL into CONFIG.planSyncUrl in js/data-adapter.js.
 *
 * Two independent stores, each in its own tab:
 *
 *  1. Weekly plan — "PlanSync" tab. A1 = plan JSON, B1 = last updated.
 *       GET            -> current plan JSON
 *       POST <plan>    -> overwrites the stored plan, returns {status:"ok"}
 *
 *  2. Shopping list — "ShoppingSync" tab. A1 = shopping state JSON, B1 = last updated.
 *       GET  ?action=shopping
 *            -> {kind:"shoppingSync", version:1, state:{...}}
 *       POST {"__action":"shoppingMerge", "state":{...}}
 *            -> merges the sent state into the stored one (per-entry
 *               last-write-wins on updatedAt; deletes are tombstones), saves,
 *               returns {status:"ok", kind:"shoppingSync", state:<merged>}
 *
 * The two never touch each other's tab. Don't edit either tab by hand.
 *
 * POST bodies are sent as text/plain by the app (on purpose, so the browser
 * doesn't need a CORS preflight); they're parsed as JSON here.
 */

var SHOPPING_SYNC_VERSION = 1;

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "shopping") {
    var state = readShoppingState_();
    return json_({ kind: "shoppingSync", version: SHOPPING_SYNC_VERSION, state: state });
  }
  var sheet = getPlanSheet_();
  var raw = sheet.getRange("A1").getValue();
  if (!raw) raw = "{}";
  return ContentService.createTextOutput(raw).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var body = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
  var parsed;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    return json_({ error: "Invalid JSON: " + err.message });
  }

  if (parsed && parsed.__action === "shoppingMerge") {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var merged = mergeShopping_(readShoppingState_(), parsed.state || {});
      var sheet = getShoppingSheet_();
      sheet.getRange("A1").setValue(JSON.stringify(merged));
      sheet.getRange("B1").setValue(new Date());
      return json_({ status: "ok", kind: "shoppingSync", version: SHOPPING_SYNC_VERSION, state: merged });
    } finally {
      lock.releaseLock();
    }
  }

  // Default: weekly plan (unchanged behavior).
  var planSheet = getPlanSheet_();
  planSheet.getRange("A1").setValue(body);
  planSheet.getRange("B1").setValue(new Date());
  return json_({ status: "ok" });
}

// ---- shopping helpers ----
// State shape: { items:{id:entry}, checks:{id:entry}, hidden:{key:entry}, meta:{key:entry} }
// Every entry carries a numeric updatedAt (ms). For each key the entry with the
// larger updatedAt wins; deletes are kept as entries with deleted:true.
function mergeShopping_(a, b) {
  var out = {};
  ["items", "checks", "hidden", "meta"].forEach(function (bucket) {
    var x = (a && a[bucket]) || {};
    var y = (b && b[bucket]) || {};
    var merged = {};
    Object.keys(x).forEach(function (k) { merged[k] = x[k]; });
    Object.keys(y).forEach(function (k) {
      var cur = merged[k];
      var inc = y[k];
      if (!inc || typeof inc !== "object") return;
      if (!cur || Number(inc.updatedAt || 0) > Number(cur.updatedAt || 0)) merged[k] = inc;
    });
    out[bucket] = merged;
  });
  return out;
}

function readShoppingState_() {
  var raw = getShoppingSheet_().getRange("A1").getValue();
  if (!raw) return { items: {}, checks: {}, hidden: {}, meta: {} };
  try {
    var s = JSON.parse(raw);
    return { items: s.items || {}, checks: s.checks || {}, hidden: s.hidden || {}, meta: s.meta || {} };
  } catch (err) {
    return { items: {}, checks: {}, hidden: {}, meta: {} };
  }
}

function getShoppingSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("ShoppingSync");
  if (!sheet) {
    sheet = ss.insertSheet("ShoppingSync");
    sheet.getRange("A1").setValue("");
    sheet.getRange("A1").setNote("Synced shopping list (JSON) -- managed by the Meal Planner app. Don't edit by hand.");
    sheet.getRange("B1").setNote("Last updated");
  }
  return sheet;
}

function getPlanSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("PlanSync");
  if (!sheet) {
    sheet = ss.insertSheet("PlanSync");
    sheet.getRange("A1").setValue("{}");
    sheet.getRange("A1").setNote("Synced weekly plan (JSON) -- managed by the Meal Planner app. Don't edit by hand.");
    sheet.getRange("B1").setNote("Last updated");
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
