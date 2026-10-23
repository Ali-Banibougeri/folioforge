import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const required = [
  "AGENTS.md",
  "README.md",
  "README.fa.md",
  "docs/en/04-connect-services.md",
  "docs/fa/04-connect-services.md",
  "starter/site/index.html",
  "starter/site/assets/portfolio-data.js",
  "starter/site/assets/site.js",
  "starter/site/assets/site-api.js",
  "starter/site/assets/site-config.js",
  "starter/site/assets/styles.css",
  "starter/backend/visitor-counter-schema.sql",
  "starter/backend/functions/visitor-counter/index.ts",
  "starter/backend/config.toml",
  ".github/workflows/deploy-pages.yml"
];

function read(relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    errors.push("Missing required file: " + relative);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}
for (const file of required) read(file);

function checkJavaScript(file, source) {
  try {
    new Function(source);
    console.log("PASS syntax: " + file);
  } catch (error) {
    errors.push("JavaScript syntax error in " + file + ": " + error.message);
  }
}

for (const file of [
  "starter/site/assets/portfolio-data.js",
  "starter/site/assets/site.js",
  "starter/site/assets/site-api.js",
  "starter/site/assets/site-config.js"
]) {
  const source = read(file);
  if (source) checkJavaScript(file, source);
}

const home = read("starter/site/index.html");
const data = read("starter/site/assets/portfolio-data.js");
const config = read("starter/site/assets/site-config.js");
const api = read("starter/site/assets/site-api.js");
const backend = read("starter/backend/functions/visitor-counter/index.ts");
const schema = read("starter/backend/visitor-counter-schema.sql");
const deploy = read(".github/workflows/deploy-pages.yml");

for (const id of ["profileName","profileRole","projectList","experienceList","skillsList","educationList","contactList","languageToggle","pageViews","counterSetupNotice"]) {
  if (!home.includes('id="' + id + '"')) errors.push("Résumé page is missing element ID: " + id);
}

if (!data.includes("en:") || !data.includes("fa:")) errors.push("Portfolio data must contain English and Persian sections.");
if (!data.includes("visitorCounterEnabled")) errors.push("Portfolio data must include the visitor-counter option.");
if (!home.includes('href="#contact"')) errors.push("Résumé page is missing a contact action.");
if (home.includes("arcade/") || home.includes("arcadeCallout") || home.includes("arcadeNav")) errors.push("The public résumé template must not contain an arcade section.");
if (fs.existsSync(path.join(root, "starter/site/arcade"))) errors.push("Arcade source still exists under starter/site.");
if (fs.existsSync(path.join(root, "starter/backend/arcade-schema.sql"))) errors.push("Arcade schema still exists in the public template.");
if (fs.existsSync(path.join(root, "starter/backend/functions/arcade-api"))) errors.push("Arcade Edge Function still exists in the public template.");
if (!api.includes('functionName || "visitor-counter"')) errors.push("Browser API client must target the visitor-counter function.");
if (!api.includes("counterSetupNotice")) errors.push("The local setup notification is missing from the API client.");
if (!api.includes('params.get("setup") === "1"')) errors.push("The setup notice must be available with ?setup=1.");
if (!backend.includes('body?.action !== "view"')) errors.push("The server function must only accept visitor-view events.");
if (!backend.includes("VISITOR_RATE_SALT")) errors.push("Server rate-limiting salt is not checked.");
if (!backend.includes("SUPABASE_SECRET_KEYS")) errors.push("The function should use Supabase's built-in server-secret map when available.");
if (!schema.includes("enable row level security")) errors.push("Visitor counter schema must enable RLS.");
if (!schema.includes("revoke all on table public.site_page_views from anon, authenticated")) errors.push("Direct anonymous database access must be revoked.");
if (!config.includes("PASTE_SUPABASE_PUBLISHABLE_KEY")) errors.push("Browser config must use a safe public-key placeholder.");
if (/sb_secret_[A-Za-z0-9_-]{12,}/.test(config)) errors.push("A secret-looking Supabase key was found in browser configuration.");
if (/service_role_key\s*[:=]\s*["'][^"']{12,}["']/i.test(config)) errors.push("A service-role key value was found in browser configuration.");
if (!deploy.includes("starter/site")) errors.push("Pages workflow must publish starter/site.");

for (const file of ["docs/en/01-start-here.md","docs/fa/01-start-here.md","docs/en/03-architecture.md","docs/fa/03-architecture.md"]) {
  const content = read(file);
  if (/\b(?:arcade|Pac-Man|Breakout|Tetris|Snake)\b/i.test(content) || /آرکید|بریک.?اوت|پک.?من|تتریس|بازی مار/.test(content)) {
    errors.push("Résumé-only documentation still references game-building: " + file);
  }
}

if (errors.length) {
  console.error("\nFolioForge checks failed:");
  errors.forEach(error => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("\nAll static FolioForge checks passed.");
  console.log("Note: this does not replace live browser testing or a real Supabase request.");
}
