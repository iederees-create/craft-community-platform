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
