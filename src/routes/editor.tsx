import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { Filter, Clock, DollarSign, Star, ArrowUpRight, Search } from "lucide-react";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Content Editor Hub — AdVantage" },
      { name: "description", content: "Browse open project briefs and turn them into short videos." },
      { property: "og:title", content: "Content Editor Hub — AdVantage" },
      { property: "og:description", content: "A marketplace of student tech projects waiting for editors." },
    ],
  }),
  component: Editor,
});

const briefs = [
  {
    project: "y-canvas",
    by: "@mia.builds",
    goal: "60s explainer on CRDTs",
    length: "60s",
    payout: "$120",
    deadline: "5d",
    difficulty: "Med",
    tags: ["#collab", "#yjs"],
    accent: "var(--lime)",
    open: 3,
  },
  {
    project: "offline-todo",
    by: "@devon.codes",
    goal: "Demo of local-first magic",
    length: "45s",
    payout: "$90",
    deadline: "3d",
    difficulty: "Low",
    tags: ["#pwa", "#sqlite"],
    accent: "var(--cyan)",
    open: 1,
  },
  {
    project: "mini-gpt",
    by: "@sana.ml",
    goal: "Training loop visualization",
    length: "90s",
    payout: "$220",
    deadline: "7d",
    difficulty: "High",
    tags: ["#ml", "#viz"],
    accent: "var(--magenta)",
    open: 5,
  },
  {
    project: "keyboard-cli",
    by: "@ren.hax",
    goal: "Terminal tour + install flow",
    length: "30s",
    payout: "$60",
    deadline: "2d",
    difficulty: "Low",
    tags: ["#cli", "#dx"],
    accent: "var(--lime)",
    open: 2,
  },
];

const filters = ["All", "Under 60s", "$100+", "This week", "ML", "Web"] as const;

function Editor() {
  return (
    <div className="min-h-screen pb-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[color:var(--magenta)]/12 to-transparent" />

      <header className="relative z-10 px-5 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Editor Hub
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              Open briefs
            </h1>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-surface/60 backdrop-blur">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-4 py-2.5 backdrop-blur">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, stacks, creators…"
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
          {filters.map((f, i) => (
            <button
              key={f}
              className={
                "shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors " +
                (i === 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-surface/60 text-muted-foreground hover:text-foreground")
              }
            >
              {f}
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
            <div className="flex items-center gap-2">
              <Star className="h-3.5 w-3.5 text-[color:var(--lime)]" fill="currentColor" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--lime)]">
                High reach · trending stack
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-balance">
              Turn <span className="text-[color:var(--cyan)]">mini-gpt</span> into a 90-second visual explainer
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              @sana.ml wants an editor to visualize the training loop. Est. 4-6 hours of work.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />220</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />7d</span>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                Claim brief <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="relative z-10 px-5 pt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">All briefs</h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {briefs.length} open
          </span>
        </div>

        <div className="space-y-3">
          {briefs.map((b) => (
            <article
              key={b.project}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 p-4 backdrop-blur transition-colors hover:bg-surface"
            >
              <div className="flex items-start gap-3">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-mono text-sm font-semibold"
                  style={{
                    background: `color-mix(in oklab, ${b.accent} 22%, transparent)`,
                    color: b.accent,
                  }}
                >
                  {b.project[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-base font-semibold tracking-tight">
                        {b.project}
                      </h3>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        by {b.by} · {b.open} open slots
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-border/60 bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {b.difficulty}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/90">{b.goal}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {b.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{b.deadline}</span>
                  <span className="inline-flex items-center gap-1 text-foreground"><DollarSign className="h-3.5 w-3.5" />{b.payout.replace("$", "")}</span>
                  <span className="font-mono text-[10px]">{b.length}</span>
                </div>
                <button className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold hover:bg-background">
                  Pitch <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
