import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"

import { Layout } from "@/components/layout"
import { ThemeProvider } from "@/components/theme"
import { TooltipProvider } from "@/components/ui/tooltip"
import { About } from "@/pages/about"
import { Contact } from "@/pages/contact"
import { Experience } from "@/pages/experience"
import { Home } from "@/pages/home"
import { NotFound } from "@/pages/not-found"
import { Projects } from "@/pages/projects"
import "@/index.css"

// paths must match src/routes.ts, which the build uses to write each page's HTML
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/projects", element: <Projects /> },
      { path: "/about", element: <About /> },
      { path: "/experience", element: <Experience /> },
      { path: "/contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider delayDuration={150}>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)
