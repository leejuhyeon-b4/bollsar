-- Optional administrator verification only. This does not apply a migration or read user records.
-- Project: ymzxbfyupsnyaqqawoyc. Run in Supabase SQL Editor as one read-only transaction.
begin read only;

select c.relname, c.relrowsecurity, c.relforcerowsecurity
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('records', 'kinky_bell_counter');

select tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('records', 'kinky_bell_counter');

select conrelid::regclass as table_name, conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid in ('public.records'::regclass, 'public.kinky_bell_counter'::regclass);

select p.proname, p.prosecdef, p.provolatile, p.proconfig,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute,
       pg_get_functiondef(p.oid) as definition
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('ring_kinky_bell', 'delete_account');

select r.role_name, t.table_name,
       has_table_privilege(r.role_name, t.table_name, 'SELECT') as can_select,
       has_table_privilege(r.role_name, t.table_name, 'INSERT') as can_insert,
       has_table_privilege(r.role_name, t.table_name, 'UPDATE') as can_update,
       has_table_privilege(r.role_name, t.table_name, 'DELETE') as can_delete
from (values ('anon'), ('authenticated')) r(role_name)
cross join (values ('public.records'), ('public.kinky_bell_counter')) t(table_name);

commit;
