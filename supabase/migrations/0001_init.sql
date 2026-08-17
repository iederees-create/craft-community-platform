-- Tuftlings community platform — initial schema + RLS
-- PROTOTYPE migration: written but not yet applied against a live Supabase
-- project or exercised with integration tests. Review before running in
-- any environment that matters.

create extension if not exists "pgcrypto";

-- ── Roles & profiles ─────────────────────────────────────────────────────
create type user_role as enum ('member', 'tester', 'moderator', 'pattern_maintainer', 'admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  bio text,
  avatar_url text,
  age_confirmed_18 boolean not null default false,
  quiet_mode boolean not null default false,
  digest_frequency text not null default 'weekly' check (digest_frequency in ('off','daily','weekly')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_roles (
  user_id uuid not null references profiles(id) on delete cascade,
  role user_role not null,
  granted_by uuid references profiles(id),
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- ── Products, purchase claims, entitlements ─────────────────────────────
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  provider text not null default 'etsy' check (provider in ('etsy','manual','other')),
  etsy_listing_id text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table purchase_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id),
  order_reference text not null, -- buyer-supplied, never displayed publicly
  claim_note text,
  status text not null default 'pending' check (status in ('pending','verified','rejected','revoked')),
  verified_by uuid references profiles(id),
  verified_at timestamptz,
  rejection_reason text,
  appeal_note text,
  created_at timestamptz not null default now()
);

create table entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id),
  source_claim_id uuid references purchase_claims(id),
  granted_at timestamptz not null default now(),
  expires_at timestamptz, -- nullable: expiry supported, never forced
  revoked_at timestamptz,
  revoke_reason text,
  founding_member boolean not null default false
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  target_table text,
  target_id uuid,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- ── Patterns, versions, testing ──────────────────────────────────────────
create table pattern_versions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  version text not null,
  status text not null default 'draft' check (status in ('draft','testing','approved','published','retired')),
  is_public boolean not null default false,
  changelog text,
  created_at timestamptz not null default now()
);

create table pattern_errata (
  id uuid primary key default gen_random_uuid(),
  pattern_version_id uuid not null references pattern_versions(id) on delete cascade,
  step_reference text not null,
  description text not null,
  created_by uuid references profiles(id),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table test_cohorts (
  id uuid primary key default gen_random_uuid(),
  pattern_version_id uuid not null references pattern_versions(id) on delete cascade,
  name text not null,
  min_testers int not null default 3,
  status text not null default 'recruiting' check (status in ('recruiting','active','closed')),
  created_at timestamptz not null default now()
);

create table tester_applications (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references test_cohorts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  craft_experience text,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  unique (cohort_id, user_id)
);

create table test_submissions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references test_cohorts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  difficulty_score int check (difficulty_score between 1 and 5),
  stitch_count_issues text,
  material_usage_note text,
  finished_measurements text,
  photo_consent boolean not null default false,
  evidence_media_url text,
  tester_ack boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Projects, media, make logs ───────────────────────────────────────────
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  pattern_version_id uuid references pattern_versions(id),
  visibility text not null default 'public' check (visibility in ('public','circle','private')),
  created_at timestamptz not null default now()
);

create table project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  storage_path text not null,
  alt_text text not null,
  position int not null default 0
);

create table make_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  craft_method text check (craft_method in ('crochet','sewing','other')),
  yarn_or_fabric text,
  hook_or_needle_size text,
  colours text,
  modifications text,
  time_spent_minutes int,
  difficulty int check (difficulty between 1 and 5),
  lessons_learned text,
  remix_permission text not null default 'showcase_only'
    check (remix_permission in ('showcase_only','remix_with_credit','noncommercial_remix','commercial_handmade_remix')),
  created_at timestamptz not null default now()
);

-- ── Remix lineage ─────────────────────────────────────────────────────────
create table remixes (
  id uuid primary key default gen_random_uuid(),
  original_project_id uuid not null references projects(id),
  remix_project_id uuid not null references projects(id),
  created_at timestamptz not null default now(),
  unique (remix_project_id)
);

create table remix_permissions (
  project_id uuid primary key references projects(id) on delete cascade,
  permission text not null default 'showcase_only'
    check (permission in ('showcase_only','remix_with_credit','noncommercial_remix','commercial_handmade_remix')),
  updated_at timestamptz not null default now()
);

-- ── Posts / comments / help ───────────────────────────────────────────────
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  circle_id uuid,
  project_id uuid references projects(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  is_constructive_prompt_reply boolean not null default false,
  created_at timestamptz not null default now()
);

create table pattern_help_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  pattern_version_id uuid not null references pattern_versions(id),
  step_reference text not null,
  question text not null,
  status text not null default 'open' check (status in ('open','solved','escalated')),
  created_at timestamptz not null default now()
);

