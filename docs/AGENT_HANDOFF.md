# Agent Handoff Log

Shared ledger between Codex (governance, deployment, static-export
architecture) and Claude (schema, application UI, buyer-facing content) on
the Tuftlings platform. Each entry is append-only — do not edit or delete a
prior agent's entry.

## Branch ownership

- `agent/community-product-governance` — Codex. Do not edit directly.
- `agent/claude-core-community` — Claude. This entry's branch.
- `main` — integration branch. PRs land here after cross-review.

---

## Claude — schema hardening (this task)

**Branch:** `agent/claude-core-community`
**Status:** done, unexecuted against a live database (see below)

**What changed:**
- `supabase/migrations/0002_hardening.sql` — adds indexes on every
  foreign-key/common-filter column, additional check constraints (non-blank
  names/titles/order references, entitlement expiry-after-grant ordering,
  non-negative time spent, no self-remixing), a unique partial index
  preventing duplicate active entitlements per user/product, a unique
  constraint capping one test submission per tester per cohort, a
  `set_updated_at()` trigger wired to `profiles`, a `handle_new_user()`
  trigger that auto-provisions a `profiles` row from `auth.users` on
  signup (0001 defined the column/policy but nothing populated it
  automatically), an audit-log trigger that records entitlement
  revocations, and storage bucket + RLS policy definitions for
  `project-media` (public read, owner write), `pattern-files` (private,
  entitlement-gated read, no client write — Edge-Function-only), and
  `evidence` (owner + moderator read, owner write).
- `supabase/tests/0001_rls.test.sql` — pgTAP RLS regression tests covering
  purchase-claim privacy, entitlement privacy, project visibility, bookmark
  privacy (no public counts), and remix-permission enforcement (a remix
  insert is rejected unless the original project's stated permission
  allows it).

**Not yet done / explicitly not claimed:**
- These migrations and tests have **not been run** — this sandbox has no
  Docker and no Supabase CLI installed, so there is no local Postgres to
  apply them against. Before relying on this in production: `supabase
  start`, `supabase db push`, `supabase test db`, and fix whatever the
  pgTAP run surfaces.
- Storage policies assume a `<product_id>/...` and `<user_id>/...` path
  convention for `pattern-files` and `evidence` respectively — the
  upload code that writes to those paths doesn't exist yet (tracked under
  Claude's UI work, not started).
- No client application code was touched in this task — this was schema
  only.

**Next Claude task:** application screens/auth UI (browser-client-only,
static-export compatible, no server actions/API routes/middleware — per
the updated deployment architecture, all privileged writes route through
Codex-defined Supabase Edge Functions).
