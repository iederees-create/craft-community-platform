# GitHub Pages + Supabase deployment checklist

## GitHub repository

- Keep the repository private until the scan is reviewed and Iederees explicitly confirms any visibility change.
- Settings → Pages → Source: **GitHub Actions**. Do not configure a separate application host.
- Actions variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` only. These are public by design; never add the service-role key.
- Ensure Actions has read/write workflow permission and Pages environments may deploy from `main`.
- If private-repository Pages is unavailable on the current plan, choose GitHub Pro or explicitly approve making the code repository public after reviewing the scan.

## Supabase Auth

- Site URL: `https://iederees-create.github.io/craft-community-platform/`.
- Redirect allowlist: production callback `https://iederees-create.github.io/craft-community-platform/auth/callback/` and local callbacks `http://localhost:3000/auth/callback/`, `http://127.0.0.1:3000/auth/callback/`.
- Enable email confirmation, configure SMTP/templates, and confirm links use PKCE callback URLs.
- Confirm signup metadata/trigger records the 18+ acknowledgement and block unacknowledged accounts server-side.

## Edge Functions and Storage

- Set `SUPABASE_SERVICE_ROLE_KEY`, Etsy credentials, webhook verification secret, and `ALLOWED_ORIGIN` via `supabase secrets set`; never GitHub Pages.
- Deploy and integration-test every function in the interface specification; implement atomic rate limiting and webhook signature verification first.
- Create/verify `project-media` (public), `pattern-files` (private), and `evidence` (private) buckets and their RLS/path conventions.
- Ensure paid files live only in private `pattern-files`, never `public/` or the repository.

## Database and release

- Link the correct project, review migrations, run `supabase db push`, then `supabase test db` against a disposable environment before production.
- Verify RLS with anon/authenticated/moderator/admin cases; confirm service-role operations emit immutable audit logs.
- Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run check:edge`, `npm run build`, `npm run check:pages`, and `npm run scan:secrets`.
- Inspect `out/` for private content and verify all `_next` URLs include `/craft-community-platform/` before deployment.
