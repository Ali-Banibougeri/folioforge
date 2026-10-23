# Security Policy

FolioForge is a learning template, not a security-certified product.

## Reporting

Do not publish secrets, access tokens, private personal information, or live exploit details in an issue. Use GitHub's private vulnerability reporting feature if enabled; otherwise contact the maintainer privately through GitHub.

## Safeguards

- Never commit Supabase secret or service-role keys.
- Never grant unrestricted anonymous write access to exposed database tables.
- Enable Row Level Security for tables exposed to the Data API.
- Keep personal résumé data out of public examples unless the owner intends it to be public.
- Treat visitor counts as approximate browser-day metrics, not security or billing evidence.
- Browser JavaScript is visible to visitors. Minification does not secure credentials or proprietary algorithms.
- Keep server-only configuration in the server's secret manager, never in browser assets or public logs.

If a key is exposed, revoke or rotate it and review repository history and deployed artifacts. Removing a line from the latest version is not a substitute for rotating a credential.
