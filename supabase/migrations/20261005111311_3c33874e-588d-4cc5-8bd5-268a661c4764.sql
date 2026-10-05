create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare base text; handle text;
begin
  base := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'preferred_username', split_part(new.email,'@',1), 'user'), '[^a-zA-Z0-9_-]', '', 'g'));
  if base = '' then base := 'user'; end if;
  handle := base;
  if exists (select 1 from public.users where github_handle = handle) then
    handle := base || '-' || substr(replace(new.id::text,'-',''),1,6);
  end if;
  insert into public.users (id, github_handle) values (new.id, handle) on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'creator') on conflict (user_id, role) do nothing;
  return new;
end; $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill existing users with creator role
insert into public.user_roles (user_id, role)
select u.id, 'creator' from public.users u
on conflict (user_id, role) do nothing;

-- One-time admin bootstrap: first caller becomes admin only if no admin exists
create or replace function public.claim_initial_admin()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return false; end if;
  perform pg_advisory_xact_lock(424242);
  if exists (select 1 from public.user_roles where role = 'admin') then return false; end if;
  insert into public.user_roles (user_id, role) values (auth.uid(), 'admin');
  return true;
end; $$;
revoke execute on function public.claim_initial_admin() from public, anon;
grant execute on function public.claim_initial_admin() to authenticated;