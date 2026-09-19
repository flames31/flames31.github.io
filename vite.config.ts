import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

import { pageTitle, pages } from "./src/routes"

// GitHub Pages has no SPA fallback: give every route its own copy of index.html,
// and use one more as 404.html so unknown paths still boot the app.
function routePages(): Plugin {
  return {
    name: "route-pages",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      const index = bundle["index.html"]
      if (index?.type !== "asset") return
      const html = String(index.source)
      for (const { path } of pages) {
        this.emitFile({
          type: "asset",
          fileName: `${path.slice(1)}/index.html`,
          source: html.replace(/<title>.*<\/title>/, `<title>${pageTitle(path)}</title>`),
        })
      }
      this.emitFile({ type: "asset", fileName: "404.html", source: html })
    },
  }
}

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), routePages()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
})
