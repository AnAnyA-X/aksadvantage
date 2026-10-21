import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Difficulty = Database["public"]["Enums"]["difficulty_level"];
export const DIFFICULTIES: Difficulty[] = ["Noob", "Intermediate", "Job-Level"];

export const GITHUB_URL_RE = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;

/** Badge classes per difficulty, shared by the feed and the project page. */
export const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Noob: "bg-[color:var(--lime)]/20 text-[color:var(--lime)] border-[color:var(--lime)]/40",
  Intermediate: "bg-[color:var(--cyan)]/20 text-[color:var(--cyan)] border-[color:var(--cyan)]/40",
  "Job-Level":
    "bg-[color:var(--magenta)]/20 text-[color:var(--magenta)] border-[color:var(--magenta)]/40",
};

export type FeedProject = {
  id: string;
  title: string;
  tech_stack: string[];
  difficulty_level: Difficulty;
  github_url: string;
  user_id: string;
  handle: string | null;
  media_url: string | null;
  video_count: number;
};

/** Public feed read (RLS: projects/videos/users are publicly readable). */
export async function fetchFeedProjects(difficulty?: Difficulty | null): Promise<FeedProject[]> {
  let q = supabase
    .from("projects")
    .select("id,title,tech_stack,difficulty_level,github_url,user_id,videos(media_url)")
    .order("created_at", { ascending: false })
    // Oldest video first, so the feed's background video is stable between loads.
    .order("created_at", { referencedTable: "videos", ascending: true })
    .limit(50);
  if (difficulty) q = q.eq("difficulty_level", difficulty);
  const { data, error } = await q;
  if (error) throw error;
  const ids = [...new Set((data ?? []).map((p) => p.user_id))];
  const { data: users } = ids.length
    ? await supabase.from("users").select("id,github_handle").in("id", ids)
    : { data: [] };
  const handles = new Map((users ?? []).map((u) => [u.id, u.github_handle]));
  return (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    tech_stack: p.tech_stack,
    difficulty_level: p.difficulty_level,
    github_url: p.github_url,
    user_id: p.user_id,
    handle: handles.get(p.user_id) ?? null,
    media_url: (p.videos as { media_url: string }[] | null)?.[0]?.media_url ?? null,
    video_count: (p.videos as unknown[] | null)?.length ?? 0,
  }));
}

export type ProjectVideo = { id: string; media_url: string; created_at: string };

export type ProjectDetails = Omit<FeedProject, "media_url" | "video_count"> & {
  videos: ProjectVideo[];
};

/** One project with its creator's handle and all of its videos, oldest first. Null if not found. */
export async function fetchProject(projectId: string): Promise<ProjectDetails | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id,title,tech_stack,difficulty_level,github_url,user_id,videos(id,media_url,created_at)",
    )
    .eq("id", projectId)
    .order("created_at", { referencedTable: "videos", ascending: true })
    .order("id", { referencedTable: "videos", ascending: true })
    .maybeSingle();
  if (error) {
    // A malformed id in the URL (not a UUID) can't match any project.
    if (error.code === "22P02") return null;
    throw error;
  }
  if (!data) return null;

  const { data: owner, error: ownerError } = await supabase
    .from("users")
    .select("github_handle")
    .eq("id", data.user_id)
    .maybeSingle();
  if (ownerError) throw ownerError;

  return {
    id: data.id,
    title: data.title,
    tech_stack: data.tech_stack,
    difficulty_level: data.difficulty_level,
    github_url: data.github_url,
    user_id: data.user_id,
    handle: owner?.github_handle ?? null,
    videos: (data.videos as ProjectVideo[] | null) ?? [],
  };
}

export async function fetchMyProjects(userId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,tech_stack,difficulty_level,github_url,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

const MAX_TAGS = 12;
const MAX_TAG_LENGTH = 30;

/** Trim, cap length, drop empties and case-insensitive duplicates (first spelling wins). */
export function normalizeTechStack(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const tag = raw.trim().slice(0, MAX_TAG_LENGTH).trim();
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length === MAX_TAGS) break;
  }
  return out;
}

/** Map Supabase/Postgres errors to messages a creator can act on; log the raw one. */
function friendlyError(error: { code?: string; message?: string }, fallback: string): Error {
  console.error(error);
  const msg = error.message ?? "";
  if (msg.includes("projects_github_url_format"))
    return new Error("Use a GitHub repo URL like https://github.com/owner/repo");
  if (msg.includes("projects_title_length"))
    return new Error("Title must be between 2 and 120 characters.");
  if (error.code === "22P02") return new Error("Pick a valid difficulty level.");
  if (error.code === "42501")
    return new Error("You don't have permission to do that. Try signing in again.");
  return new Error(fallback);
}

