import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { fetchMyProjects, createProject, DIFFICULTIES, GITHUB_URL_RE, type Difficulty } from "@/lib/projects";
import { BottomNav } from "@/components/BottomNav";
import { Eye, Heart, GitBranch, TrendingUp, Plus, MoreHorizontal, Play, Github, Lock, Check, ChevronDown, ShieldCheck, Star, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/creator")({
  head: () => ({
    meta: [
      { title: "Creator Dashboard — AdVantage" },
      { name: "description", content: "Student developers showcase projects, ship notes, and audience stats." },
      { property: "og:title", content: "Creator Dashboard — AdVantage" },
      { property: "og:description", content: "Publish your projects and grow an audience." },
    ],
  }),
  component: Creator,
});


function Creator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [handle, setHandle] = useState<string | null>(null);
  const connected = !!user;
  const connecting = false;
  const [submitOpen, setSubmitOpen] = useState(false);
  const myProjects = useQuery({
    queryKey: ["my-projects", user?.id],
    queryFn: () => fetchMyProjects(user!.id),
    enabled: !!user,
  });
  const hues = ["var(--lime)", "var(--cyan)", "var(--magenta)"];
  const projects = (myProjects.data ?? []).map((p, i) => ({
    id: p.id, title: p.title, status: "Live", views: "—", likes: "—", stack: p.tech_stack, hue: hues[i % 3],
  }));

  useEffect(() => {
    if (!user) return;
    supabase.from("users").select("github_handle").eq("id", user.id).maybeSingle()
      .then(({ data }) => setHandle(data?.github_handle ?? null));
  }, [user]);

  const handleConnect = () => navigate({ to: "/auth" });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (

    <div className="min-h-screen pb-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[color:var(--cyan)]/15 to-transparent" />

      <header className="relative z-10 flex items-center justify-between px-5 pt-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Creator Dashboard
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Hey, Mia
          </h1>
        </div>
        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[color:var(--lime)] to-[color:var(--cyan)] p-[2px]">
          <div className="grid h-full w-full place-items-center rounded-full bg-background font-mono text-sm font-semibold">
            M
          </div>
        </div>
      </header>

      {/* Secure login / GitHub connection */}
      <section className="relative z-10 px-5 pt-6">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface/70 p-5 backdrop-blur">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[color:var(--lime)]/10 blur-2xl" />
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Secure login
            </p>
          </div>

          {connected ? (
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold">Signed in as @{handle ?? "…"}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 font-mono text-[10px] font-medium text-primary"
              >
                <Check className="h-3 w-3" /> Sign out
              </button>
            </div>
          ) : (
            <>
              <h2 className="mt-2 font-display text-lg font-semibold tracking-tight">
                Sign in to submit projects
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We authenticate creators via GitHub OAuth. URLs cannot be pasted manually —
                only your own verified repositories can be submitted.
              </p>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition active:scale-[0.99] disabled:opacity-60"
              >
                <Github className="h-4 w-4" />
                {connecting ? "Redirecting to GitHub…" : "Connect with GitHub"}
              </button>
            </>
          )}
        </div>
      </section>



      {/* Stats */}
      <section className="relative z-10 px-5 pt-6">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Eye} label="Total views" value="24.7k" delta="+18%" />
          <StatCard icon={Heart} label="Reactions" value="3.4k" delta="+9%" />
          <StatCard icon={GitBranch} label="Forks" value="184" delta="+22%" />
          <StatCard icon={TrendingUp} label="Rank" value="#412" delta="↑ 31" />
        </div>
      </section>

      {/* Chart-ish sparkline */}
      <section className="relative z-10 px-5 pt-4">
        <div className="rounded-2xl border border-border/60 bg-surface/70 p-5 backdrop-blur">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Views · last 14 days
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight">18,204</p>
            </div>
            <span className="rounded-full bg-primary/15 px-2 py-1 font-mono text-[10px] font-medium text-primary">
              +12.4%
            </span>
          </div>
          <Sparkline />
        </div>
      </section>

      {/* Projects */}
      <section className="relative z-10 px-5 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">Your projects</h2>
          <button
            onClick={() => setSubmitOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>

        </div>

        <div className="space-y-3">
          {myProjects.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {myProjects.error && <p className="text-sm text-destructive">Couldn't load your projects.</p>}
          {myProjects.isSuccess && projects.length === 0 && (
            <p className="text-sm text-muted-foreground">No projects yet — tap New to publish one.</p>
          )}
          {projects.map((p) => (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 p-4 backdrop-blur"
            >
              <div className="flex items-center gap-4">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-xl"
                  style={{ background: `color-mix(in oklab, ${p.hue} 22%, transparent)` }}
                >
                  <Play className="h-5 w-5" fill="currentColor" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-base font-semibold tracking-tight">
                      {p.title}
                    </h3>
                    <span
                      className={
                        "rounded-full px-2 py-0.5 font-mono text-[10px] " +
                        (p.status === "Live"
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground")
                      }
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-1.5">
                    {p.stack.map((s, i) => (
                      <span key={s} className="font-mono text-[10px] text-muted-foreground">
                        {i > 0 ? <span className="mr-1.5 opacity-50">·</span> : null}
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views}</span>
                    <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {p.likes}</span>
                  </div>
                </div>
                <button className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brief CTA */}
      <section className="relative z-10 mt-8 px-5">
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-5 text-center">
          <p className="font-display text-base font-semibold">Want an editor to make a video?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Publish a brief. Editors in the Hub can pitch and produce it.
          </p>
          <button className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold">
            Open brief
          </button>
        </div>
      </section>

      <BottomNav />

      {submitOpen && user && (
        <SubmitModal userId={user.id} onClose={() => setSubmitOpen(false)} onCreated={() => {
          queryClient.invalidateQueries({ queryKey: ["my-projects"] });
          queryClient.invalidateQueries({ queryKey: ["feed-projects"] });
        }} />
      )}

    </div>
  );
}

function StatCard({ icon: Icon, label, value, delta }: { icon: typeof Eye; label: string; value: string; delta: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/60 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-[10px] text-[color:var(--lime)]">{delta}</span>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold tracking-tight">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Sparkline() {
  const pts = [8, 14, 10, 22, 18, 30, 24, 34, 28, 42, 38, 52, 48, 60];
  const w = 300, h = 70, max = 64;
  const step = w / (pts.length - 1);
  const path = pts.map((y, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (y / max) * h}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 h-20 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sp" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--lime)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--lime)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sp)" />
      <path d={path} fill="none" stroke="var(--lime)" strokeWidth="2" />
    </svg>
  );
}

function SubmitModal({
  userId,
  onClose,
  onCreated,
}: {
  userId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [githubUrl, setGithubUrl] = useState("");
  const [title, setTitle] = useState("");
  const [stack, setStack] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const urlOk = GITHUB_URL_RE.test(githubUrl.trim());
  const canSubmit = urlOk && title.trim().length > 1 && !saving;

  const submit = async () => {
    setSaving(true);
    setErr(null);
    try {
      await createProject({ userId, title, techStack: stack.split(","), difficulty, githubUrl });
      setSubmitted(true);
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl border border-border/60 bg-surface p-5 pb-8 sm:rounded-3xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">New submission</p>
            <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">Publish a project</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-5 w-5" />
            </div>
            <p className="mt-3 font-display text-base font-semibold">Project published</p>
            <p className="mt-1 text-sm text-muted-foreground">{title} is now in the Learn feed.</p>
            <button onClick={onClose} className="mt-4 inline-flex rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold">Done</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">GitHub repository</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-3 focus-within:border-primary">
                <Github className="h-4 w-4 shrink-0" />
                <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value.slice(0, 200))}
                  placeholder="https://github.com/owner/repo" className="w-full bg-transparent font-mono text-sm outline-none" />
              </div>
              <p className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-[color:var(--lime)]" />
                Only github.com/owner/repo links are accepted.
              </p>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Project title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 120))} placeholder="e.g. Realtime collab canvas"
                className="mt-1.5 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Tech stack (comma separated)</label>
              <input value={stack} onChange={(e) => setStack(e.target.value.slice(0, 200))} placeholder="React, TypeScript, Supabase"
                className="mt-1.5 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Difficulty</label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d) => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className={"rounded-xl border px-2 py-2 text-xs font-semibold transition " +
                      (difficulty === d ? "border-primary bg-primary/15 text-primary" : "border-border bg-background/40 text-muted-foreground")}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button disabled={!canSubmit} onClick={submit}
              className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40">
              {saving ? "Publishing…" : "Submit project"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
