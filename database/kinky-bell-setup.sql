-- Project: ymzxbfyupsnyaqqawoyc. Run once in Supabase SQL Editor.
-- Only the public Kinky bell aggregate and its increment RPC are configured.
begin;

create table if not exists public.kinky_bell_counter (
  id text primary key,
  count bigint not null default 0 check (count >= 0),
  constraint kinky_bell_counter_known_id
    check (id = 'kinky-boots-2025-2026-7th-lola')
);

insert into public.kinky_bell_counter (id, count)
values ('kinky-boots-2025-2026-7th-lola', 0)
on conflict (id) do nothing;

alter table public.kinky_bell_counter enable row level security;
drop policy if exists "kinky bell count publicly readable"
  on public.kinky_bell_counter;
create policy "kinky bell count publicly readable"
  on public.kinky_bell_counter for select
  to anon, authenticated using (true);

revoke all on table public.kinky_bell_counter from public, anon, authenticated;
grant select on table public.kinky_bell_counter to anon, authenticated;

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

revoke all on function public.ring_kinky_bell() from public, anon, authenticated;
grant execute on function public.ring_kinky_bell() to anon, authenticated;
notify pgrst, 'reload schema';
commit;
