import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { Eye, Heart, GitBranch, TrendingUp, Plus, MoreHorizontal, Play } from "lucide-react";

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

function Creator() {
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
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
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
