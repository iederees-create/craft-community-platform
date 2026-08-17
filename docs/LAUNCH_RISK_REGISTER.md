# Tuftlings Launch Risk Register and Release Gates

Status: Active prototype register  
Risk scale: Likelihood 1-5, Impact 1-5, Score = likelihood × impact

| ID | Risk | L | I | Score | Control | Release gate |
|---|---|---:|---:|---:|---|---|
| R1 | Pattern instructions fail physically | 4 | 5 | 20 | Three independent testers per primary method; versioned errata | No Etsy publication before approval record |
| R2 | Child or pet safety claims are misleading | 3 | 5 | 15 | Decorative positioning until compliance evidence exists | No child-safe, baby-safe, or pet-safe claims |
| R3 | Paid pattern assets leak through public code/storage | 3 | 5 | 15 | Private repo; private bucket; signed URLs; entitlement tests | Security test before upload |
| R4 | RLS exposes claims, evidence, or audit data | 3 | 5 | 15 | Deny-by-default RLS; role-matrix integration tests | Supabase policy tests must pass |
| R5 | Brand conflicts with existing toy/craft rights | 3 | 4 | 12 | Name, domain, marketplace, and trademark collision review | Provisional name only until review documented |
| R6 | Listing copies popular-culture IP | 3 | 5 | 15 | Original characters; prohibited-keyword review; asset provenance log | IP review before Listing Manager import |
| R7 | Etsy listing becomes membership-only service | 2 | 5 | 10 | Substantial downloadable product; community is a bonus | Buyer pack validation |
| R8 | AI-generated work is not disclosed | 3 | 4 | 12 | Asset/source register and listing disclosure | Compliance review before draft |
| R9 | Fake photos or testimonials reach listing | 2 | 5 | 10 | Real-sample photo gate; no seeded content in marketing | Manual asset audit |
| R10 | Purchase verification collects excess personal data | 3 | 4 | 12 | Minimum data; private claims; retention schedule; manual fallback | Privacy review before onboarding |
| R11 | Harassment or piracy harms early members | 3 | 4 | 12 | Reporting, blocking, finite feed, no DMs, moderator handbook | Abuse-flow E2E test |
| R12 | Moderator powers are exposed client-side | 2 | 5 | 10 | Server-only roles and service key; audit log | Privilege escalation tests |
| R13 | Storage upload enables malware or oversized files | 3 | 4 | 12 | MIME allowlist, size limits, image processing, signed access | Upload security tests |
| R14 | Portfolio claims a product is live prematurely | 3 | 3 | 9 | Prototype labels; no Etsy/live links before verification | Portfolio content review |
| R15 | Existing 3D Portfolio deployment remains broken | 4 | 3 | 12 | Diagnose current GitHub Pages build before integration | Existing deployment must be green |
| R16 | Community promises unsustainable monthly drops | 3 | 3 | 9 | Roadmap language only; no guaranteed cadence | Marketing copy review |
| R17 | Costs grow through uncontrolled AI/hosting usage | 4 | 3 | 12 | Budgets, rate limits, logs, model selection, task boundaries | Cost controls documented |
| R18 | Deletion does not remove private member data | 2 | 5 | 10 | Deletion workflow, retention exceptions, export test | Account lifecycle E2E |
| R19 | Remix permissions are misapplied | 3 | 4 | 12 | Explicit permission state; deny by default; lineage tests | Permission test suite |
| R20 | Seed/demo activity is mistaken for real users | 3 | 4 | 12 | Visible DEMO labels; exclude seed data from analytics | Production seed audit |

## Mandatory release gates

### Gate A — Brand

- Collision search recorded.
- Original asset provenance recorded.
- Prohibited franchise terms absent from public metadata.

### Gate B — Pattern

- Crochet and sewing sources versioned.
- Automated validations pass.
- Required physical testing completed.
- Blocking and major findings resolved.
- Owner signs approval record.

### Gate C — Platform security

- RLS matrix tests pass.
- Admin secrets are server-only.
- Upload restrictions pass.
- Claims and entitlements are private.
- Remix permissions deny by default.
- Account export and deletion pass.

### Gate D — Community readiness

- Charter and guidelines are visible.
- Reporting and blocking work.
- Moderation roles and audit trail work.
- Appeal path and safety escalation are documented.
- Demo content is labelled.

### Gate E — Etsy draft

- Complete Product Pack validates.
- Five or fewer buyer files.
- Ten or fewer images.
- Exactly thirteen compliant tags.
- AI disclosure present where needed.
- Digital/no-physical-item notice present.
- Real-sample requirement satisfied.
- Imported only through Francis Listing Manager.
- Stops at verified draft; never publishes automatically.

### Gate F — Portfolio and deployment

- Existing 3D Portfolio build is green.
- Case study states prototype/testing status accurately.
- No Etsy link before publication.
- No community link before deployment verification.
- Accessibility and broken-link checks pass.

## Decision record

Each gate must record reviewer, date, evidence link, result, exceptions, and next review. A failed mandatory gate cannot be waived by an AI agent.
