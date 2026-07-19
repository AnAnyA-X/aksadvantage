import { Link, useRouterState } from "@tanstack/react-router";
import { Play, LayoutDashboard, Scissors, Home } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/learn", label: "Learn", icon: Play },
  { to: "/creator", label: "Creator", icon: LayoutDashboard },
  { to: "/editor", label: "Editor", icon: Scissors },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="group flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition-colors"
            >
              <div
                className={
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all " +
                  (active
                    ? "bg-primary text-primary-foreground shadow-[0_0_24px_-4px_var(--primary)]"
                    : "text-muted-foreground group-hover:text-foreground")
                }
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
              </div>
              <span
                className={
                  "text-[10px] font-mono uppercase tracking-widest " +
                  (active ? "text-foreground" : "text-muted-foreground")
                }
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
