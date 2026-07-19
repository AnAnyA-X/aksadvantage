import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Share2, Bookmark, Music2, Play, Search } from "lucide-react";
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

const reels = [
  {
    creator: "@mia.builds",
    project: "Realtime whiteboard with Y.js",
    caption: "Built a collaborative canvas in a weekend. CRDTs are wild.",
    tags: ["#yjs", "#collab", "#weekend-hack"],
    stats: { likes: "12.4k", comments: 284, shares: 91 },
    hue: "from-[color:var(--lime)]/40 via-transparent to-[color:var(--cyan)]/30",
  },
  {
    creator: "@devon.codes",
    project: "Local-first todo, no backend",
    caption: "SQLite in the browser + service worker. Offline, forever.",
    tags: ["#local-first", "#sqlite", "#pwa"],
    stats: { likes: "8.9k", comments: 190, shares: 44 },
    hue: "from-[color:var(--magenta)]/40 via-transparent to-[color:var(--lime)]/25",
  },
  {
    creator: "@sana.ml",
    project: "Tiny transformer in 200 lines",
    caption: "Karpathy-style, trained on shakespeare on my M1 in an hour.",
    tags: ["#ml", "#transformers", "#from-scratch"],
    stats: { likes: "22.1k", comments: 512, shares: 320 },
    hue: "from-[color:var(--cyan)]/35 via-transparent to-[color:var(--magenta)]/30",
  },
];

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
        {reels.map((r) => (
          <article
            key={r.creator}
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
            <div className="relative z-10 flex w-full items-end justify-between gap-4 p-5 pb-24 text-white">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-white/70">{r.creator}</p>
                <h2 className="mt-1 font-display text-xl font-semibold leading-tight tracking-tight text-balance">
                  {r.project}
                </h2>
                <p className="mt-1 text-sm text-white/80">{r.caption}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/80 backdrop-blur">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
                  <Music2 className="h-3.5 w-3.5" />
                  <span className="truncate">original sound — {r.creator}</span>
                </div>
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
                <ActionBtn icon={MessageCircle} label={String(r.stats.comments)} />
                <ActionBtn icon={Bookmark} label="Save" />
                <ActionBtn icon={Share2} label={String(r.stats.shares)} />
              </aside>
            </div>
          </article>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

function ActionBtn({ icon: Icon, label }: { icon: typeof Heart; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors active:bg-white/20">
        <Icon className="h-5 w-5" />
      </span>
      <span className="font-mono text-[10px] text-white/80">{label}</span>
    </button>
  );
}
