// The site's pages. Plain data, so vite.config.ts can also read it: the build writes
// each path its own index.html (with the page's <title>), and GitHub Pages serves
// them directly instead of falling back to 404.html.

export const pages = [
  { path: "/projects", title: "Projects" },
  { path: "/about", title: "About" },
  { path: "/experience", title: "Experience" },
  { path: "/contact", title: "Contact" },
] as const

export const siteTitle = "Rahul Raghupathi"

export const pageTitle = (path: string) => {
  const page = pages.find((p) => p.path === path)
  return page ? `${page.title} · ${siteTitle}` : siteTitle
}
