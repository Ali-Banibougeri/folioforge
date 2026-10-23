# Optional Arcade Backend

The résumé website works without Supabase. This backend is only needed for shared visitor counts and shared arcade leaderboards.

## Before you begin

Create your own Supabase project. Do not use someone else's project URL or credentials. The public browser key is configured in starter/site/assets/site-config.js. Secret keys must remain in Supabase's server-side secret manager.

## Database

Open the SQL Editor in your Supabase dashboard and run arcade-schema.sql.

The schema creates:
- arcade_scores for leaderboard entries
- arcade_runs for one-time game sessions and seeds
- site_page_views for per-page, per-browser-day visit counts

Row Level Security is enabled and direct anonymous table writes are revoked. Do not add a broad public write policy as a workaround.

## Edge Function

The function source is functions/arcade-api/index.ts. It uses Supabase's built-in server secret and publishable key maps when available, or server-only environment overrides.

1. Install the current Supabase CLI from official documentation.
2. Update config.toml with your project reference.
3. Log in and link the local project.
4. Configure ARCADE_SITE_ORIGIN to exactly match the published site's origin, such as https://YOUR_USERNAME.github.io.
5. Set ARCADE_RATE_SALT to a long random value.
6. Deploy the arcade-api function.
7. Verify a normal completed game round and inspect the Function and Postgres logs.

Never paste a new server secret into this repository, an issue, or a chat. Do not place a secret key into site-config.js.

## Limitations

The shared leaderboard reduces simple score forgery through server-side replay but is not a complete anti-bot system. The visitor counter is approximate and should not be used for billing or security decisions.
