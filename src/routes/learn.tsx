import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Heart, Share2, Flag, Github, Music2, Play, Search, ShieldCheck, GraduationCap, BookOpen, Clock, Award } from "lucide-react";

import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — AdVantage" },
      { name: "description", content: "A vertical short-video feed of student tech projects." },
      { property: "og:title", content: "Learn — AdVantage" },
      { property: "og:description", content: "Swipe through 60-second builds from student developers." },
    ],
  }),
  component: Learn,
});

type Difficulty = "Noob" | "Intermediate" | "Job-Level";

const reels: {
  creator: string;
  project: string;
  caption: string;
  stack: string[];
  difficulty: Difficulty;
  repo: string;
  stats: { likes: string; shares: number };
  hue: string;
}[] = [
  {
    creator: "@mia.builds",
    project: "Realtime whiteboard with Y.js",
    caption: "Built a collaborative canvas in a weekend. CRDTs are wild.",
    stack: ["React", "Y.js", "WebRTC", "TypeScript"],
    difficulty: "Intermediate",
    repo: "mia-builds/yjs-whiteboard",
    stats: { likes: "12.4k", shares: 91 },
    hue: "from-[color:var(--lime)]/40 via-transparent to-[color:var(--cyan)]/30",
  },
  {
    creator: "@devon.codes",
    project: "Local-first todo, no backend",
    caption: "SQLite in the browser + service worker. Offline, forever.",
    stack: ["SQLite", "PWA", "Vite"],
    difficulty: "Noob",
    repo: "devon-codes/local-todo",
    stats: { likes: "8.9k", shares: 44 },
    hue: "from-[color:var(--magenta)]/40 via-transparent to-[color:var(--lime)]/25",
  },
  {
    creator: "@sana.ml",
    project: "Tiny transformer in 200 lines",
    caption: "Karpathy-style, trained on shakespeare on my M1 in an hour.",
    stack: ["Python", "PyTorch", "CUDA"],
    difficulty: "Job-Level",
    repo: "sana-ml/nano-transformer",
    stats: { likes: "22.1k", shares: 320 },
    hue: "from-[color:var(--cyan)]/35 via-transparent to-[color:var(--magenta)]/30",
  },
  {
    creator: "@raj.rust",
    project: "Building a POSIX shell in Rust",
    caption: "Pipes, redirects, job control — 900 lines. Reviewing my parser.",
    stack: ["Rust", "Nix", "Unix"],
    difficulty: "Job-Level",
    repo: "raj-rust/rusty-sh",
    stats: { likes: "5.2k", shares: 61 },
    hue: "from-[color:var(--magenta)]/30 via-transparent to-[color:var(--cyan)]/30",
  },
  {
    creator: "@lin.viz",
    project: "SVG data viz from scratch, no D3",
    caption: "Just math and coordinates. Way less magic than you'd think.",
    stack: ["SVG", "TypeScript"],
    difficulty: "Intermediate",
    repo: "lin-viz/plain-charts",
    stats: { likes: "3.1k", shares: 22 },
    hue: "from-[color:var(--lime)]/30 via-transparent to-[color:var(--magenta)]/25",
  },
];

const eduAds: {
  provider: string;
  course: string;
  tagline: string;
  duration: string;
  level: string;
  cert: string;
  accent: string;
}[] = [
  {
    provider: "Udemy",
    course: "Complete Python Bootcamp: From Zero to Hero",
    tagline: "80+ hours · 1.2M learners enrolled",
    duration: "80h",
    level: "Beginner → Intermediate",
    cert: "Certificate of completion",
    accent: "var(--lime)",
  },
  {
    provider: "Coursera",
    course: "IBM Data Science Professional Certificate",
    tagline: "10-course specialization · industry-recognized",
    duration: "3 mo",
    level: "Beginner",
    cert: "Professional Certificate",
    accent: "var(--cyan)",
  },
];


const difficultyStyles: Record<Difficulty, string> = {
  Noob: "bg-[color:var(--lime)]/20 text-[color:var(--lime)] border-[color:var(--lime)]/40",
  Intermediate: "bg-[color:var(--cyan)]/20 text-[color:var(--cyan)] border-[color:var(--cyan)]/40",
  "Job-Level": "bg-[color:var(--magenta)]/20 text-[color:var(--magenta)] border-[color:var(--magenta)]/40",
};

