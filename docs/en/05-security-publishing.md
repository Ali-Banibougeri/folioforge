# 05 — Security, Supabase, and Publishing

[← FolioForge README](../../README.md) · [فارسی](../fa/05-security-publishing.md)

## Static résumé hosting

The résumé can be published as static HTML, CSS, JavaScript, and images. It does not need a database or a secret key. GitHub Pages serves static files; it does not execute the Supabase Edge Function.

The workflow in .github/workflows/deploy-pages.yml publishes only starter/site. Keep setup guides and the server function source outside the published artifact.

## GitHub Pages setup

1. Push the repository to GitHub.
2. Open Settings → Pages.
3. Select GitHub Actions as the source.
4. Trigger a push to main or run the workflow manually.
5. Open the URL reported by the workflow.

After changing files, inspect the newest workflow run rather than assuming a successful commit means a successful deployment. On a project site, relative paths are important because the published URL may include the repository name.

## Optional Supabase features

Shared scores and the visitor counter use Supabase. To enable them:
1. Create your own Supabase project.
2. Apply starter/backend/arcade-schema.sql in the SQL Editor.
3. Set your project URL and publishable key in starter/site/assets/site-config.js.
4. Link the CLI to your project using starter/backend/config.toml as a reference.
5. Deploy the arcade-api function from starter/backend/functions/arcade-api/index.ts.
6. Configure ARCADE_SITE_ORIGIN with your actual published website origin and set a long random ARCADE_RATE_SALT.
7. Play a complete round and check logs and database state.

The Supabase project reference and the site origin must be changed to your own values. Never reuse someone else's server secret. The code reads Supabase's built-in secret key map by default; a custom server-only override is also supported. Do not paste secret values into README, chat, screenshots, or source files.

## Database security

- Keep Row Level Security enabled on exposed tables.
- Do not grant unrestricted insert, update, or delete rights to anonymous browser users.
- Use least-privilege grants.
- Validate inputs and limit request volume.
- Treat all browser input as untrusted.
- Do not send a secret or service-role key to the browser.
- Do not treat hashed IP addresses or visitor IDs as complete anonymity; hashes can still be data with privacy implications.

## Public site versus private source

A public website necessarily sends its HTML, CSS, and JavaScript to visitors, where they can inspect it. A private source repository can hide the Git history and original source files from outsiders, but cannot make delivered browser code secret.

On GitHub Free for personal accounts, GitHub Pages requires a public repository. Changing the user-site repository to private unpublishes the Pages site. A paid plan may support Pages from private repositories, but the published website remains public unless site access is explicitly restricted.

For a public site with private source on a Free plan, use a private source repository and a separate public publishing repository or a different static host. Keep sensitive logic and all server secrets on the server.

Official references:
- [Create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Set repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
- [Supabase API key security](https://supabase.com/docs/guides/getting-started/api-keys)

## Release checklist

- [ ] No secret or service-role key is in browser files or the Pages artifact.
- [ ] RLS is enabled and anonymous database writes are restricted.
- [ ] Project URL, origin, and publishable key belong to your own project.
- [ ] Both languages work and links are real.
- [ ] Desktop, mobile, keyboard navigation, and print output have been checked.
- [ ] Each game has been played through a full round if the arcade is enabled.
- [ ] A shared score is reported as verified only after a successful server response.
- [ ] The newest GitHub Actions deployment succeeded.
