import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://ahhshm.github.io",
  base: "blog",
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      config: { applyBaseStyles: false },
    }),
  ],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