function Learn() {
  return (
    <div className="min-h-screen bg-black pb-24">
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <div className="flex items-center gap-4 font-display text-sm">
          <span className="text-white/50">Following</span>
          <span className="relative text-white">
            For You
            <span className="absolute -bottom-1.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-white" />
          </span>
          <span className="text-white/50">Live</span>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur">
          <Search className="h-4 w-4" />
        </button>
      </header>

      <div
        className="h-screen snap-y snap-mandatory overflow-y-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        {reels.map((r, i) => (
          <Fragment key={r.creator}>
            <article
              className="relative flex h-screen w-full snap-start items-end overflow-hidden"
            >


            <div className={`absolute inset-0 bg-gradient-to-br ${r.hue}`} />
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

            {/* Fake "play" glyph as video placeholder */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur">
                <Play className="h-8 w-8 translate-x-0.5 text-white/80" fill="currentColor" />
              </div>
            </div>

            {/* Bottom info */}
            <div className="relative z-10 flex w-full items-end justify-between gap-3 p-5 pb-24 text-white">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-white/70">{r.creator}</p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide backdrop-blur ${difficultyStyles[r.difficulty]}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {r.difficulty}
                  </span>
                </div>

                <h2 className="mt-2 font-display text-xl font-semibold leading-tight tracking-tight text-balance">
                  {r.project}
                </h2>
                <p className="mt-1 text-sm text-white/80">{r.caption}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
                  <Music2 className="h-3.5 w-3.5" />
                  <span className="truncate">original sound — {r.creator}</span>
                </div>

                {/* Prominent CTA */}
                <a
                  href={`https://github.com/${r.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--lime)] px-4 py-2.5 font-display text-sm font-semibold text-[color:var(--primary-foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_10px_30px_-10px_rgba(163,255,80,0.6)] transition-transform active:scale-[0.98]"
                >
                  <Github className="h-4 w-4" />
                  View Verified GitHub Code
                  <ShieldCheck className="h-4 w-4 opacity-80" />
                </a>
              </div>

              <aside className="flex flex-col items-center gap-5 text-white">
                <div className="relative">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[color:var(--lime)] to-[color:var(--cyan)] p-[2px]">
                    <div className="grid h-full w-full place-items-center rounded-full bg-black font-mono text-xs">
                      {r.creator[1].toUpperCase()}
                    </div>
                  </div>
                  <span className="absolute -bottom-1.5 left-1/2 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    +
                  </span>
                </div>
                <ActionBtn icon={Heart} label={r.stats.likes} />
                <ActionBtn icon={Share2} label={String(r.stats.shares)} />
                <ActionBtn icon={Flag} label="Report" tone="danger" />
              </aside>
            </div>
            </article>
            {(i + 1) % 4 === 0 && <EduBanner ad={eduAds[Math.floor(i / 4) % eduAds.length]} />}
          </Fragment>
        ))}

      </div>

      <BottomNav />
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  tone = "default",
}: {
  icon: typeof Heart;
  label: string;
  tone?: "default" | "danger";
}) {
  const toneCls =
    tone === "danger"
      ? "bg-destructive/20 text-destructive-foreground ring-1 ring-destructive/40"
      : "bg-white/10 text-white";
  return (
    <button className="flex flex-col items-center gap-1">
      <span
        className={`grid h-10 w-10 place-items-center rounded-full backdrop-blur transition-colors active:bg-white/20 ${toneCls}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="font-mono text-[10px] text-white/80">{label}</span>
    </button>
  );
}

function EduBanner({ ad }: { ad: (typeof eduAds)[number] }) {
  return (
    <section className="relative flex h-screen w-full snap-start items-center justify-center bg-[#faf7f0] px-5 py-10 text-neutral-900">
      {/* Paper texture / notebook lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 27px, #1a1a1a 27px 28px)",
        }}
      />
      <div className="pointer-events-none absolute left-10 top-0 bottom-0 w-px bg-rose-400/40" />

      <div className="relative w-full max-w-sm">
        {/* Sponsored strip */}
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-neutral-900/20 bg-white/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-700 backdrop-blur">
            <BookOpen className="h-3 w-3" />
            Sponsored · Educational
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            Ad-break 01
          </span>
        </div>

        {/* Card */}
        <article
          className="relative overflow-hidden rounded-lg border-2 border-neutral-900 bg-white p-6 shadow-[8px_8px_0_0_#171717]"
        >
          <div
            className="absolute inset-x-0 top-0 h-1.5"
            style={{ background: ad.accent }}
          />

          <div className="flex items-center gap-2">
            <div
              className="grid h-9 w-9 place-items-center rounded-md border-2 border-neutral-900"
              style={{ background: ad.accent }}
            >
              <GraduationCap className="h-5 w-5 text-neutral-900" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                Course · {ad.provider}
              </p>
              <p className="font-display text-sm font-semibold">{ad.provider}</p>
            </div>
          </div>

          <h3 className="mt-5 font-display text-2xl font-semibold leading-[1.1] tracking-tight text-neutral-900">
            {ad.course}
          </h3>
          <p className="mt-2 text-sm text-neutral-600">{ad.tagline}</p>

          {/* Meta grid */}
          <dl className="mt-5 grid grid-cols-3 gap-2 border-y-2 border-dashed border-neutral-200 py-4">
            <MetaItem icon={Clock} label="Length" value={ad.duration} />
            <MetaItem icon={BookOpen} label="Level" value={ad.level} />
            <MetaItem icon={Award} label="Cert" value="Yes" />
          </dl>

          <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            <Award className="h-3 w-3" />
            {ad.cert}
          </p>

          <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-neutral-900 bg-neutral-900 px-4 py-3 font-display text-sm font-semibold text-white transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            Enroll — Continue learning
          </button>

          <p className="mt-3 text-center font-mono text-[10px] text-neutral-400">
            Educational placement · no tracking pixels
          </p>
        </article>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          Swipe up to keep watching
        </p>
      </div>
    </section>
  );
}

function MetaItem({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-neutral-500">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-1 font-display text-xs font-semibold leading-tight text-neutral-900">{value}</p>
    </div>
  );
}

