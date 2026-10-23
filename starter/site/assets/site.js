(() => {
  "use strict";
  const data = window.FOLIOFORGE_DATA;
  if (!data || !data.en || !data.fa) {
    console.error("FolioForge content is missing. Check assets/portfolio-data.js.");
    return;
  }
  const $ = (id) => document.getElementById(id);
  const ui = {
    en: {
      heroContact: "Contact me",
      panelOverline: "PERSONAL PORTFOLIO",
      panelCaption: "A focused introduction to my experience, projects, and way of thinking.",
      guide: "How this site was built",
      arcadeOpen: "Open the arcade",
      index: "PROJECT",
      role: "Contribution",
      homeTitle: "Professional portfolio",
      arcadeTitle: "A little intermission",
      arcadeDescription: "Play four small classic games."
    },
    fa: {
      heroContact: "تماس با من",
      panelOverline: "نمونه‌کار شخصی",
      panelCaption: "معرفی متمرکزی از تجربه، پروژه‌ها و روش فکر کردن من.",
      guide: "راهنمای ساخت این وب‌سایت",
      arcadeOpen: "ورود به آرکید",
      index: "پروژه",
      role: "نقش من",
      homeTitle: "نمونه‌کار حرفه‌ای",
      arcadeTitle: "وقفه‌ای کوتاه",
      arcadeDescription: "چهار بازی کلاسیک کوچک."
    }
  };
  let language = "en";

  function safeUrl(value) {
    const raw = String(value || "").trim();
    if (!raw || /YOUR_USERNAME|YOUR_REPOSITORY|you@example\.com|PASTE_/i.test(raw)) return "";
    if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) return raw;
    return "";
  }

  function addText(parent, tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = String(text || "");
    parent.appendChild(el);
    return el;
  }

  function addEmpty(parent, text) {
    const p = addText(parent, "p", "empty-state", text);
    return p;
  }

  function renderExperience(profile, labels) {
    const root = $("experienceList");
    root.replaceChildren();
    const entries = Array.isArray(profile.experience) ? profile.experience : [];
    if (!entries.length) return addEmpty(root, labels.emptyExperience);
    entries.forEach((entry) => {
      const item = document.createElement("article");
      item.className = "timeline-item";
      const meta = addText(item, "p", "timeline-meta", "");
      addText(meta, "time", "", entry.period);
      addText(item, "h3", "", entry.role);
      addText(item, "p", "org", entry.organization);
      addText(item, "p", "description", entry.description);
      root.appendChild(item);
    });
  }

  function renderProjects(profile, labels) {
    const root = $("projectList");
    root.replaceChildren();
    const entries = Array.isArray(profile.projects) ? profile.projects : [];
    if (!entries.length) return addEmpty(root, labels.emptyProjects);
    entries.forEach((entry, index) => {
      const card = document.createElement("article");
      card.className = "project-card";
      addText(card, "span", "project-number", String(index + 1).padStart(2, "0") + " / " + ui[language].index);
      addText(card, "h3", "", entry.name);
      addText(card, "p", "summary", entry.summary);
      if (entry.contribution) addText(card, "p", "project-contribution", ui[language].role + ": " + entry.contribution);
      const tags = document.createElement("div");
      tags.className = "tags";
      (Array.isArray(entry.technologies) ? entry.technologies : []).filter(Boolean).forEach((item) => addText(tags, "span", "tag", item));
      card.appendChild(tags);
      const href = safeUrl(entry.url);
      if (href) {
        const link = addText(card, "a", "project-link", labels.viewProject + " ↗");
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      root.appendChild(card);
    });
  }

  function renderSkills(profile, labels) {
    const root = $("skillsList");
    root.replaceChildren();
    const groups = Array.isArray(profile.skills) ? profile.skills : [];
    if (!groups.length) return addEmpty(root, labels.emptySkills);
    groups.forEach((group) => {
      const card = document.createElement("article");
      card.className = "skill-card";
      addText(card, "h3", "", group.group);
      const list = document.createElement("div");
      list.className = "skill-list";
      (Array.isArray(group.items) ? group.items : []).filter(Boolean).forEach((skill) => addText(list, "span", "tag", skill));
      card.appendChild(list);
      root.appendChild(card);
    });
  }

  function renderEducation(profile, labels) {
    const root = $("educationList");
    root.replaceChildren();
    const entries = Array.isArray(profile.education) ? profile.education : [];
    if (!entries.length) return addEmpty(root, labels.emptyEducation);
    entries.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "education-card";
      addText(card, "p", "period", entry.period);
      addText(card, "h3", "", entry.degree);
      addText(card, "p", "institution", entry.institution);
      if (entry.description) addText(card, "p", "description", entry.description);
      root.appendChild(card);
    });
  }

  function renderContacts(profile) {
    const root = $("contactList");
    root.replaceChildren();
    (Array.isArray(profile.contacts) ? profile.contacts : []).forEach((item) => {
      const row = document.createElement("div");
      row.className = "contact-item";
      const text = document.createElement("div");
      addText(text, "small", "", item.label);
      addText(text, "strong", "", item.value);
      row.appendChild(text);
      const href = safeUrl(item.href);
      if (href) {
        const link = addText(row, "a", "", language === "fa" ? "باز کردن ↗" : "Open ↗");
        link.href = href;
        if (/^https?:/i.test(href)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
      }
      root.appendChild(row);
    });
  }

  function applyTheme() {
    const theme = data.theme || {};
    const variables = {
      background: "--bg",
      surface: "--surface",
      surfaceRaised: "--surface-raised",
      text: "--text",
      muted: "--muted",
      accent: "--accent",
      secondary: "--secondary",
      border: "--border"
    };
    Object.entries(variables).forEach(([key, cssName]) => {
      const value = String(theme[key] || "");
      if (/^#[0-9a-f]{3,8}$/i.test(value)) document.documentElement.style.setProperty(cssName, value);
    });
  }

  function render() {
    const profile = data[language];
    const labels = profile.labels;
    const pageUI = ui[language];
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    document.title = profile.profile.name + " — " + profile.profile.role;
    const description = profile.profile.tagline;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = description;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = document.title;
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = description;

    $("brandName").textContent = profile.profile.name;
    $("profileName").textContent = profile.profile.name;
    $("profileRole").textContent = profile.profile.role;
    $("profileTagline").textContent = profile.profile.tagline;
    $("profileLocation").textContent = profile.profile.location;
    $("profileAvailability").textContent = profile.profile.availability;
    $("panelOverline").textContent = pageUI.panelOverline;
    $("panelCaption").textContent = pageUI.panelCaption;
    $("panelLocation").textContent = profile.profile.location;
    $("heroContact").textContent = pageUI.heroContact + " ↗";
    $("printButton").textContent = labels.print;
    $("languageToggle").textContent = language === "fa" ? "English" : "فارسی";
    $("languageToggle").setAttribute("aria-label", language === "fa" ? "Switch to English" : "تغییر زبان به فارسی");
    $("labelAbout").textContent = labels.about;
    $("labelExperience").textContent = labels.experience;
    $("labelProjects").textContent = labels.projects;
    $("labelSkills").textContent = labels.skills;
    $("labelEducation").textContent = labels.education;
    $("labelContact").textContent = labels.contact;
    $("aboutTitle").textContent = profile.about.title;
    $("aboutBody").textContent = profile.about.body;
    $("experienceTitle").textContent = labels.experience;
    $("experienceLead").textContent = labels.experienceLead;
    $("projectsTitle").textContent = labels.projects;
    $("projectsLead").textContent = labels.projectsLead;
    $("skillsTitle").textContent = labels.skills;
    $("skillsLead").textContent = labels.skillsLead;
    $("educationTitle").textContent = labels.education;
    $("educationLead").textContent = labels.educationLead;
    $("contactTitle").textContent = labels.contact;
    $("contactLead").textContent = labels.contactLead;
    $("footerText").textContent = labels.footer;
    $("guideLink").textContent = pageUI.guide + " ↗";
    $("footerYear").textContent = String(new Date().getFullYear());
    $("arcadeTitle").textContent = pageUI.arcadeTitle;
    $("arcadeDescription").textContent = pageUI.arcadeDescription;
    $("arcadeLink").textContent = pageUI.arcadeOpen + " ↗";

    const hasArcade = Boolean(data.features && data.features.arcadeEnabled);
    $("arcadeNav").hidden = !hasArcade;
    $("arcadeCallout").hidden = !hasArcade;
    document.querySelectorAll("[data-nav='projects']").forEach((el) => el.textContent = labels.projects);
    document.querySelectorAll("[data-nav='contact']").forEach((el) => el.textContent = labels.contact);
    renderExperience(profile, labels);
    renderProjects(profile, labels);
    renderSkills(profile, labels);
    renderEducation(profile, labels);
    renderContacts(profile);
  }

  $("languageToggle").addEventListener("click", () => {
    language = language === "en" ? "fa" : "en";
    try { localStorage.setItem("folioforge-language", language); } catch (_) {}
    render();
  });
  $("printButton").addEventListener("click", () => window.print());
  const guide = safeUrl(window.FOLIOFORGE_GUIDE_URL || $("guideLink").href);
  if (guide) $("guideLink").href = guide;
  else $("guideLink").hidden = true;
  try {
    const stored = localStorage.getItem("folioforge-language");
    if (stored === "fa" || stored === "en") language = stored;
  } catch (_) {}
  applyTheme();
  render();
})();
