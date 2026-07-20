create type public.app_role as enum ('admin', 'moderator', 'creator');

create type public.difficulty_level as enum ('Noob', 'Intermediate', 'Job-Level');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  github_handle text not null unique,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

grant select, insert, update on public.users to authenticated;
grant select on public.users to anon;
grant all on public.users to service_role;

alter table public.users enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  tech_stack text[] not null default '{}',
  difficulty_level public.difficulty_level not null,
  github_url text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

grant select, insert, update, delete on public.projects to authenticated;
grant select on public.projects to anon;
grant all on public.projects to service_role;

alter table public.projects enable row level security;

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  media_url text not null,
  report_count integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

grant select, insert, update, delete on public.videos to authenticated;
grant select on public.videos to anon;
grant all on public.videos to service_role;

alter table public.videos enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create policy "Users can view all profiles"
  on public.users
  for select
  to anon, authenticated
  using (true);

create policy "Users can manage their own profile"
  on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can manage roles"
  on public.user_roles
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Projects are publicly readable"
  on public.projects
  for select
  to anon, authenticated
  using (true);

create policy "Creators can insert their own projects"
  on public.projects
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Creators can update their own projects"
  on public.projects
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Creators can delete their own projects"
  on public.projects
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Videos are publicly readable"
  on public.videos
  for select
  to anon, authenticated
  using (true);

create policy "Creators can add videos to their own projects"
  on public.videos
  for insert
  to authenticated
  with check (
    auth.uid() = (
      select user_id from public.projects where id = project_id
    )
  );

create policy "Creators can manage videos for their own projects"
  on public.videos
  for update
  to authenticated
  using (
    auth.uid() = (
      select user_id from public.projects where id = project_id
    )
  )
  with check (
    auth.uid() = (
      select user_id from public.projects where id = project_id
    )
  );

create policy "Creators can delete videos for their own projects"
  on public.videos
  for delete
  to authenticated
  using (
    auth.uid() = (
      select user_id from public.projects where id = project_id
    )
  );

create policy "Authenticated users can report videos"
  on public.videos
  for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at_column();

create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at_column();

create trigger update_videos_updated_at
  before update on public.videos
  for each row execute function public.update_updated_at_column();