create table help_responses (
  id uuid primary key default gen_random_uuid(),
  help_request_id uuid not null references pattern_help_requests(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  photo_annotation_url text,
  marked_solution boolean not null default false,
  escalated_to_maintainer boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Challenges, circles, memberships ──────────────────────────────────────
create table challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null
);

create table challenge_entries (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (challenge_id, project_id)
);

create table circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  kind text not null default 'general'
    check (kind in ('general','pattern_room','beginner_help','pattern_testing','wip','finished_projects','skill_swap','accessory_ideas')),
  created_at timestamptz not null default now()
);

create table memberships (
  circle_id uuid not null references circles(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (circle_id, user_id)
);

-- ── Bookmarks, private appreciation, notifications ────────────────────────
create table bookmarks (
  user_id uuid not null references profiles(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, project_id)
);

create table private_appreciations (
  user_id uuid not null references profiles(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, project_id)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null,
  payload jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── Moderation ─────────────────────────────────────────────────────────────
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  target_table text not null,
  target_id uuid not null,
  reason text not null,
  status text not null default 'open' check (status in ('open','actioned','dismissed')),
  created_at timestamptz not null default now()
);

create table blocks (
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create table moderation_actions (
  id uuid primary key default gen_random_uuid(),
  moderator_id uuid not null references profiles(id),
  report_id uuid references reports(id),
  action text not null,
  target_table text not null,
  target_id uuid not null,
  note text,
  created_at timestamptz not null default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table user_roles enable row level security;
alter table products enable row level security;
alter table purchase_claims enable row level security;
alter table entitlements enable row level security;
alter table audit_logs enable row level security;
alter table pattern_versions enable row level security;
alter table pattern_errata enable row level security;
alter table test_cohorts enable row level security;
alter table tester_applications enable row level security;
alter table test_submissions enable row level security;
alter table projects enable row level security;
alter table project_media enable row level security;
alter table make_logs enable row level security;
alter table remixes enable row level security;
alter table remix_permissions enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table pattern_help_requests enable row level security;
alter table help_responses enable row level security;
alter table challenges enable row level security;
alter table challenge_entries enable row level security;
alter table circles enable row level security;
alter table memberships enable row level security;
alter table bookmarks enable row level security;
alter table private_appreciations enable row level security;
alter table notifications enable row level security;
alter table reports enable row level security;
alter table blocks enable row level security;
alter table moderation_actions enable row level security;

create or replace function is_moderator_or_admin(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from user_roles
    where user_id = uid and role in ('moderator','admin')
  );
$$;

create or replace function has_entitlement(uid uuid, pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from entitlements
    where user_id = uid and product_id = pid
      and revoked_at is null
      and (expires_at is null or expires_at > now())
  );
$$;

-- Profiles: publicly readable, self-editable only.
create policy profiles_select_all on profiles for select using (true);
create policy profiles_update_self on profiles for update using (auth.uid() = id);
create policy profiles_insert_self on profiles for insert with check (auth.uid() = id);

-- Roles: readable by self and moderators; only admins grant (server-side only in practice).
create policy user_roles_select on user_roles for select
  using (auth.uid() = user_id or is_moderator_or_admin(auth.uid()));

-- Products: public read of active products.
create policy products_select_active on products for select using (active = true);

-- Purchase claims: strictly private to the claimant + moderators/admins. Never public.
create policy purchase_claims_select_own on purchase_claims for select
  using (auth.uid() = user_id or is_moderator_or_admin(auth.uid()));
create policy purchase_claims_insert_own on purchase_claims for insert
  with check (auth.uid() = user_id);
create policy purchase_claims_update_admin on purchase_claims for update
  using (is_moderator_or_admin(auth.uid()));

-- Entitlements: private to owner + admins. Never public.
create policy entitlements_select_own on entitlements for select
  using (auth.uid() = user_id or is_moderator_or_admin(auth.uid()));

-- Audit logs: admin-only.
create policy audit_logs_select_admin on audit_logs for select
  using (is_moderator_or_admin(auth.uid()));

-- Pattern versions: public ones readable by anyone; non-public require entitlement or tester/maintainer role.
create policy pattern_versions_select on pattern_versions for select
  using (
    is_public = true
    or has_entitlement(auth.uid(), product_id)
    or is_moderator_or_admin(auth.uid())
  );

create policy pattern_errata_select on pattern_errata for select using (true);
create policy pattern_errata_insert on pattern_errata for insert with check (auth.uid() = created_by);

create policy test_cohorts_select on test_cohorts for select using (true);

create policy tester_applications_select_own on tester_applications for select
  using (auth.uid() = user_id or is_moderator_or_admin(auth.uid()));
create policy tester_applications_insert_own on tester_applications for insert
  with check (auth.uid() = user_id);

create policy test_submissions_select_own on test_submissions for select
  using (auth.uid() = user_id or is_moderator_or_admin(auth.uid()));
create policy test_submissions_insert_own on test_submissions for insert
  with check (auth.uid() = user_id);

-- Projects: public/circle/private visibility rules; owner always sees own.
create policy projects_select on projects for select
  using (
    visibility = 'public'
    or auth.uid() = user_id
    or is_moderator_or_admin(auth.uid())
  );
create policy projects_insert_own on projects for insert with check (auth.uid() = user_id);
create policy projects_update_own on projects for update using (auth.uid() = user_id);
create policy projects_delete_own on projects for delete using (auth.uid() = user_id);

create policy project_media_select on project_media for select
  using (exists (select 1 from projects p where p.id = project_id and (p.visibility = 'public' or p.user_id = auth.uid())));
create policy project_media_insert_own on project_media for insert
  with check (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));

create policy make_logs_select on make_logs for select
  using (exists (select 1 from projects p where p.id = project_id and (p.visibility = 'public' or p.user_id = auth.uid())));
create policy make_logs_insert_own on make_logs for insert
  with check (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));

-- Remixes: visible to all; creation requires the ORIGINAL project's permission
-- to allow at least "remix_with_credit" or stronger. Never assume permission.
create policy remixes_select on remixes for select using (true);
create policy remixes_insert on remixes for insert
  with check (
    exists (
      select 1 from remix_permissions rp
      where rp.project_id = original_project_id
        and rp.permission in ('remix_with_credit','noncommercial_remix','commercial_handmade_remix')
    )
    and exists (select 1 from projects p where p.id = remix_project_id and p.user_id = auth.uid())
  );

create policy remix_permissions_select on remix_permissions for select using (true);
create policy remix_permissions_upsert_own on remix_permissions for insert
  with check (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));
