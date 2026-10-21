import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchFeedProjects,
  uploadProjectVideo,
  validateVideoFile,
  DIFFICULTIES,
  VIDEO_ACCEPT,
  type Difficulty,
  type FeedProject,
} from "@/lib/projects";
import { Filter, Star, ArrowUpRight, Search, Upload, Film, Check, X, Lock } from "lucide-react";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Content Editor Hub — AdVantage" },
      {
        name: "description",
        content: "Browse student tech projects and upload short videos for your own.",
      },
      { property: "og:title", content: "Content Editor Hub — AdVantage" },
      {
        property: "og:description",
        content: "Student tech projects ready to be turned into short videos.",
      },
    ],
  }),
  component: Editor,
});

const accents = ["var(--lime)", "var(--cyan)", "var(--magenta)"];

/** Same matching as the Learner Hub: title, tech stack tags and creator handle. */
function matchesSearch(p: FeedProject, query: string) {
  return (
    !query ||
    p.title.toLowerCase().includes(query) ||
    (p.handle ?? "").toLowerCase().includes(query) ||
    p.tech_stack.some((t) => t.toLowerCase().includes(query))
  );
}

function videoCount(n: number) {
  return `${n} ${n === 1 ? "video" : "videos"}`;
}

function Editor() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Difficulty | null>(null);
  const [search, setSearch] = useState("");
  const [uploadFor, setUploadFor] = useState<FeedProject | null>(null);

  const projectsQuery = useQuery({
    queryKey: ["feed-projects", filter],
    queryFn: () => fetchFeedProjects(filter),
  });
  // Spotlight is the newest project overall, whatever difficulty is selected (shares the Learn cache).
  const newestQuery = useQuery({
    queryKey: ["feed-projects", null],
    queryFn: () => fetchFeedProjects(null),
  });
  const spotlight = newestQuery.data?.[0] ?? null;

  const query = search.trim().toLowerCase();
  const projects = projectsQuery.data ?? [];
  const matches = projects.filter((p) => matchesSearch(p, query));

  const isOwner = (p: FeedProject) => !!user && p.user_id === user.id;

  const uploadButton = (p: FeedProject, variant: "primary" | "outline") => {
    const base =
      variant === "primary"
        ? "inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40"
        : "inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold hover:bg-background disabled:opacity-50 disabled:hover:bg-background/40";
    const icon = variant === "primary" ? "h-3.5 w-3.5" : "h-3 w-3";
    if (!authLoading && !user)
      return (
        <button onClick={() => navigate({ to: "/auth" })} className={base}>
          Sign in to upload <ArrowUpRight className={icon} />
        </button>
      );
    if (user && !isOwner(p))
      return (
        <button disabled title="Only the project's owner can upload videos" className={base}>
          <Lock className={icon} /> Owner only
        </button>
      );
    return (
      <button disabled={authLoading} onClick={() => setUploadFor(p)} className={base}>
        <Upload className={icon} /> Upload video
      </button>
    );
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[color:var(--magenta)]/12 to-transparent" />

      <header className="relative z-10 px-5 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Editor Hub
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">Projects</h1>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-surface/60 backdrop-blur">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-4 py-2.5 backdrop-blur">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value.slice(0, 100))}
            placeholder="Search projects, stacks, creators…"
            aria-label="Search projects"
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div
          className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {([null, ...DIFFICULTIES] as (Difficulty | null)[]).map((d) => (
            <button
              key={d ?? "all"}
              onClick={() => setFilter(d)}
              className={
                "shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors " +
                (filter === d
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-surface/60 text-muted-foreground hover:text-foreground")
              }
            >
              {d ?? "All"}
            </button>
          ))}
        </div>
      </header>

      {/* Featured */}
      <section className="relative z-10 px-5 pt-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          // spotlight
        </p>
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-surface-elevated to-surface p-5">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[color:var(--magenta)]/25 blur-3xl" />
          <div className="relative">
            {newestQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading newest project…</p>
            ) : newestQuery.error ? (
              <p className="text-sm text-muted-foreground">Couldn't load the newest project.</p>
            ) : !spotlight ? (
              <p className="text-sm text-muted-foreground">
                No projects yet. New projects from creators will be featured here.
              </p>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-[color:var(--lime)]" fill="currentColor" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--lime)]">
                    Newest project
                  </span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-balance">
                  Turn <span className="text-[color:var(--cyan)]">{spotlight.title}</span> into a
                  short video
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {spotlight.handle ? `@${spotlight.handle}` : "@creator"} ·{" "}
                  {spotlight.difficulty_level} · {videoCount(spotlight.video_count)}
                  {isOwner(spotlight) && " · Your project"}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: spotlight.id }}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Film className="h-3.5 w-3.5" /> View project
                  </Link>
                  {uploadButton(spotlight, "primary")}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="relative z-10 px-5 pt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">All projects</h2>
          {projectsQuery.isSuccess && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {matches.length} {matches.length === 1 ? "project" : "projects"}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {projectsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading projects…</p>
          ) : projectsQuery.error ? (
            <div className="rounded-2xl border border-border/60 bg-surface/60 p-5 text-center">
              <p className="text-sm text-muted-foreground">Couldn't load projects.</p>
              <button
                onClick={() => projectsQuery.refetch()}
                disabled={projectsQuery.isFetching}
                className="mt-3 inline-flex rounded-full border border-border bg-background/40 px-4 py-2 text-xs font-semibold disabled:opacity-60"
              >
                {projectsQuery.isFetching ? "Retrying…" : "Try again"}
              </button>
            </div>
          ) : projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects for this level yet.</p>
          ) : matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects match "{search.trim()}"</p>
          ) : (
            matches.map((p, i) => {
              const accent = accents[i % accents.length];
              return (
                <article
                  key={p.id}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 p-4 backdrop-blur transition-colors hover:bg-surface"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-mono text-sm font-semibold"
                      style={{
                        background: `color-mix(in oklab, ${accent} 22%, transparent)`,
                        color: accent,
                      }}
                    >
                      {p.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate font-display text-base font-semibold tracking-tight">
                            {p.title}
                          </h3>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            by {p.handle ? `@${p.handle}` : "@creator"}
                            {isOwner(p) && (
                              <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-primary">
                                Your project
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-border/60 bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {p.difficulty_level}
                        </span>
                      </div>
                      {p.tech_stack.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.tech_stack.map((t, ti) => (
                            <span
                              key={`${ti}-${t}`}
                              className="font-mono text-[10px] text-muted-foreground"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Film className="h-3.5 w-3.5" /> {videoCount(p.video_count)}
                    </Link>
                    {uploadButton(p, "outline")}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <BottomNav />

      {uploadFor && (
        <UploadModal
          project={uploadFor}
          onClose={() => setUploadFor(null)}
          onUploaded={() => {
            queryClient.invalidateQueries({ queryKey: ["feed-projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", uploadFor.id] });
          }}
        />
      )}
    </div>
  );
}

function UploadModal({
  project,
  onClose,
  onUploaded,
}: {
  project: FeedProject;
  onClose: () => void;
  onUploaded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const pick = (f: File | undefined) => {
    setErr(null);
    setFile(null);
    if (!f) return;
    const problem = validateVideoFile(f);
    if (problem) setErr(problem);
    else setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      await uploadProjectVideo(project.id, file);
      setDone(true);
      onUploaded();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't upload the video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl border border-border/60 bg-surface p-5 pb-8 sm:rounded-3xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Upload video
            </p>
            <h3 className="mt-1 truncate font-display text-xl font-semibold tracking-tight">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-5 w-5" />
            </div>
            <p className="mt-3 font-display text-base font-semibold">Video uploaded</p>
            <p className="mt-1 text-sm text-muted-foreground">
              It's now on the project page and in the Learn feed.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Link
                to="/projects/$projectId"
                params={{ projectId: project.id }}
                className="inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                View project
              </Link>
              <button
                onClick={onClose}
                className="inline-flex rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="video-file"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                Video file
              </label>
              <input
                id="video-file"
                type="file"
                accept={VIDEO_ACCEPT}
                disabled={uploading}
                onChange={(e) => pick(e.target.files?.[0])}
                className="mt-1.5 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary"
              />
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                MP4, WebM or MOV · up to 50 MB
              </p>
              {file && (
                <p className="mt-1 truncate text-sm text-foreground/90">
                  {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              )}
            </div>

            {err && <p className="text-sm text-destructive">{err}</p>}

            <button
              disabled={!file || uploading}
              onClick={upload}
              className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              {uploading ? "Uploading…" : "Upload video"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
