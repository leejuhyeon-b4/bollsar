-- 홍캘 Supabase 보안 설정. Supabase SQL Editor에서 postgres 권한으로 실행한다.

create table if not exists public.records (
  user_id uuid not null references auth.users(id) on delete cascade,
  perf_key text not null,
  seat text,
  updated_at timestamptz not null default now(),
  primary key (user_id, perf_key)
);

alter table public.records enable row level security;

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
