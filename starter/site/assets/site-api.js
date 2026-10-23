(() => {
  const cfg = window.FOLIOFORGE_SITE_CONFIG || {};
  const key = String(cfg.publishableKey || "").trim();
  const configured = Boolean(cfg.supabaseUrl && !cfg.supabaseUrl.includes("YOUR_PROJECT_REF") && key.length > 10 && !key.includes("PASTE_SUPABASE"));
  const endpoint = String(cfg.supabaseUrl || "").replace(/\/$/, "") + "/functions/v1/" + (cfg.functionName || "visitor-counter");

  function visitorId() {
    const storageKey = "folioforge-visitor-id-v1";
    try {
      let id = localStorage.getItem(storageKey);
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(storageKey, id);
      }
      return id;
    } catch (_) {
      return crypto.randomUUID();
    }
  }

  async function call(payload) {
    if (!configured) throw new Error("Shared API is not configured.");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key },
      body: JSON.stringify(payload)
    });
    let data;
    try { data = await response.json(); } catch (_) { data = {}; }
    if (!response.ok) {
      const error = new Error(data.message || data.error || "The API request failed.");
      error.code = data.error || "api_error";
      throw error;
    }
    return data;
  }

  window.FolioForgeAPI = {
    isConfigured: () => configured,
    call
  };

  async function countView() {
    const target = document.getElementById("pageViews");
    const notice = document.getElementById("counterSetupNotice");
    const data = window.FOLIOFORGE_DATA || {};
    const enabled = !data.features || data.features.visitorCounterEnabled !== false;
    const params = new URLSearchParams(window.location.search);
    const localPreview = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) || window.location.protocol === "file:";
    const setupMode = localPreview || params.get("setup") === "1";
    if (notice) notice.hidden = !enabled || configured || !setupMode;
    if (target && !enabled) target.closest(".visitor-stat")?.setAttribute("hidden", "");
    if (!target || !configured || !enabled) return;
    try {
      const result = await call({ action: "view", page: "home", visitor_id: visitorId() });
      target.textContent = new Intl.NumberFormat().format(Number(result.count) || 0);
    } catch (_) {
      target.textContent = "—";
      target.title = "Shared visitor counter is unavailable.";
    }
  }
  document.addEventListener("DOMContentLoaded", countView);
  if (document.readyState !== "loading") countView();
})();
