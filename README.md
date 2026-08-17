# Tuftlings — Craft Community Platform

**Status: PROTOTYPE.** This is the initial foundation for a private community
platform built around an original modular pocket-creature craft pattern
system ("Tuftlings"), sold as a digital download and supported here by a
member community: Make Logs, remix lineage, pattern testing, and
step-specific help.

This repository is the **community platform** codebase. It does not contain
the pattern PDFs or any paid buyer assets — those are distributed through
Etsy and kept out of this repo entirely.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Supabase](https://supabase.com) — Auth, Postgres, Storage, Row Level Security
- Deployment target: [Render](https://render.com)

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your own Supabase project values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Schema and Row Level Security policies live in `supabase/migrations/`. Apply
them to a Supabase project with the Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Every table has RLS enabled. Purchase claims, entitlements, and audit logs
are never publicly readable. Bookmarks and private appreciations are
owner-only by design — this platform does not surface public
follower/like counts.

## Design principles

- **Slow social** — finite, chronological pages instead of infinite scroll;
  no public engagement counts; no streaks; no ads.
- **No DMs in v1** — private messaging is deliberately excluded to reduce
  harassment and moderation risk. Use structured public/group discussion
  instead.
- **Never assume remix permission** — every project explicitly states one of
  four permission levels (showcase only, remix with credit, non-commercial
  remix, commercial handmade remix). Absence of a stated permission means
  no remix is permitted.
- **Entitlements are earned, not scraped** — purchase verification never
  automates or scrapes Etsy. Buyers submit a private purchase claim that is
  verified via the Etsy API (when configured) or manual admin review.

## Project status

This repository currently contains the initial Next.js scaffold and the
first Supabase schema/RLS migration. It is an early-stage foundation, not a
feature-complete product — see the project's release notes for what is
implemented versus planned.
