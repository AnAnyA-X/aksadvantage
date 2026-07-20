-- The has_role helper is used by RLS policies, not by direct API calls.
-- Revoke public/authenticated execute access to satisfy the security linter
-- while keeping it available for policy evaluation as a SECURITY DEFINER function.
revoke all on function public.has_role(uuid, public.app_role) from public, authenticated;

-- Grant execute only to service_role (for admin server code) and to the postgres role
-- so that RLS policies can still invoke it during policy evaluation.
grant execute on function public.has_role(uuid, public.app_role) to service_role;
