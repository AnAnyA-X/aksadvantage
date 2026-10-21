// // @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// // or the app will break with duplicate plugins:
// //   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
// //     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
// //     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// // You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
// import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// export default defineConfig({
//   tanstackStart: {
//     // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
//     // nitro/vite builds from this
//     server: { entry: "server" },
//   },
// });











import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv, type Plugin } from "vite";

function lovableOAuthShim(
  projectId: string,
  projectEnv: string,
): Plugin {
  return {
    name: "lovable-oauth-shim",

    configureServer(server) {
      server.middlewares.use("/~oauth/initiate", (req, res) => {
        const incoming = new URL(
          req.url ?? "",
          "http://127.0.0.1",
        );

        incoming.searchParams.set("project_id", projectId);

        if (projectEnv) {
          incoming.searchParams.set("project_env", projectEnv);
        }

        res.statusCode = 302;
        res.setHeader(
          "Location",
          `https://oauth.lovable.app/initiate?${incoming.searchParams.toString()}`,
        );
        res.end();
      });
    },
  };
}

const env = loadEnv("development", process.cwd(), "");
const projectId = env.LOVABLE_PROJECT_ID ?? "";
const projectEnv = env.LOVABLE_PROJECT_ENV ?? "";

export default defineConfig({
  plugins: projectId
    ? [lovableOAuthShim(projectId, projectEnv)]
    : [],

  tanstackStart: {
    server: { entry: "server" },
  },
});
