do $$ begin
  if not exists (select 1 from pg_constraint where conname='projects_github_url_format') then
    alter table public.projects add constraint projects_github_url_format
      check (github_url ~ '^https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+/?$') not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname='projects_title_length') then
    alter table public.projects add constraint projects_title_length
      check (char_length(title) between 2 and 120) not valid;
  end if;
end $$;
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_difficulty_idx on public.projects(difficulty_level);
create index if not exists videos_project_id_idx on public.videos(project_id);