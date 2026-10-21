import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AdVantage" },
      { name: "description", content: "Sign in to AdVantage to submit and manage your tech projects." },
      { property: "og:title", content: "Sign in — AdVantage" },
      { property: "og:description", content: "Sign in to AdVantage to submit and manage your tech projects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

// Lovable Cloud's managed OAuth broker (/~oauth) only exists on Lovable-hosted origins,
// and its preview runs in an iframe that Google refuses to load. Everywhere else
// (local Vite, other hosts) use Supabase's native Google provider directly.
const LOVABLE_HOSTS = [
  "lovable.app",
  "lovableproject.com",
  "lovableproject-dev.com",
  "gpt-eng.com",
  "gptengineer.run",
];

function isLovableHost() {
  const host = window.location.hostname;
  return LOVABLE_HOSTS.some((z) => host === z || host.endsWith("." + z));
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // A failed OAuth round-trip comes back as ?error_description=… (or in the hash).
    const params = new URLSearchParams(window.location.search);
    new URLSearchParams(window.location.hash.slice(1)).forEach((v, k) => params.set(k, v));
    const oauthError = params.get("error_description") ?? params.get("error");
    if (oauthError) {
      setMsg(oauthError);
      window.history.replaceState(null, "", window.location.pathname);
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/creator", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({ to: "/creator", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/auth" } });
    setBusy(false);
    if (res.error) return setMsg(res.error.message);
    if (mode === "signup" && !res.data.session) setMsg("Check your email to confirm your account.");
  };

  const google = async () => {
    setMsg(null);
    const redirectTo = window.location.origin + "/auth";
    if (isLovableHost()) {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: redirectTo });
      if (r.error) setMsg(r.error.message);
      return;
    }
    // Supabase redirects back to /auth; the client picks the session up from the URL
    // (detectSessionInUrl) and the auth listener above sends the user on to /creator.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) setMsg(error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-surface/70 p-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Secure login</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <button
          onClick={google}
          className="mt-5 w-full rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background"
        >
          Continue with Google
        </button>
        <div className="my-4 text-center font-mono text-[10px] uppercase text-muted-foreground">or</div>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
          <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
          <button disabled={busy} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? "…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 text-sm text-muted-foreground underline">
          {mode === "signin" ? "No account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