export async function createProject(input: {
  userId: string;
  title: string;
  techStack: string[];
  difficulty: Difficulty;
  githubUrl: string;
}) {
  const title = input.title.trim();
  const url = input.githubUrl.trim();
  if (title.length < 2) throw new Error("Title must be at least 2 characters.");
  if (!GITHUB_URL_RE.test(url))
    throw new Error("Use a GitHub repo URL like https://github.com/owner/repo");
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: input.userId,
      title,
      tech_stack: normalizeTechStack(input.techStack),
      difficulty_level: input.difficulty,
      github_url: url,
    })
    .select("id")
    .single();
  if (error) throw friendlyError(error, "Couldn't publish the project. Please try again.");
  return data;
}


export async function updateProject(input: {
  projectId: string;
  userId: string;
  title: string;
  techStack: string[];
  difficulty: Difficulty;
  githubUrl: string;
}) {
  const title = input.title.trim();
  const url = input.githubUrl.trim();

  if (title.length < 2) {
    throw new Error("Title must be at least 2 characters.");
  }

  if (!GITHUB_URL_RE.test(url)) {
    throw new Error("Use a valid GitHub repository URL.");
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      title,
      tech_stack: normalizeTechStack(input.techStack),
      difficulty_level: input.difficulty,
      github_url: url,
    })
    .eq("id", input.projectId)
    .eq("user_id", input.userId)
    .select("id")
    .maybeSingle();

  if (error) throw friendlyError(error, "Couldn't update the project. Please try again.");
  // RLS filters out rows the user doesn't own, so an update can silently match nothing.
  if (!data) throw new Error("You can only edit your own projects.");

  return data;
}

export async function deleteProject(projectId: string, userId: string) {
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", userId)
    .select("id");

  if (error) throw friendlyError(error, "Couldn't delete the project. Please try again.");
  if (!data?.length) throw new Error("You can only delete your own projects.");
}

/** Public Storage bucket for project videos (set up manually: 50 MB, MP4/WebM/MOV, owner-only uploads). */
const VIDEO_BUCKET = "project-videos";
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
export const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov";
const VIDEO_EXTENSIONS: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

/** Browsers sometimes leave `type` empty (often for .mov); fall back to the file extension. */
function videoContentType(file: File): string | null {
  if (VIDEO_EXTENSIONS[file.type]) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  const match = Object.entries(VIDEO_EXTENSIONS).find(([, e]) => e === ext);
  return !file.type && match ? match[0] : null;
}

/** Returns a message explaining why the file can't be uploaded, or null if it's fine. */
export function validateVideoFile(file: File): string | null {
  if (!videoContentType(file)) return "Choose an MP4, WebM or MOV video.";
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_VIDEO_BYTES) return "Videos must be 50 MB or smaller.";
  return null;
}

/**
 * Upload a video file to `project-videos/<projectId>/<random>.<ext>` and record it in `videos`.
 * Storage policies and the videos RLS both only allow the project's owner.
 */
export async function uploadProjectVideo(projectId: string, file: File): Promise<ProjectVideo> {
  const problem = validateVideoFile(file);
  if (problem) throw new Error(problem);
  const contentType = videoContentType(file)!;
  const path = `${projectId}/${crypto.randomUUID()}.${VIDEO_EXTENSIONS[contentType]}`;
  const bucket = supabase.storage.from(VIDEO_BUCKET);

  const { error: uploadError } = await bucket.upload(path, file, { contentType, upsert: false });
  if (uploadError) {
    console.error(uploadError);
    const msg = uploadError.message.toLowerCase();
    if (msg.includes("row-level security") || msg.includes("unauthorized"))
      throw new Error("You can only upload videos to your own projects.");
    if (msg.includes("exceeded") || msg.includes("too large"))
      throw new Error("Videos must be 50 MB or smaller.");
    if (msg.includes("mime")) throw new Error("Choose an MP4, WebM or MOV video.");
    throw new Error("Couldn't upload the video. Please try again.");
  }

  const { data: urlData } = bucket.getPublicUrl(path);
  const { data, error } = await supabase
    .from("videos")
    .insert({ project_id: projectId, media_url: urlData.publicUrl })
    .select("id,media_url,created_at")
    .single();
  if (error) {
    // Don't leave an orphaned file in Storage when the row couldn't be saved.
    const { error: cleanupError } = await bucket.remove([path]);
    if (cleanupError) console.error("Couldn't remove orphaned upload", path, cleanupError);
    if (error.code === "42501") {
      console.error(error);
      throw new Error("You can only upload videos to your own projects.");
    }
    throw friendlyError(error, "Couldn't save the video. Please try again.");
  }
  return data;
}
