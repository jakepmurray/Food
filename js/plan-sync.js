/*
 * Plan sync — pushes/pulls the weekly plan to a tiny Google Apps Script "Web
 * App" bound to your spreadsheet, so the same plan shows up on every device
 * instead of being stuck in one browser's local storage.
 *
 * This is "sync on load / sync on change," not realtime collaboration: a
 * change made on one device shows up on another the next time that device
 * loads the app (or hits the "Sync now" button in the header) — not
 * instantly while both are open. Last write wins if two devices save at
 * nearly the same moment.
 *
 * ── One-time setup (in Google Sheets) ──────────────────────────────────
 * 1. Open your spreadsheet -> Extensions > Apps Script.
 * 2. Delete any starter code in Code.gs, paste in the contents of
 *    apps-script/PlanSync.gs instead.
 * 3. Deploy > New deployment -> gear icon -> type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Click Deploy, then "Authorize access" and approve the prompts (this
 *    is your own script acting on your own spreadsheet).
 * 5. Copy the Web App URL it gives you (ends in /exec) and paste it into
 *    CONFIG.planSyncUrl in js/data-adapter.js.
 * The "PlanSync" tab it needs is created automatically the first time it
 * runs -- nothing else to set up.
 *
 * Without a URL configured, everything below is a no-op and the app behaves
 * exactly as it did before: local-storage-only, single device.
 */

const PlanSync = (() => {
  function isConfigured() {
    return typeof CONFIG.planSyncUrl === "string" && CONFIG.planSyncUrl.startsWith("https://");
  }

  async function fetchPlan() {
    if (!isConfigured()) return null;
    try {
      const res = await fetch(CONFIG.planSyncUrl, { cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      return data && typeof data === "object" && !Array.isArray(data) ? data : null;
    } catch (e) {
      console.warn("Plan sync: couldn't fetch the remote plan, using the local copy.", e);
      return null;
    }
  }

  async function pushPlan(planObj) {
    if (!isConfigured()) return false;
    try {
      // text/plain avoids a CORS preflight that Apps Script web apps don't handle well;
      // the server side still parses the body as JSON.
      const res = await fetch(CONFIG.planSyncUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(planObj),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data && data.status === "ok";
    } catch (e) {
      console.warn("Plan sync: couldn't save to the remote plan; kept in local storage only for now.", e);
      return false;
    }
  }

  return { isConfigured, fetchPlan, pushPlan };
})();
