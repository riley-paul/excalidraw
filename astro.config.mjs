// @ts-check
import { defineConfig } from "astro/config";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  prefetch: true,
  security: { checkOrigin: true },
  vite: {
    plugins: [
      tailwindcss(),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./src/app/routes",
        generatedRouteTree: "./src/app/routeTree.gen.ts",
      }),
    ],
  },
  output: "server",
  adapter: cloudflare(),
});
