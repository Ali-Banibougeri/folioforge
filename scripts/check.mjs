import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const required = [
  "AGENTS.md","README.md","README.fa.md",
  "starter/site/index.html","starter/site/arcade/index.html",
  "starter/site/assets/portfolio-data.js","starter/site/assets/site.js",
  "starter/site/assets/site-api.js","starter/site/assets/site-config.js",
  "starter/site/assets/i18n.js","starter/site/assets/styles.css",
  "starter/backend/arcade-schema.sql","starter/backend/functions/arcade-api/index.ts",
  ".github/workflows/deploy-pages.yml"
];

function read(relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) { errors.push("Missing required file: " + relative); return ""; }
  return fs.readFileSync(file, "utf8");
}
for (const file of required) read(file);

function checkJavaScript(file, source) {
  try { new Function(source); console.log("PASS syntax: " + file); }
  catch (error) { errors.push("JavaScript syntax error in " + file + ": " + error.message); }
}
for (const file of [
  "starter/site/assets/portfolio-data.js","starter/site/assets/site.js",
  "starter/site/assets/site-api.js","starter/site/assets/site-config.js",
  "starter/site/assets/i18n.js"
]) {
  const source = read(file);
  if (source) checkJavaScript(file, source);
}

const home = read("starter/site/index.html");
const arcade = read("starter/site/arcade/index.html");
const data = read("starter/site/assets/portfolio-data.js");
const config = read("starter/site/assets/site-config.js");
const backend = read("starter/backend/functions/arcade-api/index.ts");
const deploy = read(".github/workflows/deploy-pages.yml");

for (const game of ["snake","tetris","breakout","pacman"]) {
  if (!arcade.includes('data-select="' + game + '"')) errors.push("Arcade selector missing game: " + game);
  else console.log("PASS arcade game: " + game);
  if (!backend.includes('"' + game + '"')) errors.push("Server game allow-list missing: " + game);
}
const inlineScripts = [...arcade.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1].trim()).filter(Boolean);
if (!inlineScripts.length) errors.push("No inline game script found in the arcade page.");
inlineScripts.forEach((source, i) => checkJavaScript("arcade inline script " + (i + 1), source));

for (const id of ["profileName","profileRole","projectList","experienceList","skillsList","educationList","contactList","languageToggle"]) {
  if (!home.includes('id="' + id + '"')) errors.push("Résumé page is missing element ID: " + id);
}
if (!data.includes("en:") || !data.includes("fa:")) errors.push("Portfolio data must contain English and Persian sections.");
if (!data.includes("YOUR_USERNAME") || !data.includes("Your Name")) errors.push("The starter should retain generic placeholders until customization.");
if (!home.includes('href="arcade/"')) errors.push("Résumé page should link to the optional arcade route.");
if (!arcade.includes('src="../assets/site-api.js"')) errors.push("Arcade page must use relative paths for project-site publishing.");
if (!deploy.includes("starter/site")) errors.push("Pages workflow must publish starter/site.");
if (/sb_secret_[A-Za-z0-9_-]{12,}/.test(config)) errors.push("A secret-looking Supabase key was found in browser configuration.");
if (/service_role_key\s*[:=]\s*["'][^"']{12,}["']/i.test(config)) errors.push("A service-role key value was found in browser configuration.");
if (!config.includes("PASTE_SUPABASE_PUBLISHABLE_KEY")) errors.push("Browser config should use a safe placeholder until configured.");

if (errors.length) {
  console.error("\nFolioForge checks failed:");
  errors.forEach(error => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("\nAll static FolioForge checks passed.");
  console.log("Note: this does not replace browser testing or live API verification.");
}
