# Optional Visitor Counter — Setup Guide

The résumé website works without Supabase. Supabase is optional and is used only for the shared visitor counter. If you skip this setup, the rest of the website still works.

## Before starting

You need:
- A GitHub account to store and publish your website.
- Your own copy of this repository.
- A Supabase account only if you want the shared visitor count.
- An AI coding workspace with permission to edit your repository files, if you want the agent to do the work for you.

Never send passwords or secret API keys to ChatGPT. When a tool needs permission to access GitHub or Supabase, use its official sign-in/authorization prompt. If the connection is missing, the coding agent should tell you which service is needed and link to its sign-in page instead of pretending it is connected.

## 1. Create a Supabase account and project

1. Open https://supabase.com/dashboard/sign-up and create an account, or sign in.
2. Click New project and select your organization.
3. Name the project and set a strong database password. Store that password safely; do not commit it.
4. Choose a region close to your expected visitors and create the project.
5. Wait until the project is ready.

## 2. Create the visitor table

1. In your project, open SQL Editor.
2. Choose New query.
3. Copy the full contents of visitor-counter-schema.sql into the editor.
4. Click Run.
5. Confirm that site_page_views exists under Table Editor.

The schema deliberately gives browser roles no direct write access. Do not fix an access error by granting unrestricted writes to anon or authenticated.

## 3. Configure the public website key

1. Open your project's Connect or API Keys page.
2. Copy the project URL and the publishable key (sb_publishable_...) or legacy anon public key.
3. Edit starter/site/assets/site-config.js.
4. Replace the URL placeholder and PASTE_SUPABASE_PUBLISHABLE_KEY placeholder.
5. Make sure functionName is visitor-counter.

A publishable key is designed for browser use. It is not a database password. Never paste an sb_secret_... key or service-role key into this file.

## 4. Configure the Edge Function

The function source is starter/backend/functions/visitor-counter/index.ts.

1. Install the current Supabase CLI: https://supabase.com/docs/guides/cli
2. In starter/backend/config.toml, replace YOUR_PROJECT_REF with your project reference.
3. In a terminal, run npx supabase login and finish sign-in in your browser.
4. Link the project, for example: npx supabase link --project-ref YOUR_PROJECT_REF.
5. Generate a long random rate-limit salt locally; on Linux/macOS you can run openssl rand -hex 32. Never commit this value.
6. In the Supabase dashboard open Edge Functions → Secrets and add:
   - VISITOR_RATE_SALT: the random value you generated.
   - FOLIO_SITE_ORIGIN: the origin of the public website, e.g. https://YOUR_USERNAME.github.io. Include scheme but not a path.
7. Deploy the function from the project folder. See current syntax at https://supabase.com/docs/guides/functions/deploy; typical usage is npx supabase functions deploy visitor-counter.
8. Confirm the function status is Active.

On hosted Supabase, the function uses the platform's built-in server secret map. If your environment does not expose that map, add a server-only FOLIO_COUNTER_SECRET_KEY in Edge Function Secrets. Never put that key in GitHub source or browser configuration.

## 5. Show the connection notification while setting up

Run the site locally over HTTP and open it with ?setup=1 in the address. If the counter is not configured, a setup notice appears with links to create a Supabase account and read this guide. Ordinary public visitors will not see it unless they intentionally open setup mode. On localhost, it appears automatically while the key is not configured.

For a quick local preview, run python -m http.server 8000 from a folder that exposes starter/site/, then open http://localhost:8000/starter/site/?setup=1.

## 6. Test the counter

1. Open your website.
2. In the browser network panel, find a POST request to /functions/v1/visitor-counter.
3. Confirm the response contains ok: true and a numeric count.
4. Reload the page. The same browser should not increment the counter more than once per UTC day.
5. Open a private window or a different browser to test another browser ID.
6. If origin_not_allowed appears, set FOLIO_SITE_ORIGIN to the site origin exactly.
7. If rate_limit_not_configured appears, set VISITOR_RATE_SALT in Edge Function Secrets.
8. If invalid_api_key appears, check site-config.js.
9. If server_not_configured appears, check server-side function secrets.

## What the number means

The count represents unique browser IDs per page per UTC day, not verified human beings. Visitors can clear browser storage or automate requests. Rate limits reduce basic abuse but do not guarantee an accurate human count. Do not use this metric for billing or security decisions.

## If you do not need the counter

Set visitorCounterEnabled to false in starter/site/assets/portfolio-data.js. The résumé will continue working and the counter plus setup notice will stay hidden.
