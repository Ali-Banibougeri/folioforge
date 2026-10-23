# 03 — Understand the Website Architecture

[← FolioForge README](../../README.md) · [فارسی](../fa/03-architecture.md)

FolioForge keeps the résumé static. That makes it quick to load, inexpensive to host, and easy for an AI coding agent to customize. The only optional backend feature is a shared visitor counter.

## The browser

- HTML describes semantic sections and accessible controls.
- CSS in starter/site/assets/styles.css defines visual design, responsive layout, print styles, and RTL adjustments.
- starter/site/assets/portfolio-data.js holds résumé content in English and Persian, plus theme colors.
- starter/site/assets/site.js renders résumé sections using DOM text nodes, so résumé text is not interpreted as executable HTML.
- starter/site/assets/site-config.js contains browser-safe configuration and a publishable key placeholder.
- starter/site/assets/site-api.js sends the visitor-counter request. It does not contain a secret/service-role key.

## Why keep content separate?

An AI coding agent can edit experience and projects without rewriting the page structure. Use verified titles, dates, names, and links. If a field is unknown, omit it or leave a clear placeholder.

## Language switching

Résumé data has separate English and Persian sections. The renderer changes document language and direction. English is left-to-right; Persian is right-to-left. Keep URLs, emails, and technology names readable in mixed-script text.

## Optional visitor-counter backend

The static résumé does not need a backend. The visitor counter uses one Supabase table and one Edge Function:

1. The browser creates or reuses a random browser ID in local storage.
2. It sends a page-view event and a public publishable key to the visitor-counter function.
3. The function validates origin, key, request shape, and rate limit.
4. The function hashes the browser ID and IP on the server.
5. The database stores at most one view per browser ID per UTC day.
6. The function returns an approximate count.

RLS is enabled, and direct anonymous table writes are revoked. The privileged write happens only on the server. If the counter is unconfigured, the résumé remains usable.

## Static publishing

The GitHub Actions workflow publishes only starter/site. Documentation and server function source remain in the repository but are not copied into the website artifact.

GitHub Pages cannot execute server code. The optional visitor-counter function runs separately as a Supabase Edge Function.

## Change the project safely

1. Read the relevant file and current behavior.
2. Make the smallest correct change.
3. Keep English and Persian copy aligned.
4. Run node scripts/check.mjs.
5. Test mobile, desktop, language switching, links, and print output.
6. If the counter changed, test its API response after setup.
7. Review new files for personal information and secrets before committing.
