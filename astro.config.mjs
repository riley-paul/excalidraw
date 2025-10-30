// @ts-check
import { defineConfig } from "astro/config";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

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
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        devOptions: { enabled: true },
        includeAssets: ["/favicon.svg", "/icons/apple-touch-icon.png"],
        manifest: {
          name: "Excalidraw Lite",
          short_name: "Excalidraw Lite",
          description:
            "A backend wrapper around the excellent open-source Excalidraw canvas",
          background_color: "#24252880",
          theme_color: "#24252880",
          display: "standalone",
        },
      }),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./src/app/routes",
        generatedRouteTree: "./src/app/routeTree.gen.ts",
      }),
    ],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD
        ? {
            "react-dom/server": "react-dom/server.edge",
          }
        : undefined,
    },
  },
  output: "server",
  adapter: cloudflare(),
});
