(() => {
  const cfg = window.FOLIOFORGE_SITE_CONFIG || {};
  const key = String(cfg.publishableKey || "").trim();
  const configured = Boolean(cfg.supabaseUrl && key.length > 10 && !key.includes("PASTE_SUPABASE"));
  const endpoint = String(cfg.supabaseUrl || "").replace(/\/$/, "") + "/functions/v1/" + (cfg.functionName || "arcade-api");

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
    if (!target || !configured) return;
    try {
      const page = document.body.dataset.page === "arcade" ? "arcade" : "home";
      const result = await call({ action: "view", page, visitor_id: visitorId() });
      target.textContent = new Intl.NumberFormat().format(Number(result.count) || 0);
    } catch (_) {
      target.textContent = "—";
      target.title = "Shared visitor counter is unavailable.";
    }
  }
  document.addEventListener("DOMContentLoaded", countView);
  if (document.readyState !== "loading") countView();
})();
