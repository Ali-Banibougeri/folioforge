# 03 — How the Website Works

[← FolioForge README](../../README.md) · [فارسی](../fa/03-architecture.md)

FolioForge keeps the main résumé site static. That makes it fast, inexpensive to host, and easy for an AI coding agent to customize. The optional arcade uses an API only for shared counters and server-verified high scores.

## The front end

- HTML describes semantic sections and accessible controls.
- CSS in starter/site/assets/styles.css defines the visual system, responsive layout, print styles, and RTL adjustments.
- The data file starter/site/assets/portfolio-data.js holds career content in English and Persian, plus theme colors.
- The renderer starter/site/assets/site.js builds experience, project, skill, education, and contact sections using DOM text nodes. This avoids treating résumé text as executable HTML.
- The arcade page contains the four game engines and their controls.
- The browser API client sends public requests only; it does not contain a server secret.

## Why the content is separate

A coding agent should be able to edit your experience and projects without rewriting the page structure. This improves maintainability and makes it easier for non-programmers to tell where their own facts belong.

Use real dates, titles, names, and links. If a field is unknown, leave it blank or use a visible placeholder until verified.

## Language switching

The résumé data has separate en and fa sections. The site renderer changes document language and direction, then renders the selected language. English is LTR; Persian is RTL. Keep project names, URLs, email addresses, and technology names readable in mixed-script text.

The arcade uses a small translation layer for its interface. When changing dynamic game messages, ensure the current language remains correct after the next frame, score change, or round restart.

## The optional backend

The backend is not needed to show the résumé. When enabled:
1. Browser sends an action and payload to the Edge Function.
2. The Edge Function validates the origin, API key, request shape, and rate limit.
3. Privileged reads/writes happen on the server using Supabase's built-in server secret map or a server-only override.
4. RLS is enabled and direct public write permissions are revoked.
5. A game score is accepted only after replaying the recorded inputs from the server-issued seed.

The browser must never receive the elevated key. Public configuration is not a substitute for database permissions.

## Static publishing

The GitHub Actions workflow exports only starter/site to GitHub Pages. Docs, server function source, and setup notes stay in the repository but are not copied into the published site artifact.

GitHub Pages cannot execute server code. Supabase Edge Functions host the optional server functionality separately.

## How to make a change safely

1. Read the relevant file and existing behavior.
2. Make the smallest correct change.
3. Add or update both translations.
4. Run node scripts/check.mjs.
5. Test the change in the browser at desktop and mobile widths.
6. If game rules change, change the server replay implementation too.
7. Review all new files for personal details and secrets before committing.
