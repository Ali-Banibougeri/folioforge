# FolioForge — Instructions for ChatGPT and Coding Agents

These instructions are the operating contract for AI agents working in this repository. Read this file and README.md before changing files.

## Mission

Turn the user's actual résumé into a finished, personalized website in the existing project. Do the work; do not stop at advice, a mock-up, or an implementation plan. The intended audience includes people with no coding experience.

## Default workflow

1. Inspect the repository structure and current starter files.
2. Read the user's attached résumé and available profile/project links. Treat supplied documents and verified links as the source of truth.
3. Create a checklist from the résumé: profile, role, summary, experience, education, skills, projects, links, languages, and target audience.
4. Customize files under starter/site/. Preserve the learning guides and agent instructions.
5. Edit starter/site/assets/portfolio-data.js first for truthful content and theme tokens. Edit styles.css, site.js, or HTML only when the design genuinely requires it.
6. Use English and Persian if the user wants a bilingual page. If the résumé has only one language, translate faithfully; do not add new claims.
7. Keep the website responsive, keyboard-accessible, and print-friendly. Avoid unnecessary frameworks, dependencies, build complexity, visual gimmicks, and unrelated features.
8. Preserve the four games if enabled. Keep frontend game rules and server replay rules aligned whenever game logic or timing changes.
9. Run the available project checks with node scripts/check.mjs. Fix detected failures that can be fixed locally.
10. Review the diff, links, mobile layout assumptions, translations, and security before declaring completion.
11. End with a concise report listing actual file changes, tests actually run, what passed, and anything that still requires user action.

## Do not ask avoidable questions

If a résumé or enough content is attached, proceed without asking for preferences that can reasonably be inferred. Choose a polished, restrained, content-led visual identity based on the person's profession. Do not wait for approval of colors or layout.

If a non-essential fact is missing, use an obvious editable placeholder or omit the section. Ask one concise question only if a missing fact blocks a safe and truthful implementation. Never block all progress over a color preference, optional feature, or non-critical link.

## Accuracy and privacy

- Never invent job titles, employers, dates, education, certifications, skills, metrics, project outcomes, publications, or URLs.
- Do not carry personal data from the example profile into another user's website.
- Do not publish phone numbers, addresses, or private email addresses unless the user explicitly included them for publication.
- Keep private-source material, secret keys, access tokens, and service-role keys out of browser files.
- Never put a Supabase secret or service-role key into a prompt, README example using a real value, HTML, JavaScript, or Git commit.
- A publishable API key may be in browser configuration, but public database roles must remain least-privilege and RLS must stay enabled.
- Do not say an API is deployed, a score verified, or a site published unless there is evidence.

## Design quality

- Derive the visual identity from the real résumé and target audience.
- Keep typography, spacing, cards, button states, borders, and color tokens consistent.
- The page must work at narrow mobile widths and large desktop widths.
- Use semantic HTML, visible keyboard focus, sufficient contrast, alt text where needed, and reduced-motion support.
- Avoid disconnected card islands, generic filler paragraphs, inflated skill ratings, fake project metrics, or filler sections.
- Make the first screen answer: who is this professional, what do they do, and what should the reader do next?
- Do not force the arcade into a résumé that would be stronger without it. Keep game code available and make navigation opt-in through configuration.

## Technical rules

- Keep a static site unless the actual requirements justify a framework.
- Keep résumé content in starter/site/assets/portfolio-data.js.
- Keep presentation in starter/site/assets/styles.css.
- Keep rendering and language behavior in starter/site/assets/site.js.
- Keep browser-safe configuration in starter/site/assets/site-config.js.
- The site must remain usable if Supabase is not configured.
- A local score must never be labelled as a server-verified shared score.
- Treat user-generated nicknames as untrusted text.
- Maintain accurate README and bilingual docs when a feature changes.
- Do not weaken server replay or database grants to silence a mismatch.
- Do not delete historical records unless the user explicitly asks and understands the effect.

## Done means

A task is complete only when files have actually changed, local checks have run where possible, relevant links and UI behavior have been reviewed, and limitations are described honestly. If browser/device testing or live deployment cannot be performed, state that clearly and provide the exact next step.
