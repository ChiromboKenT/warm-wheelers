-- rls_auto_enable() is an event-trigger helper that auto-enables RLS on new
-- public tables. Event triggers fire regardless of EXECUTE grants, so revoking
-- RPC access does not affect its behaviour; it only closes the advisor warning
-- about anon/authenticated being able to call it via /rest/v1/rpc.
-- Guarded so it is a no-op if the function does not exist.
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where p.proname = 'rls_auto_enable' and n.nspname = 'public'
  ) then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;
