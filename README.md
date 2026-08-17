# Tuftlings — Craft Community Platform

Prototype community platform for Tuftlings makers. Paid pattern files and private evidence must never be committed or included in the static site.

## Architecture

- GitHub Pages serves the statically exported Next.js frontend under `/craft-community-platform`.
- Supabase provides Auth, Postgres with RLS, Storage, Realtime, and authenticated Edge Functions.
- The browser uses the public project URL and anon key for RLS-safe operations. Privileged purchases, entitlements, roles, moderation, pattern publication/holds, exports, deletion, Etsy, webhooks, and service-role operations go only through Edge Functions.

There is no Next.js server, middleware, server action, API route, SSR, or runtime dynamic route generation. Database-backed detail pages use static shells plus query parameters.

## Development and validation

```bash
npm ci
cp .env.example .env.local
npm run dev
npm run lint
npm run typecheck
npm test
npm run check:edge
npm run build
npm run check:pages
npm run scan:secrets
```

See [Edge Function interfaces](docs/EDGE_FUNCTION_INTERFACES.md), [deployment checklist](docs/DEPLOYMENT_CHECKLIST.md), and [agent handoff](docs/AGENT_HANDOFF.md). Database migrations and RLS tests live in `supabase/` and must be tested against a disposable Supabase environment before production.
