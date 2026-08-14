/**
 * PlanSync — a tiny read/write API for the Meal Planner app's weekly plan,
 * bound to this spreadsheet. Deploy this as a Web App (see README.md ->
 * "Cross-device sync") and paste the resulting URL into CONFIG.planSyncUrl
 * in js/data-adapter.js.
 *
 * Storage: a "PlanSync" tab is created automatically the first time this
 * runs. Cell A1 holds the plan as a JSON string; B1 holds the last-updated
 * timestamp. Don't edit that tab by hand — it's app-managed.
 *
 * GET  -> returns the current plan as JSON.
 * POST -> body is the new plan as a JSON string (sent as text/plain by the
 *         app, on purpose, so the browser doesn't need a CORS preflight);
 *         overwrites the stored plan and returns {status:"ok"}.
 */

function doGet(e) {
  var sheet = getPlanSheet_();
  var json = sheet.getRange("A1").getValue();
  if (!json) json = "{}";
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var body = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";

  try {
    JSON.parse(body);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid JSON: " + err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = getPlanSheet_();
  sheet.getRange("A1").setValue(body);
  sheet.getRange("B1").setValue(new Date());

  return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
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
