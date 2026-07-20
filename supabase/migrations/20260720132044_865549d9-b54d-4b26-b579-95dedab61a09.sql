-- Postgres grants EXECUTE on functions to PUBLIC by default.
-- Explicitly revoke it for anon (public) and authenticated so the security-definer
-- has_role helper can only be used inside RLS policies / service_role code.
revoke execute on function public.has_role(uuid, public.app_role) from public;
revoke execute on function public.has_role(uuid, public.app_role) from authenticated;
revoke execute on function public.has_role(uuid, public.app_role) from anon;
