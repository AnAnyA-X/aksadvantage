-- The broad "authenticated users can report videos" update policy allowed any column
-- on any video to be modified. Replace it with a dedicated SECURITY DEFINER function
-- that only increments report_count.

drop policy if exists "Authenticated users can report videos" on public.videos;

create or replace function public.report_video(video_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.videos
  set report_count = report_count + 1
  where id = video_id;
$$;

-- Restrict direct execution: only authenticated users can report a video;
-- never anonymous or the default public role.
revoke all on function public.report_video(uuid) from public;
revoke all on function public.report_video(uuid) from anon;
grant execute on function public.report_video(uuid) to authenticated;
grant execute on function public.report_video(uuid) to service_role;
