-- Tuftlings — schema hardening: indexes, constraints, triggers, storage policies
-- Builds on 0001_init.sql. Not yet applied against a live project or
-- exercised against a running Postgres instance in this environment
-- (no local Supabase CLI / Docker available here) — apply via
-- `supabase db push` and run supabase/tests/ before trusting in production.

-- ── updated_at maintenance ────────────────────────────────────────────────
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ── Auto-provision a profile row on signup ────────────────────────────────
-- Supabase Auth writes to auth.users directly; without this trigger a new
-- user has no row in public.profiles and every profile-dependent FK/RLS
-- check fails until the client happens to insert one.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'New Member'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Entitlement revocation audit trail ────────────────────────────────────
create or replace function audit_entitlement_revocation() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.revoked_at is not null and old.revoked_at is null then
    insert into audit_logs (actor_id, action, target_table, target_id, detail)
    values (auth.uid(), 'entitlement_revoked', 'entitlements', new.id,
            jsonb_build_object('reason', new.revoke_reason));
  end if;
  return new;
end;
$$;

create trigger entitlements_audit_revocation
  after update on entitlements
  for each row execute function audit_entitlement_revocation();

-- ── Additional constraints ────────────────────────────────────────────────
alter table profiles
  add constraint profiles_display_name_not_blank check (btrim(display_name) <> '');

alter table entitlements
  add constraint entitlements_expiry_after_grant
    check (expires_at is null or expires_at > granted_at);

-- One active (non-revoked) entitlement per user/product — re-purchases or
-- corrections should revoke the old row rather than create a duplicate.
create unique index entitlements_active_unique
  on entitlements (user_id, product_id)
  where revoked_at is null;

alter table purchase_claims
  add constraint purchase_claims_order_reference_not_blank check (btrim(order_reference) <> '');

alter table projects
  add constraint projects_title_not_blank check (btrim(title) <> '');

alter table make_logs
  add constraint make_logs_time_spent_nonnegative check (time_spent_minutes is null or time_spent_minutes >= 0);

alter table test_submissions
  add constraint test_submissions_one_per_tester unique (cohort_id, user_id);

alter table remixes
  add constraint remixes_not_self_remix check (original_project_id <> remix_project_id);

-- ── Indexes for foreign keys and common access patterns ───────────────────
create index purchase_claims_user_id_idx on purchase_claims (user_id);
create index purchase_claims_product_id_idx on purchase_claims (product_id);
create index purchase_claims_status_idx on purchase_claims (status) where status = 'pending';

create index entitlements_user_id_idx on entitlements (user_id);
create index entitlements_product_id_idx on entitlements (product_id);

create index pattern_versions_product_id_idx on pattern_versions (product_id);
create index pattern_errata_pattern_version_id_idx on pattern_errata (pattern_version_id);

create index test_cohorts_pattern_version_id_idx on test_cohorts (pattern_version_id);
create index tester_applications_cohort_id_idx on tester_applications (cohort_id);
create index tester_applications_user_id_idx on tester_applications (user_id);
create index test_submissions_cohort_id_idx on test_submissions (cohort_id);
create index test_submissions_user_id_idx on test_submissions (user_id);

create index projects_user_id_idx on projects (user_id);
create index projects_pattern_version_id_idx on projects (pattern_version_id);
create index projects_visibility_idx on projects (visibility) where visibility = 'public';

create index project_media_project_id_idx on project_media (project_id);
create index make_logs_project_id_idx on make_logs (project_id);

create index remixes_original_project_id_idx on remixes (original_project_id);
create index remixes_remix_project_id_idx on remixes (remix_project_id);

create index posts_user_id_idx on posts (user_id);
create index posts_circle_id_idx on posts (circle_id);
create index posts_project_id_idx on posts (project_id);
create index comments_post_id_idx on comments (post_id);
create index comments_user_id_idx on comments (user_id);

create index pattern_help_requests_pattern_version_id_idx on pattern_help_requests (pattern_version_id);
create index pattern_help_requests_user_id_idx on pattern_help_requests (user_id);
create index pattern_help_requests_status_idx on pattern_help_requests (status) where status <> 'solved';
create index help_responses_help_request_id_idx on help_responses (help_request_id);

create index challenge_entries_challenge_id_idx on challenge_entries (challenge_id);
create index challenge_entries_project_id_idx on challenge_entries (project_id);
create index memberships_user_id_idx on memberships (user_id);
create index bookmarks_project_id_idx on bookmarks (project_id);

create index notifications_user_id_unread_idx on notifications (user_id) where read_at is null;

create index reports_target_idx on reports (target_table, target_id);
create index moderation_actions_target_idx on moderation_actions (target_table, target_id);

-- ── Storage buckets ────────────────────────────────────────────────────────
-- project-media: public read (member-uploaded gallery/make-log photos), owner write.
-- pattern-files: private, paid buyer assets — never public, gated by entitlement.
-- evidence: private, pattern-testing submission proof — testers + moderators only.
insert into storage.buckets (id, name, public)
values
  ('project-media', 'project-media', true),
  ('pattern-files', 'pattern-files', false),
  ('evidence', 'evidence', false)
on conflict (id) do nothing;

create policy project_media_public_read on storage.objects for select
  using (bucket_id = 'project-media');

create policy project_media_owner_write on storage.objects for insert
  with check (bucket_id = 'project-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy project_media_owner_delete on storage.objects for delete
  using (bucket_id = 'project-media' and (storage.foldername(name))[1] = auth.uid()::text);

-- Pattern files: path convention 'pattern-files/<product_id>/...'. Readable
-- only by users with a live (non-revoked, non-expired) entitlement for that
-- product, or moderators/admins. Writes are server-only (service role via
-- Edge Function) — no client insert/update/delete policy is defined here.
create policy pattern_files_entitled_read on storage.objects for select
  using (
    bucket_id = 'pattern-files'
    and (
      is_moderator_or_admin(auth.uid())
      or exists (
        select 1 from entitlements e
        join products p on p.id = e.product_id
        where p.id::text = (storage.foldername(name))[1]
          and e.user_id = auth.uid()
          and e.revoked_at is null
          and (e.expires_at is null or e.expires_at > now())
      )
    )
  );

-- Evidence: path convention 'evidence/<user_id>/...'. Owner and moderators only.
create policy evidence_owner_or_moderator_read on storage.objects for select
  using (
    bucket_id = 'evidence'
    and ((storage.foldername(name))[1] = auth.uid()::text or is_moderator_or_admin(auth.uid()))
  );

create policy evidence_owner_write on storage.objects for insert
  with check (bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text);