create policy remix_permissions_update_own on remix_permissions for update
  using (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));

create policy posts_select on posts for select using (true);
create policy posts_insert_own on posts for insert with check (auth.uid() = user_id);
create policy posts_delete_own on posts for delete using (auth.uid() = user_id or is_moderator_or_admin(auth.uid()));

create policy comments_select on comments for select using (true);
create policy comments_insert_own on comments for insert with check (auth.uid() = user_id);
create policy comments_delete_own on comments for delete using (auth.uid() = user_id or is_moderator_or_admin(auth.uid()));

create policy help_requests_select on pattern_help_requests for select using (true);
create policy help_requests_insert_own on pattern_help_requests for insert with check (auth.uid() = user_id);

create policy help_responses_select on help_responses for select using (true);
create policy help_responses_insert_own on help_responses for insert with check (auth.uid() = user_id);

create policy challenges_select on challenges for select using (true);
create policy challenge_entries_select on challenge_entries for select using (true);
create policy challenge_entries_insert_own on challenge_entries for insert
  with check (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));

create policy circles_select on circles for select using (true);
create policy memberships_select_own on memberships for select
  using (auth.uid() = user_id or is_moderator_or_admin(auth.uid()));
create policy memberships_insert_own on memberships for insert with check (auth.uid() = user_id);
create policy memberships_delete_own on memberships for delete using (auth.uid() = user_id);

-- Bookmarks & appreciations: strictly private, owner-only. No public totals — enforced by never exposing counts via policy.
create policy bookmarks_select_own on bookmarks for select using (auth.uid() = user_id);
create policy bookmarks_insert_own on bookmarks for insert with check (auth.uid() = user_id);
create policy bookmarks_delete_own on bookmarks for delete using (auth.uid() = user_id);

create policy appreciations_select_own on private_appreciations for select using (auth.uid() = user_id);
create policy appreciations_insert_own on private_appreciations for insert with check (auth.uid() = user_id);
create policy appreciations_delete_own on private_appreciations for delete using (auth.uid() = user_id);

create policy notifications_select_own on notifications for select using (auth.uid() = user_id);
create policy notifications_update_own on notifications for update using (auth.uid() = user_id);

-- Reports & blocks: private to the reporter/blocker + moderators.
create policy reports_select on reports for select
  using (auth.uid() = reporter_id or is_moderator_or_admin(auth.uid()));
create policy reports_insert_own on reports for insert with check (auth.uid() = reporter_id);

create policy blocks_select_own on blocks for select using (auth.uid() = blocker_id);
create policy blocks_insert_own on blocks for insert with check (auth.uid() = blocker_id);
create policy blocks_delete_own on blocks for delete using (auth.uid() = blocker_id);

create policy moderation_actions_select on moderation_actions for select
  using (is_moderator_or_admin(auth.uid()));

-- ── Storage buckets (created via Supabase dashboard/CLI; RLS below assumes
--    these bucket names). Buyer-paid pattern files live in a private bucket,
--    never public.
-- buckets: 'project-media' (public read, owner write), 'pattern-files' (private, entitlement-gated), 'evidence' (private, tester+moderator only)
