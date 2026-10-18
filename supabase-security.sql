-- 볼살씨 Supabase 보안 설정. Supabase SQL Editor에서 postgres 권한으로 실행한다.

create table if not exists public.records (
  user_id uuid not null references auth.users(id) on delete cascade,
  production_id text not null,
  perf_key text not null,
  seat text,
  updated_at timestamptz not null default now(),
  primary key (
    user_id,
    production_id,
    perf_key
  )
);

alter table public.records
  add column if not exists
  production_id text;

update public.records
set production_id =
  'elisabeth-2026-6th'
where production_id is null
   or production_id = '';

alter table public.records
  alter column production_id
  set not null;

alter table public.records
  drop constraint if exists
  records_pkey;

alter table public.records
  add constraint records_pkey
  primary key (
    user_id,
    production_id,
    perf_key
  );

alter table public.records
  enable row level security;

drop policy if exists "records private to owner" on public.records;
create policy "records private to owner"
  on public.records
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 로그인한 사용자는 자기 auth 사용자 행만 삭제할 수 있다. SECURITY DEFINER 함수는
-- search_path를 비우고 대상을 완전 수식하며, authenticated 외 실행 권한을 제거한다.
create or replace function public.delete_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke all on function public.delete_account() from public;
revoke all on function public.delete_account() from anon;
grant execute on function public.delete_account() to authenticated;


-- KINKY PUBLIC BELL COUNTER V1
-- Public aggregate only. No user identity is stored here.

create table if not exists public.kinky_bell_counter (
  id text primary key,
  count bigint not null default 0 check (count >= 0),
  constraint kinky_bell_counter_known_id
    check (id = 'kinky-boots-2025-2026-7th-lola')
);

insert into public.kinky_bell_counter (id, count)
values ('kinky-boots-2025-2026-7th-lola', 0)
on conflict (id) do nothing;

alter table public.kinky_bell_counter
  enable row level security;

drop policy if exists
  "kinky bell count publicly readable"
  on public.kinky_bell_counter;

create policy
  "kinky bell count publicly readable"
  on public.kinky_bell_counter
  for select
  to anon, authenticated
  using (true);

revoke all
  on table public.kinky_bell_counter
  from public, anon, authenticated;

grant select
  on table public.kinky_bell_counter
  to anon, authenticated;

create or replace function public.ring_kinky_bell()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_count bigint;
begin
  update public.kinky_bell_counter
  set count = count + 1
  where id = 'kinky-boots-2025-2026-7th-lola'
  returning count into new_count;

  if new_count is null then
    raise exception 'kinky bell counter row missing';
  end if;

  return new_count;
end;
$$;

revoke all
  on function public.ring_kinky_bell()
  from public, anon, authenticated;

grant execute
  on function public.ring_kinky_bell()
  to anon, authenticated;
