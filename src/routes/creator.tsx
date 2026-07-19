import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Eye, Heart, GitBranch, TrendingUp, Plus, MoreHorizontal, Play, Github, Lock, Check, ChevronDown, ShieldCheck, Star, X } from "lucide-react";

export const Route = createFileRoute("/creator")({
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

const projects = [
  { title: "y-canvas", status: "Live", views: "12.4k", likes: "980", stack: ["Y.js", "React", "Vite"], hue: "var(--lime)" },
  { title: "offline-todo", status: "Live", views: "8.9k", likes: "610", stack: ["SQLite", "PWA"], hue: "var(--cyan)" },
  { title: "mini-gpt", status: "Draft", views: "—", likes: "—", stack: ["PyTorch"], hue: "var(--magenta)" },
];

const mockRepos = [
  { name: "y-canvas", desc: "Realtime collaborative canvas", stars: 214, lang: "TypeScript", visibility: "Public" },
  { name: "offline-todo", desc: "Local-first PWA todo app", stars: 88, lang: "TypeScript", visibility: "Public" },
  { name: "mini-gpt", desc: "Tiny transformer from scratch", stars: 41, lang: "Python", visibility: "Public" },
  { name: "rusty-shell", desc: "POSIX-ish shell in Rust", stars: 17, lang: "Rust", visibility: "Private" },
  { name: "leetcode-notes", desc: "Personal problem log", stars: 3, lang: "Markdown", visibility: "Private" },
];

const difficulties = ["Noob", "Intermediate", "Job-Level"] as const;

function Creator() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);
    }, 1100);
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
                  <p className="font-display text-sm font-semibold">Connected as @mia-dev</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    OAuth scope: repo:read · verified
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 font-mono text-[10px] font-medium text-primary">
                <Check className="h-3 w-3" /> Verified
              </span>
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
          {projects.map((p) => (
            <div
              key={p.title}
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

      {submitOpen && (
        <SubmitModal connected={connected} onClose={() => setSubmitOpen(false)} onConnect={handleConnect} connecting={connecting} />
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
  connected,
  onClose,
  onConnect,
  connecting,
}: {
  connected: boolean;
  onClose: () => void;
  onConnect: () => void;
  connecting: boolean;
}) {
  const [repoOpen, setRepoOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof mockRepos)[number] | null>(null);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("Intermediate");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = connected && selected && title.trim().length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl border border-border/60 bg-surface p-5 pb-8 sm:rounded-3xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              New submission
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
              Publish a project
            </h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-5 w-5" />
            </div>
            <p className="mt-3 font-display text-base font-semibold">Submitted for review</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {selected?.name} · verified via GitHub OAuth
            </p>
            <button
              onClick={onClose}
              className="mt-4 inline-flex rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Repo picker */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Repository
              </label>
              <div className="mt-1.5">
                {!connected ? (
                  <button
                    onClick={onConnect}
                    disabled={connecting}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-border bg-background/40 px-4 py-3 text-left text-sm disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      {connecting ? "Connecting…" : "Connect GitHub to load repos"}
                    </span>
                    <Github className="h-4 w-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setRepoOpen((v) => !v)}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background/60 px-4 py-3 text-left text-sm"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        {selected ? (
                          <span className="font-mono">mia-dev/{selected.name}</span>
                        ) : (
                          <span className="text-muted-foreground">Select a repository…</span>
                        )}
                      </span>
                      <ChevronDown className={"h-4 w-4 transition " + (repoOpen ? "rotate-180" : "")} />
                    </button>
                    {repoOpen && (
                      <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-border/60 bg-background/80 p-1">
                        {mockRepos.map((r) => {
                          const active = selected?.name === r.name;
                          return (
                            <button
                              key={r.name}
                              onClick={() => {
                                setSelected(r);
                                setRepoOpen(false);
                              }}
                              className={
                                "flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition " +
                                (active ? "bg-primary/15" : "hover:bg-muted")
                              }
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm">{r.name}</span>
                                  <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                                    {r.visibility}
                                  </span>
                                </div>
                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                  {r.desc}
                                </p>
                                <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                                  <span className="inline-flex items-center gap-1">
                                    <Star className="h-3 w-3" /> {r.stars}
                                  </span>
                                  <span className="font-mono">{r.lang}</span>
                                </div>
                              </div>
                              {active && <Check className="mt-1 h-4 w-4 text-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <p className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      <ShieldCheck className="h-3 w-3 text-[color:var(--lime)]" />
                      Only your OAuth-verified repos are listed. Manual URLs are disabled.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Project title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                placeholder="e.g. Realtime collab canvas"
                className="mt-1.5 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Difficulty
              </label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {difficulties.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={
                      "rounded-xl border px-2 py-2 text-xs font-semibold transition " +
                      (difficulty === d
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-background/40 text-muted-foreground")
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!canSubmit}
              onClick={() => setSubmitted(true)}
              className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              Submit project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

