# 04 — Connect Accounts and Tools Without Guesswork

[← FolioForge README](../../README.md) · [فارسی](../fa/04-connect-services.md)

This guide tells you when an account is required, what to connect, and which settings an AI coding agent must not silently assume. You do not have to create every account before working on the résumé.

## Which services do I need?

| Goal | Needed | Optional |
|---|---|---|
| Build and preview a résumé on your computer | A copy of this repository and an editor or AI workspace that can edit files | GitHub account |
| Let ChatGPT/Codex edit files directly | A workspace that supports local file changes; authorize its tool when prompted | GitHub integration if editing a local clone |
| Put the source on GitHub | GitHub account and permission to create/push to your repository | GitHub CLI |
| Publish the résumé online | GitHub repository and GitHub Pages permissions, or another web host | Custom domain |
| Show a shared visitor counter | Supabase account/project, SQL schema, publishable key, and deployed Edge Function | The whole counter feature itself |
| Show the résumé without a counter | Nothing else | Supabase |

The résumé page is static. Do not create a Supabase account merely because the project mentions it; create one only if you want the visitor counter.

## A. GitHub: create an account and repository

1. Go to https://github.com/signup, create your account, and verify your email.
2. Sign in at https://github.com/login.
3. Create your own repository using the New repository button. Name it as you prefer. Choose public only if you are ready for the repository contents to be visible; otherwise choose private.
4. Do not store private résumé details in a public repository before you are ready to publish the website.
5. If you use an AI tool connected to GitHub, start its official Connect/Sign in flow and authorize only the access it asks for and you understand.
6. If the tool is not allowed to push commits, use its local file-editing environment and push the result yourself.

A repository's visibility and a website's visibility are different concepts. Read the publishing guide before turning a source repository private; on GitHub Free, a user-site Pages repository must be public.

## B. ChatGPT or a coding agent: give it the right workspace

There are two common modes:

### Local-workspace mode

1. Clone/download the repository.
2. Open the project folder in an AI coding workspace that can read and modify files.
3. Attach your résumé.
4. Paste the startup instruction from README.md.
5. Let the agent edit files and run node scripts/check.mjs.

If the tool can only answer in chat and cannot edit files, it must say so and return a complete ZIP or file-by-file patches—not claim it edited your computer.

### GitHub-connected mode

1. Open the official integrations/connectors section of your AI tool.
2. Choose GitHub, sign in, and authorize repository access.
3. Select the FolioForge repository if the tool asks which repositories are allowed.
4. Ask the agent to inspect the repository first; it should confirm read/write ability before attempting a commit.

Never send a GitHub password or personal access token in chat. If the tool reports that access is unavailable, complete the official authorization flow yourself.

## C. Supabase: create an account only for the counter

1. Go to https://supabase.com/dashboard/sign-up and create an account, or sign in.
2. Click New project and choose your own organization.
3. Give it a recognizable name and a strong database password. Save the password in a password manager.
4. Select a suitable region and wait for the project to be provisioned.
5. Open SQL Editor and run starter/backend/visitor-counter-schema.sql.
6. Open the project Connect/API Keys area and copy the project URL plus a publishable key.
7. Put only the URL and publishable key in starter/site/assets/site-config.js.
8. Open Edge Functions → Secrets. Set FOLIO_SITE_ORIGIN to your public website's origin and VISITOR_RATE_SALT to a long random value. Never put the salt or server secret in browser files.
9. Deploy starter/backend/functions/visitor-counter/index.ts as the visitor-counter function.
10. Test that a page-view request returns ok: true and a number.

Full detailed steps are in starter/backend/README.md and docs/en/05-security-publishing.md.

## D. The setup notice

When running locally, the résumé page displays a small setup notice if the visitor counter is still unconfigured. You can also append ?setup=1 to the site's URL to reveal the notice intentionally. This message is hidden from ordinary public visitors.

The notice links to the Supabase sign-up page and the setup guide. It does not ask visitors for credentials. It is a reminder for the person configuring the project.

## E. What the agent must do when a connection is missing

A well-behaved agent must:

1. Name the exact platform needed and why.
2. Give the official sign-up or authorization link.
3. State the minimum permission required.
4. Say whether the task can continue without that connection.
5. Continue work that does not depend on the unavailable connection.
6. Wait for the user's explicit authorization when the action requires it.
7. Never claim that an account was created, a repository was pushed, or a function was deployed unless that was verified.

## Common setup problems

- **Counter stays as —:** the public key/URL may be unconfigured, or the server function may not have been deployed.
- **origin_not_allowed:** FOLIO_SITE_ORIGIN must exactly match the website origin (scheme and host; no path).
- **rate_limit_not_configured:** create VISITOR_RATE_SALT in Edge Function Secrets.
- **invalid_api_key:** check the publishable key in site-config.js.
- **No Pages URL:** open Settings → Pages and choose GitHub Actions, then inspect the workflow logs.

Do not paste secrets into a bug report. Share only the error code/message after removing private details.
