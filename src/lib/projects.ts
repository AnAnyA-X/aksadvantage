import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Difficulty = Database["public"]["Enums"]["difficulty_level"];
export const DIFFICULTIES: Difficulty[] = ["Noob", "Intermediate", "Job-Level"];

export const GITHUB_URL_RE = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;

export type FeedProject = {
  id: string;
  title: string;
  tech_stack: string[];
  difficulty_level: Difficulty;
  github_url: string;
  user_id: string;
  handle: string | null;
  media_url: string | null;
};

/** Public feed read (RLS: projects/videos/users are publicly readable). */
export async function fetchFeedProjects(difficulty?: Difficulty | null): Promise<FeedProject[]> {
  let q = supabase
    .from("projects")
    .select("id,title,tech_stack,difficulty_level,github_url,user_id,videos(media_url)")
    .order("created_at", { ascending: false })
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
  }));
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
