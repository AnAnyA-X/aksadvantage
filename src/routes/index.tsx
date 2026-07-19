import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, LayoutDashboard, Scissors, ArrowRight, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/")({
  component: Landing,
});

const roles = [
  {
    to: "/learn",
    tag: "01 / VIEWER",
    title: "Learn",
    desc: "A vertical feed of 60-second builds. Swipe through APIs, side-projects, and dorm-room demos.",
    icon: Play,
    accent: "from-[color:var(--lime)]/25 to-transparent",
    ring: "ring-[color:var(--lime)]/40",
  },
  {
    to: "/creator",
    tag: "02 / BUILDER",
    title: "Creator Dashboard",
    desc: "Student devs publish repos, ship notes, and stats. Turn a README into an audience.",
    icon: LayoutDashboard,
    accent: "from-[color:var(--cyan)]/25 to-transparent",
    ring: "ring-[color:var(--cyan)]/40",
  },
  {
    to: "/editor",
    tag: "03 / EDITOR",
    title: "Content Editor Hub",
    desc: "Browse open project briefs, claim them, and turn raw code into scroll-stopping video.",
    icon: Scissors,
    accent: "from-[color:var(--magenta)]/25 to-transparent",
    ring: "ring-[color:var(--magenta)]/40",
  },
] as const;

function Landing() {
  return (
    <div className="relative min-h-screen pb-28">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[color:var(--lime)] opacity-20 blur-[120px]" />

      <header className="relative z-10 flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-mono text-sm font-bold">A</span>
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">AdVantage</span>
        </div>
        <span className="rounded-full border border-border/60 bg-surface/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          v0.1 beta
        </span>
      </header>

      <section className="relative z-10 px-5 pt-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/70 px-3 py-1 backdrop-blur">
          <Sparkles className="h-3 w-3 text-[color:var(--lime)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Project × Resource discovery
          </span>
        </div>

        <h1 className="mt-5 font-display text-[42px] font-semibold leading-[0.95] tracking-tight text-balance sm:text-6xl">
          Ship the build.<br />
          <span className="text-muted-foreground">Then</span>{" "}
          <span className="bg-gradient-to-br from-[color:var(--lime)] to-[color:var(--cyan)] bg-clip-text text-transparent">
            broadcast it.
          </span>
        </h1>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground text-balance">
          AdVantage connects student developers with editors who love their work.
          A feed for learners. A dashboard for builders. A hub for editors.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_var(--primary)] transition-transform active:scale-[0.97]"
          >
            Start watching <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/creator"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-surface"
          >
            I'm a builder
          </Link>
        </div>

        <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-border/50 pt-6">
          {[
            ["12.4k", "projects"],
            ["3.1k", "creators"],
            ["840", "editors"],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="font-display text-2xl font-semibold tracking-tight">{n}</dt>
              <dd className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="relative z-10 px-5 pt-16">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">Pick your lane</h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            03 surfaces
          </span>
        </div>

        <div className="space-y-3">
          {roles.map(({ to, tag, title, desc, icon: Icon, accent, ring }) => (
            <Link
              key={to}
              to={to}
              className={`group relative block overflow-hidden rounded-2xl border border-border/60 bg-surface/60 p-5 backdrop-blur transition-all hover:bg-surface active:scale-[0.99] ring-1 ${ring}`}
            >
              <div className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br ${accent} blur-2xl`} />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {tag}
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border/70 bg-background/40">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="relative mt-4 flex items-center gap-1.5 text-xs font-medium text-foreground/80 group-hover:text-foreground">
                Enter surface <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative z-10 mt-16 px-5">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-surface to-surface-elevated p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--lime)]">
            // how it works
          </p>
          <ol className="mt-4 space-y-4">
            {[
              ["Build", "Ship a project. Push it to your Creator Dashboard."],
              ["Brief", "Editors browse open briefs in the Editor Hub."],
              ["Broadcast", "Videos land in the Learn feed. Discovery loop closes."],
            ].map(([k, v], i) => (
              <li key={k} className="flex gap-4">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <div>
                  <p className="font-display text-base font-semibold">{k}</p>
                  <p className="text-sm text-muted-foreground">{v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="relative z-10 mt-12 px-5 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          © AdVantage — the discovery engine for student tech
        </p>
      </footer>

      <BottomNav />
    </div>
  );
}
