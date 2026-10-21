import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Github, Play, ShieldCheck } from "lucide-react";
import { fetchProject, DIFFICULTY_STYLES, type ProjectVideo } from "@/lib/projects";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project — AdVantage" },
      { name: "description", content: "A student tech project and its learning videos." },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { projectId } = Route.useParams();
  const {
    data: project,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
  });

  return (
    <div className="min-h-screen bg-black pb-28 text-white">
      <header className="flex items-center px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-display text-sm text-white backdrop-blur"
        >
          <ArrowLeft className="h-4 w-4" />
          Learn
        </Link>
      </header>

      {isLoading ? (
        <StateMessage>Loading project…</StateMessage>
      ) : error ? (
        <StateMessage>
          <p>Couldn't load this project.</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur disabled:opacity-60"
          >
            {isFetching ? "Retrying…" : "Try again"}
          </button>
        </StateMessage>
      ) : !project ? (
        <StateMessage>
          <p>Project not found.</p>
          <Link
            to="/learn"
            className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur"
          >
            Back to Learn
          </Link>
        </StateMessage>
      ) : (
        <main className="px-5 pt-4">
          <p className="font-mono text-xs text-white/70">
            {project.handle ? `@${project.handle}` : "@creator"}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide backdrop-blur ${DIFFICULTY_STYLES[project.difficulty_level]}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {project.difficulty_level}
            </span>
          </div>

          <h1 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-balance">
            {project.title}
          </h1>

          {project.tech_stack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech_stack.map((t, i) => (
                <span
                  key={`${i}-${t}`}
                  className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--lime)] px-4 py-2.5 font-display text-sm font-semibold text-[color:var(--primary-foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_10px_30px_-10px_rgba(163,255,80,0.6)] transition-transform active:scale-[0.98]"
          >
            <Github className="h-4 w-4" />
            View Verified GitHub Code
            <ShieldCheck className="h-4 w-4 opacity-80" />
          </a>

          <section className="mt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-lg font-semibold tracking-tight">Videos</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                {project.videos.length} {project.videos.length === 1 ? "video" : "videos"}
              </span>
            </div>

            {project.videos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/5">
                  <Play className="h-5 w-5 translate-x-0.5 text-white/70" fill="currentColor" />
                </div>
                <p className="mt-3 font-display text-base font-semibold">No videos yet</p>
                <p className="mt-1 text-sm text-white/60">
                  Videos for this project will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {project.videos.map((v, i) => (
                  <VideoItem key={v.id} video={v} index={i} />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      <BottomNav />
    </div>
  );
}

function VideoItem({ video, index }: { video: ProjectVideo; index: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      {failed ? (
        <p className="grid aspect-video place-items-center px-6 text-center text-sm text-white/60">
          This video couldn't be loaded.
        </p>
      ) : (
        <video
          src={video.media_url}
          controls
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          className="max-h-[70vh] w-full bg-black"
        />
      )}
      <p className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/50">
        Video {index + 1} · {new Date(video.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}

function StateMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-8 text-center text-sm text-white/70">
      <div>{children}</div>
    </div>
  );
}
