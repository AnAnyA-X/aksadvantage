-- Brief workflow: a creator publishes a brief for one of their projects, editors
-- claim it, the creator accepts one editor, and the accepted editor uploads the
-- project's video. Reversible: dropping these objects restores the prior state.

create type public.brief_status as enum ('open', 'claimed', 'delivered');
create type public.claim_status as enum ('pending', 'accepted', 'declined', 'delivered');

create table public.briefs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  creator_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  instructions text not null,
  status public.brief_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint briefs_title_length check (char_length(btrim(title)) between 2 and 120),
  constraint briefs_instructions_length check (char_length(btrim(instructions)) between 10 and 2000)
);

create table public.brief_claims (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.briefs (id) on delete cascade,
  editor_id uuid not null references public.users (id) on delete cascade,
  note text,
  status public.claim_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint brief_claims_note_length check (note is null or char_length(note) <= 1000)
);

-- Prevent duplicate claims: one claim per editor per brief.
create unique index brief_claims_brief_editor_key on public.brief_claims (brief_id, editor_id);
-- At most one assigned editor per brief (accepted or already delivered).
create unique index brief_claims_single_assignment on public.brief_claims (brief_id) where status in ('accepted', 'delivered');

create index briefs_project_id_idx on public.briefs (project_id);
create index briefs_creator_id_idx on public.briefs (creator_id);
create index brief_claims_brief_id_idx on public.brief_claims (brief_id);
create index brief_claims_editor_id_idx on public.brief_claims (editor_id);

grant select on public.briefs to anon, authenticated;
grant insert, update, delete on public.briefs to authenticated;
grant all on public.briefs to service_role;
grant select, insert, update, delete on public.brief_claims to authenticated;
grant all on public.brief_claims to service_role;

alter table public.briefs enable row level security;
alter table public.brief_claims enable row level security;

create policy "Briefs are publicly readable"
on public.briefs for select to anon, authenticated using (true);

create policy "Creators can publish briefs for their own projects"
on public.briefs for insert to authenticated
with check (
  creator_id = auth.uid()
  and exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid())
);

create policy "Creators can manage their own briefs"
on public.briefs for update to authenticated
using (creator_id = auth.uid())
with check (creator_id = auth.uid());

create policy "Creators can delete their own briefs"
on public.briefs for delete to authenticated
using (creator_id = auth.uid());

create policy "Editors can view claims on briefs"
on public.brief_claims for select to authenticated using (true);

create policy "Editors can claim open briefs"
on public.brief_claims for insert to authenticated
with check (
  editor_id = auth.uid()
  and exists (select 1 from public.briefs b where b.id = brief_id and b.status = 'open')
);

-- An editor may only see and act on their own accepted claim (mark it
-- delivered); the brief's creator manages any claim on their brief.
create policy "Brief creators and assigned editors can manage claims"
on public.brief_claims for update to authenticated
using (
  (editor_id = auth.uid() and status = 'accepted')
  or exists (select 1 from public.briefs b where b.id = brief_id and b.creator_id = auth.uid())
)
with check (
  (editor_id = auth.uid() and status = 'delivered')
  or exists (select 1 from public.briefs b where b.id = brief_id and b.creator_id = auth.uid())
);

create policy "Editors can withdraw their own pending claims"
on public.brief_claims for delete to authenticated
using (editor_id = auth.uid() and status = 'pending');

-- Keep briefs.status in sync with claims. Security definer so an editor can
-- mark delivery without needing update rights on the brief itself.
create or replace function public.sync_brief_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'accepted' then
    update public.briefs set status = 'claimed' where id = new.brief_id;
  elsif new.status = 'delivered' then
    update public.briefs set status = 'delivered' where id = new.brief_id;
  elsif new.status = 'declined' then
    if not exists (
      select 1 from public.brief_claims c
      where c.brief_id = new.brief_id and c.status in ('accepted', 'delivered')
    ) then
      update public.briefs set status = 'open' where id = new.brief_id and status = 'claimed';
    end if;
  end if;
  return new;
end;
$$;

create trigger sync_brief_status_trigger
after update of status on public.brief_claims
for each row execute function public.sync_brief_status();

-- When the assigned editor uploads a video, the claim is delivered automatically.
create or replace function public.mark_claim_delivered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then return new; end if;
  update public.brief_claims
  set status = 'delivered'
  where editor_id = auth.uid()
    and status = 'accepted'
    and brief_id in (select id from public.briefs where project_id = new.project_id);
  return new;
end;
$$;

create trigger mark_claim_delivered_trigger
after insert on public.videos
for each row execute function public.mark_claim_delivered();

-- Assigned editors can add videos to the brief's project (alongside the
-- existing owner policy; permissive policies combine with OR).
create policy "Assigned editors can add videos to brief projects"
on public.videos for insert to authenticated
with check (
  exists (
    select 1
    from public.briefs b
    join public.brief_claims c on c.brief_id = b.id
    where b.project_id = videos.project_id
      and c.editor_id = auth.uid()
      and c.status = 'accepted'
  )
);

-- Storage: the assigned editor may upload/replace files under the brief
-- project's folder, same shape as the existing owner policies.
create policy "Assigned editors can upload brief video files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'project-videos'
  and array_length(storage.foldername(name), 1) = 1
  and exists (
    select 1
    from public.briefs b
    join public.brief_claims c on c.brief_id = b.id
    where (storage.foldername(name))[1] = b.project_id::text
      and c.editor_id = auth.uid()
      and c.status = 'accepted'
  )
);

create policy "Assigned editors can view brief video files"
on storage.objects for select to authenticated
using (
  bucket_id = 'project-videos'
  and exists (
    select 1
    from public.briefs b
    join public.brief_claims c on c.brief_id = b.id
    where (storage.foldername(name))[1] = b.project_id::text
      and c.editor_id = auth.uid()
      and c.status in ('accepted', 'delivered')
  )
);

create policy "Assigned editors can delete brief video files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'project-videos'
  and exists (
    select 1
    from public.briefs b
    join public.brief_claims c on c.brief_id = b.id
    where (storage.foldername(name))[1] = b.project_id::text
      and c.editor_id = auth.uid()
      and c.status in ('accepted', 'delivered')
  )
);

create trigger update_briefs_updated_at before update on public.briefs
for each row execute function public.update_updated_at_column();
create trigger update_brief_claims_updated_at before update on public.brief_claims
for each row execute function public.update_updated_at_column();
