# FolioForge
### Your career story, transformed into a polished personal website.

**An AI-ready, bilingual starter kit for building a professional résumé website—with an optional four-game arcade.** Made for people who have never written code as well as developers who want a clean, repeatable workflow.

<p align="center">
  <a href="./README.fa.md">راهنمای فارسی</a> ·
  <a href="./AGENTS.md">Instructions for ChatGPT and coding agents</a> ·
  <a href="./prompts/portfolio-en.md">Copy-ready AI prompt</a>
</p>

---

## Start in minutes

You do not need to be a programmer. You need your real résumé and a copy of this project.

**The simplest AI-assisted workflow**

1. Download or clone this repository.
2. Open the project folder in your AI coding workspace. Attach your résumé as a PDF, DOCX, or text file.
3. Copy the instruction below into ChatGPT, Codex, or another coding agent that can edit project files.
4. Review the result, run the checks, and publish when ready.

> **Copy this instruction**
>
> Read AGENTS.md and README.md completely. Follow AGENTS.md. Use my attached résumé as the source of truth. Customize the website in starter/site/ for my career, write truthful English and Persian content, choose a visual identity that fits my field, keep the optional arcade working, run node scripts/check.mjs, fix every issue you can, and report only what remains unverified. Do not ask avoidable questions, do not invent facts, and do not make me manually edit code when you can do it yourself.

AGENTS.md makes this instruction specific and repeatable. The agent should do the implementation—not merely give you a tutorial or mock-up.

## What you get

| Part | Included |
|---|---|
| Personalized résumé | Summary, experience, education, skills, selected projects, contact details |
| Bilingual layout | English LTR and Persian RTL, stored language preference, translated interface |
| Visual design | Responsive cards, typography, color tokens, keyboard focus, reduced-motion support |
| PDF-friendly page | Use the browser's Print → Save as PDF |
| Optional arcade | Snake, Tetris, Breakout, and Pac-Man |
| Shared scores | Optional Supabase database and server-side replay verification |
| Visitor counter | Optional hashed visitor records with documented limitations |
| Beginner documentation | Step-by-step guides in English and Persian |
| AI workflow | AGENTS.md plus reusable prompts for building, reviewing, and debugging |
| Quality checks | Node.js checks for client-side JavaScript syntax, required files, game entries, and obvious secret-key leaks |
| Deployment workflow | GitHub Actions workflow for publishing starter/site |

## Project map

    AGENTS.md                          Instructions for AI coding agents
    README.md                          This guide
    README.fa.md                       Persian guide
    starter/site/
      index.html                       Résumé page
      arcade/index.html               Four-game arcade
      assets/portfolio-data.js         Main personal content to customize
      assets/styles.css                Visual design system
      assets/site.js                   Rendering, language switch, print behavior
      assets/site-config.js            Public browser configuration (placeholders only)
      assets/site-api.js               Safe public API client
      assets/i18n.js                   Arcade language support
      assets/favicon.svg               Editable vector favicon
    starter/backend/
      arcade-schema.sql                Supabase tables and permissions
      functions/arcade-api/index.ts    Server-side game validation
      config.toml                      Supabase CLI configuration template
    docs/en/                           English learning guide
    docs/fa/                           راهنمای فارسی
    prompts/                           Ready-to-copy AI prompts
    scripts/check.mjs                  Local quality checks
    .github/workflows/deploy-pages.yml GitHub Pages deployment

## Make it your own

The AI agent should use your résumé to customize the content and design. The main editable file is:

**starter/site/assets/portfolio-data.js**

It contains profile details, summary, experience, education, projects, skills, contact links, bilingual labels, and theme colors. For most résumé changes, that one file is the first place to edit. The agent may also update styles.css and HTML when your needs justify it.

Do not publish a sample résumé unchanged. Replace every example name, link, and placeholder with verified information. Remove any section that does not fit you.

## Publish the website

This project includes a GitHub Pages workflow. After uploading your customized files:

1. Open the repository's **Settings → Pages**.
2. Set the build and deployment source to **GitHub Actions**.
3. Push a change to the main branch or run the workflow from **Actions**.
4. Open the published URL shown in the workflow and test it in a private browser window.

GitHub requires this one-time Pages permission setup. A coding agent can prepare the code and workflow, but it cannot grant repository permissions that your account has not authorized.

## Optional: turn on shared arcade scores

The résumé itself is static and does not need a database. Supabase is only required for shared visitor counts and a shared leaderboard. The arcade can be used in local-score mode without it.

Read the backend and security guides:
- [English: backend and Supabase setup](./docs/en/05-security-publishing.md)
- [فارسی: راه‌اندازی بک‌اند و Supabase](./docs/fa/05-security-publishing.md)
- [Security notes](./SECURITY.md)

Never put a Supabase secret or service-role key in browser JavaScript, HTML, a public repository, or a prompt. A publishable key is different from a secret key and still requires strict database permissions and Row Level Security.

## Learn how it works

- [01 — Start here, even with no coding experience](./docs/en/01-start-here.md)
- [02 — Plan your content and visual identity](./docs/en/02-design.md)
- [03 — Understand the website architecture](./docs/en/03-architecture.md)
- [04 — Understand the four games](./docs/en/04-arcade-games.md)
- [05 — Security and publishing](./docs/en/05-security-publishing.md)
- [پیش از شروع: راهنمای فارسی](./README.fa.md)
- [پرامپت کامل ساخت رزومه](./prompts/portfolio-fa.md)
- [پرامپت بازبینی کد](./prompts/review-fa.md)

## Checks before publishing

Run the following command from the repository folder when Node.js is installed:

    node scripts/check.mjs

The check script is a fast guardrail, not a full browser test or security audit. Test the live website manually on desktop and mobile, in English and Persian, and play at least one round of each game. Be honest about what has and has not been tested.

## Privacy, licenses, and reuse

This is a reusable learning template. It should not contain anyone else's résumé, profile photo, personal email, private link, or API secret. Personal content in the starter is intentionally generic. Replace it before publishing. Read LICENSE and the documentation for terms and limitations of reuse.

---

<p align="center"><strong>FolioForge</strong> · Build with AI. Keep the facts yours.</p>
