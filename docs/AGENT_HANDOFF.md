# Tuftlings Agent Work Ledger

Updated: 2026-08-17  
Purpose: prevent Claude Code and Codex from duplicating or overwriting each other's work.

## Verified baseline from Claude Code

Main commit: b5e8a03471bbc219976f42eb0b0a7ca741100a4b

Claude completed:

- Private GitHub repository creation.
- Next.js 16, TypeScript, Tailwind, Supabase package scaffold.
- Initial README and environment example.
- Prototype migration at supabase/migrations/0001_init.sql.
- Initial high-level tables and RLS policies.
- Push to origin/main.

Baseline limitations:

- Homepage remains the default Next.js starter.
- Migration is explicitly untested and has not been applied to live Supabase.
- No core application flows exist yet.
- No physical pattern or buyer PDFs exist yet.
- No Etsy Complete Product Pack exists yet.
- No portfolio or blog integration exists yet.
- No deployment is verified.

## Codex-owned work

Branch: agent/community-product-governance

Codex completed these documentation deliverables:

- docs/COMMUNITY_CHARTER.md
- docs/MODERATION_HANDBOOK.md
- docs/PATTERN_TESTING_PROGRAMME.md
- docs/BUYER_LICENSE_AND_SAFETY.md
- docs/LAUNCH_RISK_REGISTER.md
- docs/AGENT_HANDOFF.md

Claude should treat these as product requirements and integrate them into the UI, database workflow, testing, buyer files, and launch gates. Claude should not rewrite or delete them without recording the reason.

## Claude-owned continuation

Claude Code should continue with:

1. Review and harden the initial Supabase migration.
2. Add missing storage policies, indexes, constraints, updated-at triggers, circle visibility, role mutation controls, and RLS tests.
3. Build authentication, age gate, onboarding, purchase claim, entitlement, gallery, Make Log, remix, help, Pattern Lab, reporting, blocking, moderation, export, and deletion flows.
4. Replace the default Next.js homepage with the Tuftlings experience.
5. Create pattern source and prototype PDFs while keeping them clearly untested.
6. Build the Francis Listing Manager Complete Product Pack and stop at verified Etsy draft.
7. Diagnose the existing 3D Portfolio GitHub Pages failure before adding the case study and blog.
8. Add deployment configuration and verify a safe preview.
9. Run the agreed test matrix.

## Shared integration requirements

Claude must map the new documentation into the product:

- Community Charter: public community-guidelines route and onboarding acknowledgement.
- Moderation Handbook: admin case-management fields and incident severity.
- Pattern Testing Programme: version states, cohort evidence, and approval gate.
- Buyer Licence and Safety: buyer PDF, listing FAQ, and product licence route.
- Risk Register: release checklist and automated/manual gates.
- Work Ledger: update after each meaningful handoff.

## Collision rules

- Codex does not edit Claude's active app files or migration while Claude is working locally.
- Claude does not modify the Codex branch directly.
- Integration happens through review/merge of the Codex draft PR.
- After merge, Claude pulls main before resuming.
- Paid buyer assets remain outside the public application bundle.
- Etsy remains draft-only and uses Francis Listing Manager.
- Portfolio Etsy URL is added only after publication.
- Demo content is never presented as real community activity.

---

## Claude — schema hardening (appended, does not edit the above)

Branch: agent/claude-core-community (merged into this integration branch)  
Commit: 204c4b62a2240401f1491b103f0381f10c5e7c09

Addresses continuation items 1 and 2 above:

- `supabase/migrations/0002_hardening.sql` — indexes on every FK/filter
  column, integrity constraints (no duplicate active entitlements per
  user/product, one test submission per tester per cohort, no
  self-remixing, expiry-after-grant ordering, non-blank names/titles),
  an `updated_at` trigger on `profiles`, an `auth.users → profiles`
  auto-provisioning trigger (0001 had the column/policy but nothing
  populated it on signup), an entitlement-revocation audit trigger, and
  storage bucket + RLS policies for `project-media` (public read, owner
  write), `pattern-files` (private, entitlement-gated read, no client
  write — Edge-Function-only), and `evidence` (owner + moderator read,
  owner write).
- `supabase/tests/0001_rls.test.sql` — pgTAP regression tests for
  purchase-claim privacy, entitlement privacy, project visibility,
  bookmark privacy, and remix-permission enforcement.

Still unresolved / not claimed as done:

- Neither migration has been applied to a live database, and the pgTAP
  suite has not been run — no Docker/Supabase CLI is available in this
  environment. Must run `supabase db push` and `supabase test db`
  before trusting this in production.
- Continuation items 3–9 above are not started.

---

## Claude — auth/onboarding UI + community charter route (appended)

Branch: agent/github-pages-supabase  
Commit: 7dcc7b9

Addresses continuation item 3 (auth/age-gate/onboarding slice only — purchase
claim, entitlement, gallery, Make Log, remix, help, Pattern Lab, reporting,
blocking, moderation, export/deletion flows are still not started), item 4
(homepage), and the Community Charter row of the shared integration
requirements above.

- `src/lib/supabase/client.ts` — lazy singleton `@supabase/supabase-js`
  browser client (not `@supabase/ssr`: this app has no server runtime to
  make cookie-based SSR session storage useful). Throws only when actually
  invoked at runtime, never at module scope, so a missing `.env.local`
  cannot break `next build`.
