# FolioForge
### Turn your career story into a polished personal website.

**A bilingual, AI-ready starter kit for building a professional résumé website.** Designed for people who have never written code as well as developers who want a clean, repeatable workflow.

<p align="center">
  <a href="./README.fa.md">راهنمای فارسی</a> ·
  <a href="./AGENTS.md">Instructions for ChatGPT and coding agents</a> ·
  <a href="./prompts/portfolio-en.md">Copy-ready AI prompt</a>
</p>

---

## Start in minutes

You do not need to be a programmer. You need your real résumé and a copy of this project.

1. Create or sign in to GitHub, then make your own copy of this repository.
2. Open the project folder in an AI coding workspace that can edit files. Attach your résumé as PDF, DOCX, or text.
3. Copy the instruction below into ChatGPT, Codex, or another coding agent with file-edit permission.
4. The agent should customize the website, run the checks, and tell you only which account connections or publishing actions still require you.

> **Copy this instruction**
>
> Read AGENTS.md and README.md completely. Follow AGENTS.md. Use my attached résumé as the source of truth. Customize the website in starter/site/ for my career and audience, write truthful English and Persian content, choose a visual identity that fits my field, keep the optional visitor counter only, run node scripts/check.mjs, and fix all issues you can. Do not ask avoidable questions, invent facts, or ask me to manually edit code when you can do it. Before any action that requires an external account or permission, notify me which service is needed, give me the direct sign-up/connect link and exact steps, and continue with all work that does not depend on that connection. Never ask me to paste passwords or secret keys into chat.

The root AGENTS.md gives coding agents a predictable operating contract. It tells them to implement the site, not merely give advice or a mock-up.

## What you get

| Part | Included |
|---|---|
| Personalized résumé | Summary, experience, education, skills, selected projects, contact details |
| Bilingual layout | English LTR and Persian RTL, stored language preference, translated interface |
| Visual design | Responsive layout, consistent typography and color tokens, keyboard focus, reduced-motion support |
| PDF-friendly page | Use the browser's Print → Save as PDF |
| Visitor counter | Optional shared count per browser ID per UTC day |
| Setup notification | When developing locally, a notice explains how to connect the visitor counter |
| Beginner documentation | Step-by-step guides in English and Persian, including creating accounts and authorizing tools |
| AI workflow | AGENTS.md plus reusable build and review prompts |
| Quality checks | Node.js checks for required files, JavaScript syntax, visitor-counter setup, and obvious secret-key leaks |
| Deployment workflow | GitHub Actions workflow for publishing starter/site |

## Project map

    AGENTS.md                           Instructions for AI coding agents
    README.md                           This guide
    README.fa.md                        Persian guide
    starter/site/
      index.html                        Résumé page
      assets/portfolio-data.js          Main personal content and theme tokens
      assets/styles.css                 Visual design system
      assets/site.js                    Rendering, language switch, print behavior
      assets/site-config.js             Public browser configuration
      assets/site-api.js                Visitor-counter client
      assets/favicon.svg                Editable vector favicon
    starter/backend/
      visitor-counter-schema.sql        Visitor-counter table and permissions
      functions/visitor-counter/index.ts Server-side visitor counting
      config.toml                       Supabase CLI configuration template
    docs/en/                            English learning and connection guides
    docs/fa/                            Persian learning and connection guides
    prompts/                            Ready-to-copy AI prompts
    scripts/check.mjs                  Local quality checks
    .github/workflows/deploy-pages.yml  GitHub Pages deployment

## Make it your own

The AI agent should use your résumé to customize content and design. The main editable file is:

**starter/site/assets/portfolio-data.js**

It contains your profile, summary, experience, education, projects, skills, contact links, bilingual labels, and theme colors. For most résumé changes, this is the first file to update. The agent may also update styles.css and the HTML when needed.

Do not publish the example unchanged. Replace sample names, dates, and links with verified information. Remove sections that do not fit your experience.

## Account connections: only when needed

The résumé itself is a static website and does not require a database.

- **GitHub account:** needed to store the project and publish it with GitHub Pages.
- **AI coding tool with file access:** needed if you want the agent to edit your local clone directly. Use the official sign-in/connect prompt shown by that tool.
- **Supabase account:** optional; only required for the shared visitor counter.

The agent must tell you when a connection is missing, link to the official sign-up page, explain the minimum permissions needed, and continue with unrelated work. Never share passwords, GitHub tokens, Supabase secret keys, or service-role keys in chat.

See [04 — Connect accounts and services](./docs/en/04-connect-services.md) or [راهنمای اتصال حساب‌ها](./docs/fa/04-connect-services.md).

## Publish the website

This repository includes a GitHub Actions workflow that publishes only starter/site. After the first setup:
1. Open Settings → Pages in your own repository.
2. Choose GitHub Actions as the publishing source.
3. Push a change to main or run the workflow from Actions.
4. Open the URL shown by the workflow and check it on mobile and desktop.

GitHub requires this one-time account/repository authorization. The workflow runs static checks on pushes. To deploy the website, first enable Pages in Settings → Pages and choose GitHub Actions; then open Actions → Check and optionally deploy FolioForge → Run workflow, check the deploy option, and start the run. If Pages is not enabled or permission is missing, the agent must report that exact step instead of claiming publication.

## Optional: visitor counter

The counter is disabled until you configure your own Supabase project. Without it, the résumé still works. Follow [the complete visitor-counter setup](./docs/en/05-security-publishing.md).

When previewing locally, the site shows a setup notice while the counter is unconfigured. You can also open the website with the query parameter ?setup=1 to see that notice. It is hidden from ordinary public visitors.

## Security and privacy

- The visitor count represents browser IDs per page per UTC day, not verified human beings.
- Browser code is public and can be inspected. Do not put private algorithms or secrets in it.
- Supabase secret/service-role keys belong only in server-side secrets.
- The public publishable key is safe to include in browser configuration only when database grants and Row Level Security are restrictive.
- Do not include someone else's résumé or private contact details in the example.

See [SECURITY.md](./SECURITY.md).

## Checks before publishing

When Node.js is installed, run this from the repository root:

    node scripts/check.mjs

The check script is a fast guardrail, not a full browser test or security audit. Test both languages, links, print output, mobile layout, and the counter API if enabled. Be honest about what has and has not been tested.

## Learn step by step

- [01 — Start here, even if you have never coded](./docs/en/01-start-here.md)
- [02 — Plan content and visual identity](./docs/en/02-design.md)
- [03 — Understand the website architecture](./docs/en/03-architecture.md)
- [04 — Connect accounts and services](./docs/en/04-connect-services.md)
- [05 — Security, counter setup, and publishing](./docs/en/05-security-publishing.md)
- [پرامپت ساخت رزومه](./prompts/portfolio-fa.md)
- [پرامپت بررسی و رفع ایراد](./prompts/review-fa.md)

## License

FolioForge is released under the MIT License. Read [LICENSE](./LICENSE) before reusing or redistributing the code, and review the licenses of any third-party assets you add.

---

<p align="center"><strong>FolioForge</strong> · Build with AI. Keep the facts yours.</p>
