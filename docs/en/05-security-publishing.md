# 05 — Security, Visitor Counter, and Publishing

[← FolioForge README](../../README.md) · [فارسی](../fa/05-security-publishing.md)

## Static résumé hosting

The résumé is static HTML, CSS, JavaScript, and images. It does not require a database or a secret key. GitHub Pages serves these static files; it does not run backend code.

The workflow in .github/workflows/deploy-pages.yml publishes only starter/site. Documentation and the server function remain in the source repository.

## GitHub account and Pages

1. Sign in to https://github.com/login or create an account at https://github.com/signup.
2. Create your own repository or fork/use the template if available. Avoid storing your personal résumé in a public template repository until you are ready for it to be public.
3. Push your project to your repository.
4. Open Settings → Pages and choose GitHub Actions as the source.
5. Check the latest workflow run and open the resulting site URL.

A coding agent may need you to authorize the GitHub integration or open the cloned folder in a file-editing workspace. It should notify you before it reaches that step and give you the exact sign-in/permission path. It must not request your password or access token in chat.

## Optional Supabase visitor counter

Supabase is only needed for a shared visitor count. To enable it:
1. Create a Supabase account at https://supabase.com/dashboard/sign-up.
2. Create a new Supabase project.
3. Run starter/backend/visitor-counter-schema.sql in the project's SQL Editor.
4. Set your project URL and publishable key in starter/site/assets/site-config.js.
5. Configure starter/backend/config.toml with your project reference.
6. In Edge Functions → Secrets, set VISITOR_RATE_SALT to a long random value and FOLIO_SITE_ORIGIN to the exact site origin.
7. Deploy visitor-counter from starter/backend/functions/visitor-counter/index.ts.
8. Test the response and the displayed count.

The full account setup is documented in [04 — Connect accounts and services](./04-connect-services.md). The visitor counter must not block or break the résumé if Supabase is not configured.

## Key safety

- A publishable key is designed for browser use. It does not replace database security.
- Never place a secret or service-role key in HTML, browser JavaScript, a public repository, screenshots, or messages.
- Keep elevated credentials in Supabase's server-side secret manager. The function can use Supabase's built-in server secret map; if needed, a server-only FOLIO_COUNTER_SECRET_KEY can be configured in Edge Function Secrets.
- Keep Row Level Security enabled.
- Do not grant unrestricted insert, update, or delete access to anonymous browser roles.
- If a secret is exposed, revoke or rotate it. Removing it from the latest commit does not erase Git history or old copies.

## Visitor-count limitations

The count is based on a random browser ID per UTC day. It is not a count of verified humans. Visitors can clear browser storage or automate requests. The rate limit reduces basic abuse but is not a guarantee against bots. Do not use the count for billing or security decisions.

## Public site versus private source

A public website sends its HTML, CSS, and JavaScript to visitors, where they can inspect it. A private source repository can hide Git history and original repository files from outsiders, but it cannot make delivered browser code secret.

On GitHub Free for personal accounts, GitHub Pages requires a public repository. Making that repository private unpublishes the Pages site. A supported paid plan may allow publishing from a private repository, but the public website files remain accessible. On a Free plan, keep source in a private repository and deploy only the website output to a separate public publishing repository or use a different static host.

Official references:
- [Create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Set repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
- [Supabase API key safety](https://supabase.com/docs/guides/getting-started/api-keys)

## Release checklist

- [ ] No secret or service-role key is in browser files or the Pages artifact.
- [ ] RLS is enabled and direct anonymous database writes are revoked.
- [ ] Project URL, site origin, and publishable key belong to your own project.
- [ ] Both languages, links, mobile layout, keyboard navigation, and print output are checked.
- [ ] If enabled, a normal visitor-counter request returns ok: true and a numeric count.
- [ ] The newest GitHub Actions deployment succeeded.
