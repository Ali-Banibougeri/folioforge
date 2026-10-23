(() => {
  const words = {
    "FolioForge Arcade":"آرکید FolioForge",
    "Which memory are we playing?":"کدام خاطره را بازی کنیم؟",
    "Choose a game":"انتخاب بازی",
    "Back to résumé":"بازگشت به رزومه",
    "Unique visits":"بازدید یکتا",
    "Snake — Pocket Classic":"مار — کلاسیک جیبی",
    "Tetris — Falling Blocks":"تتریس — بلوک‌های سقوط‌کننده",
    "Breakout — Brick Breaker":"بریک‌اوت — شکستن آجرها",
    "Pac-Man — Maze Chase":"پک‌من — تعقیب در هزارتو",
    "Current score":"امتیاز فعلی",
    "Personal best":"بهترین امتیاز شخصی",
    "High-score hall":"تالار رکوردها",
    "Start game":"شروع بازی",
    "Pause":"مکث",
    "Restart":"شروع دوباره",
    "Save record":"ثبت رکورد",
    "Print / Save PDF":"چاپ / ذخیره PDF"
  };
  const originals = new WeakMap();
  let lang = "en";
  function apply(root) {
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement || node.parentElement.closest("script,style,canvas")) continue;
      if (!originals.has(node)) originals.set(node, node.nodeValue || "");
      const original = originals.get(node);
      const key = original.trim();
      if (!key) continue;
      const translated = lang === "fa" ? (words[key] || key) : key;
      node.nodeValue = original.replace(key, translated);
    }
  }
  function setLang(next, save) {
    lang = next === "fa" ? "fa" : "en";
    if (save) { try { localStorage.setItem("folioforge-language", lang); } catch (_) {} }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    apply(document.body);
    const button = document.getElementById("languageToggle");
    if (button) button.textContent = lang === "fa" ? "English" : "فارسی";
    window.dispatchEvent(new CustomEvent("site-language-changed", { detail: { language: lang } }));
  }
  const nav = document.querySelector(".nav-right");
  if (nav && !document.getElementById("languageToggle")) {
    const button = document.createElement("button");
    button.id = "languageToggle"; button.type = "button"; button.className = "language-toggle";
    button.addEventListener("click", () => setLang(lang === "en" ? "fa" : "en", true));
    nav.appendChild(button);
  }
  let saved = "en";
  try { saved = localStorage.getItem("folioforge-language") || "en"; } catch (_) {}
  setLang(saved, false);
  new MutationObserver((changes) => {
    if (lang !== "fa") return;
    for (const change of changes) for (const node of change.addedNodes) {
      if (node.nodeType === 1) apply(node);
      else if (node.nodeType === 3) apply(node.parentElement);
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
