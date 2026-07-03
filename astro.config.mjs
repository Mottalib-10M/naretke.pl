import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  trailingSlash: 'always',  site: "https://kalkulatorwynagrodzen.pl",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
