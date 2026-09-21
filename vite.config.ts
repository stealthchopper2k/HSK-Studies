import { copyFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const pages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: pages ? "/HSK-Studies/" : "/",
  plugins: [
    react(),
    {
      name: "github-pages-spa",
      closeBundle() {
        if (!pages) return;
        copyFileSync("dist/index.html", "dist/404.html");
      },
    },
  ],
});