- `src/lib/auth/use-session.ts` — client hook wrapping
  `supabase.auth.getSession()` + `onAuthStateChange`.
- `src/components/auth/{sign-in,sign-up}-form.tsx` + `src/app/{sign-in,sign-up}/page.tsx`
  — password-based email auth. Sign-up handles the
  email-confirmation-required case explicitly rather than assuming an
  immediate session.
- `src/app/onboarding/page.tsx` — requires an authenticated user, requires
  both an 18+ confirmation checkbox and a Community Charter acknowledgement
  checkbox before enabling submit, then upserts `profiles` (RLS-protected,
  self-only) with `display_name` and `age_confirmed_18`.
- `src/app/guidelines/page.tsx` + `src/lib/markdown/simple-render.tsx` —
  reads `docs/COMMUNITY_CHARTER.md` directly at build time (Server
  Component, `fs.readFileSync`, no client fetch) and renders it through a
  minimal hand-rolled markdown-to-JSX converter (headings/paragraphs/lists
  only — intentionally not a full markdown library for one doc page). This
  page can never drift from the charter Codex owns because it renders the
  file itself rather than a copy.
- `src/components/layout/site-header.tsx` — auth-aware nav (sign in/join
  vs. sign out), linked from a new `src/app/layout.tsx`.
- `src/app/page.tsx` — replaces the default Next.js starter homepage with
  real Tuftlings copy, explicitly labelled prototype status, no fabricated
  community activity or numbers.

No server actions, API routes, middleware-dependent auth, or SSR
dependency were introduced. No service-role key appears anywhere in this
code. Verified together: `npm run lint` (clean), `npx tsc --noEmit`
(clean), and a full `npm run build` against Codex's real
`output: 'export'` config — produced a genuine `out/` static export,
including a prebuilt `out/guidelines/index.html`, confirming the charter
route is static-export-safe. Build artifacts were removed before commit.

Still unresolved / not claimed as done:

- No live Supabase project is configured anywhere in this environment, so
  none of sign-up, sign-in, or the onboarding upsert have been exercised
  against a real backend — only build-time/type-level verification and
  code review, not an end-to-end run.
- Purchase-claim UI, entitlement-gated pattern library, gallery/Make Logs,
  remix-lineage UI, pattern-help flows, Pattern Lab, reporting/blocking/
  moderation UI, and account export/deletion are all still unbuilt.
- The Moderation Handbook, Pattern Testing Programme, Buyer Licence and
  Safety, and Launch Risk Register integration rows above are not yet
  reflected anywhere in the app.

---

## Codex — GitHub Pages + Supabase-only architecture

Branch: `agent/github-pages-supabase`
Architecture commit: pending at time of this ledger entry (use the commit containing this section).

Codex changed or added:

- `.github/workflows/pages.yml`
- `.gitignore`
- `.env.example` and `next.config.ts` (the concurrent Claude commit incorporated Codex's prepared static-export/env edits)
- `package.json` and `tsconfig.json`
- `README.md`
- `docs/DEPLOYMENT_CHECKLIST.md`
- `docs/EDGE_FUNCTION_INTERFACES.md`
- `docs/AGENT_HANDOFF.md`
- `public/vercel.svg` (removed unused starter asset)
- `scripts/check-edge-functions.mjs`, `scripts/check-pages-output.mjs`, `scripts/scan-secrets.mjs`
- `src/app/auth/callback/page.tsx`, `src/app/project/page.tsx`, `src/app/reset-password/page.tsx`
- `src/app/layout.tsx`
- `src/components/auth/sign-in-form.tsx`, `src/components/auth/sign-up-form.tsx`
- `src/lib/auth/redirect-url.ts`
- `supabase/functions/README.md`, `supabase/functions/_shared/http.ts`, and the ten function `index.ts` scaffolds named in `docs/EDGE_FUNCTION_INTERFACES.md`
- `tests/architecture.test.mjs`

Decisions/interfaces Claude must preserve:

- GitHub Pages is the only frontend host; production paths use `/craft-community-platform`, trailing slashes, static export, and unoptimised images.
- There is no Next server surface. Use browser Supabase calls only behind reviewed RLS; use the documented Edge Functions for every privileged/service-role operation.
- Detail pages that depend on database IDs use static shells with query parameters unless every route can be generated at build time.
- Never expose service-role/Etsy/webhook secrets in GitHub, the Pages artifact, or `NEXT_PUBLIC_*`.
- Edge handlers are security-boundary scaffolds only. Claude must implement narrow, idempotent RPC/transaction bodies, atomic rate limiting, exhaustive input schemas, webhook signature validation, and integration tests before launch.

Validation run: ESLint, Next TypeScript check, Node unit tests, production static export, Pages base-path/artifact verification, real `deno check` for all ten functions, tracked-file secret scan, repository/history credential search, private-file extension/name scan, and current-tree forbidden-host search. Supabase migrations/pgTAP remain unexecuted because no linked disposable Supabase instance was supplied.

Remaining for Claude: implement and integration-test each Edge transaction; finish application flows against these interfaces; exercise signup/verification/reset/session restoration against a real Supabase project; apply/test migrations and Storage RLS; configure production Auth URLs/secrets/buckets; and obtain Iederees's explicit decision about GitHub Pro versus public code if private Pages is unavailable.
