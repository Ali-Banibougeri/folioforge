# FolioForge — Instructions for ChatGPT and Coding Agents

Read this file and README.md before changing any files. These instructions are the operating contract for agents implementing a résumé website in this repository.

## Mission

Turn the user's actual résumé into a finished, personalized, bilingual website using the existing static starter. Do the implementation; do not stop at advice, a mock-up, or a plan. The intended audience includes people with no coding experience.

## Default workflow

1. Inspect the repository structure and the current starter files.
2. Read the user's attached résumé and any relevant profile or project links. Treat these as the source of truth.
3. Extract a short checklist: professional identity, target audience, summary, experience, education, skills, projects, public links, and required languages.
4. Customize files under starter/site/. Preserve these instructions and the learning guides.
5. Edit starter/site/assets/portfolio-data.js first. Update styles.css, site.js, or index.html only as needed to deliver the design.
6. Write accurate English and Persian content when a bilingual site is requested. Translate meaning faithfully and maintain correct LTR/RTL behavior.
7. Choose a visual system based on the actual profession and audience. Do not automatically copy the default palette or add unrelated features.
8. Keep the website responsive, keyboard-accessible, and print-friendly. Avoid unnecessary frameworks, dependencies, build complexity, and visual gimmicks.
9. Keep only the optional visitor counter as a backend feature. This repository is a résumé-site template; do not add games, an arcade, game-score storage, or game-construction tutorials.
10. Run node scripts/check.mjs and fix all issues it finds that can be fixed locally.
11. Review the diff, links, mobile layout assumptions, both languages, setup notice behavior, and security before declaring completion.
12. End with a concise report of the actual changes, tests actually run, what passed, and any remaining user action.

## External connections and account setup — mandatory behavior

Before attempting a step that requires an external service, determine whether the required connection and permission are available.

- If GitHub repository access is missing, tell the user that GitHub connection/write permission is required, link to https://github.com/login and explain that they must authorize the relevant integration. Do not pretend to have pushed changes.
- If an AI coding workspace cannot access local files, explain that the user must open/clone the repository in a workspace with file-edit permissions or upload the project ZIP.
- Supabase is optional. Do not require it to build or preview the résumé. It is needed only if the user wants the shared visitor counter.
- If Supabase is needed but not connected or not set up, show the direct account link https://supabase.com/dashboard/sign-up, explain how to create a project, and follow docs/en/04-connect-services.md or docs/fa/04-connect-services.md.
- If the task is possible without a missing external connection, continue the unrelated implementation instead of blocking everything.
- Ask the user to complete an official sign-in/connect prompt when needed. Never ask for passwords, GitHub personal access tokens, Supabase secret keys, or service-role keys in chat.
- Do not create accounts, accept terms, or authorize a third-party integration on the user's behalf without their explicit action.
- When live deployment requires a setting or permission, provide the exact UI path and report that it remains pending until evidence confirms success.

## Do not ask avoidable questions

If a résumé or enough information is attached, proceed without asking for styling preferences that can reasonably be inferred. If a non-essential fact is missing, omit it or use an obvious editable placeholder. Ask one concise question only if a missing fact blocks a truthful implementation.

## Accuracy and privacy

- Never invent employers, titles, dates, education, certifications, skills, metrics, project outcomes, publications, or URLs.
- Do not copy personal facts from this example into another person's résumé.
- Do not publish private phone numbers, home addresses, or personal emails unless explicitly provided for publication.
- Never place secrets, access tokens, service-role keys, or passwords in browser files, committed files, prompts, or public logs.
- Browser configuration may contain a publishable key, but it must be paired with least-privilege database permissions and Row Level Security.
- Treat visitor-count figures as approximate browser-day events, not verified humans.
- Do not claim an API is configured, a test passed, or a site was deployed unless there is evidence.

## Design quality

- Make the first screen answer: who is this professional, what do they do, and what should the reader do next?
- Keep typography, spacing, colors, card styles, button states, borders, and focus behavior consistent.
- Use semantic HTML, visible keyboard focus, sufficient contrast, meaningful image alt text, and reduced-motion support.
- Avoid generic filler, inflated skill ratings, fake project metrics, unneeded sections, and unrelated widgets.
- Ensure content does not overflow at narrow mobile widths or large desktop sizes.
- Keep the connection notice limited to local preview or explicit setup mode. Do not expose setup warnings to ordinary public visitors.

## Technical rules

- Keep the website static unless requirements prove a backend is needed.
- Keep résumé content in starter/site/assets/portfolio-data.js.
- Keep presentation in starter/site/assets/styles.css.
- Keep rendering and language behavior in starter/site/assets/site.js.
- Keep browser-safe configuration in starter/site/assets/site-config.js.
- The résumé must work if Supabase is not configured.
- Visitor counter writes must pass through the visitor-counter Edge Function.
- The browser must not be granted direct insert/update/delete privileges on site_page_views.
- Do not weaken database permissions to silence configuration errors.
- Keep documentation and the check script aligned with the actual files in the repository.

## Done means

A task is complete only after the files have actually changed, relevant checks have run where possible, and limitations are honestly reported. If visual browser testing or live deployment cannot be performed, say so and provide the exact next step.
