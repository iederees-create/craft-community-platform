-- RLS regression tests for the Tuftlings schema, written for pgTAP.
--
-- STATUS: written, NOT executed in this environment — no local Postgres/
-- Supabase CLI/Docker is available in this sandbox to run them. Run before
-- trusting these policies in production:
--
--   supabase start
--   supabase test db
--
-- Each test creates two auth users directly in auth.users (pgTAP tests run
-- as postgres, bypassing RLS for setup), then asserts what each of those
-- users can and cannot see/do when impersonated via `set_config('request.jwt.claims', ...)`
-- / `auth.uid()` through Supabase's `authenticated` role helpers.

begin;
create extension if not exists pgtap;

select plan(9);

-- ── fixtures ───────────────────────────────────────────────────────────────
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'alice@example.com'),
  ('00000000-0000-0000-0000-000000000002', 'bob@example.com');

insert into profiles (id, display_name) values
  ('00000000-0000-0000-0000-000000000001', 'Alice (DEMO)'),
  ('00000000-0000-0000-0000-000000000002', 'Bob (DEMO)');

insert into products (id, slug, name) values
  ('10000000-0000-0000-0000-000000000001', 'tuftlings-pattern', 'Tuftlings Pattern (DEMO)');

insert into purchase_claims (id, user_id, product_id, order_reference)
values ('20000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'DEMO-ORDER-1');

insert into entitlements (id, user_id, product_id)
values ('30000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001');

insert into projects (id, user_id, title, visibility) values
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Alice public make (DEMO)', 'public'),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Alice private make (DEMO)', 'private');

insert into remix_permissions (project_id, permission)
values ('40000000-0000-0000-0000-000000000001', 'showcase_only');

insert into bookmarks (user_id, project_id)
values ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001');

-- ── helper: run the rest of the assertions as an authenticated user ────────
create or replace function tests.auth_as(uid uuid) returns void
language sql as $$
  select set_config('request.jwt.claim.sub', uid::text, true);
$$;

-- purchase_claims: owner can read, other member cannot.
select tests.auth_as('00000000-0000-0000-0000-000000000001');
select is(
  (select count(*) from purchase_claims where id = '20000000-0000-0000-0000-000000000001'),
  1::bigint,
  'owner can read their own purchase claim'
);

select tests.auth_as('00000000-0000-0000-0000-000000000002');
select is(
  (select count(*) from purchase_claims where id = '20000000-0000-0000-0000-000000000001'),
  0::bigint,
  'a different member cannot read someone else''s purchase claim'
);

-- entitlements: same privacy expectation.
select tests.auth_as('00000000-0000-0000-0000-000000000002');
select is(
  (select count(*) from entitlements where id = '30000000-0000-0000-0000-000000000001'),
  0::bigint,
  'a different member cannot read someone else''s entitlement'
);

select tests.auth_as('00000000-0000-0000-0000-000000000001');
select is(
  (select count(*) from entitlements where id = '30000000-0000-0000-0000-000000000001'),
  1::bigint,
  'owner can read their own entitlement'
);

-- projects: visibility rules.
select tests.auth_as('00000000-0000-0000-0000-000000000002');
select is(
  (select count(*) from projects where id = '40000000-0000-0000-0000-000000000001'),
  1::bigint,
  'a public project is visible to other members'
);
select is(
  (select count(*) from projects where id = '40000000-0000-0000-0000-000000000002'),
  0::bigint,
  'a private project is not visible to other members'
);

-- bookmarks: strictly owner-only, never publicly visible (no public counts).
select is(
  (select count(*) from bookmarks where project_id = '40000000-0000-0000-0000-000000000001'),
  0::bigint,
  'bookmarks are invisible to members other than the bookmarker'
);

select tests.auth_as('00000000-0000-0000-0000-000000000001');
select is(
  (select count(*) from bookmarks where project_id = '40000000-0000-0000-0000-000000000001'),
  1::bigint,
  'the bookmarker can see their own bookmark'
);

-- remix permission enforcement: a remix insert must be rejected when the
-- original project's permission does not allow remixing (showcase_only).
select tests.auth_as('00000000-0000-0000-0000-000000000002');
select throws_ok(
  $$ insert into projects (id, user_id, title) values
     ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Bob remix (DEMO)') $$,
  null,
  null,
  'sanity: bob can create his own project before the remix-permission test'
);
select throws_ok(
  $$ insert into remixes (original_project_id, remix_project_id) values
     ('40000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003') $$,
  null,
  null,
  'a remix is rejected when the original project is marked showcase_only'
);

select * from finish();
rollback;
