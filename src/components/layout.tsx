import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { Link, Outlet, ScrollRestoration, useLocation } from "react-router"

import { CommandMenu } from "@/components/command-menu"
import { PalettePicker } from "@/components/palette"
import { ThemeMenu } from "@/components/theme"
import { profile } from "@/data"
import { pageTitle } from "@/routes"

export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
export const shortcut = isMac ? "⌘K" : "Ctrl K"

// lets any page open the command menu (the home page has a tile for it)
const OpenCommand = createContext<() => void>(() => {})
export const useOpenCommand = () => useContext(OpenCommand)

export function Layout() {
  const { pathname } = useLocation()
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    document.title = pageTitle(pathname)
  }, [pathname])

  return (
    <div className="mx-auto max-w-[68rem] px-4 pb-32 sm:px-6 sm:pb-24">
      <header className="flex h-20 items-center gap-3">
        {pathname !== "/" && (
          <Link to="/" className="lift inline-flex items-center gap-2 text-sm text-link">
            <ArrowLeft className="size-4" aria-hidden />
            {profile.name}
          </Link>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="rounded-md border px-2 py-0.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label="Open command menu"
            aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
          >
            {shortcut}
          </button>
          <ThemeMenu />
        </div>
      </header>

      <main key={pathname} className="fade-in">
        <OpenCommand value={() => setCommandOpen(true)}>
          <Outlet />
        </OpenCommand>
      </main>

      <CommandMenu open={commandOpen} setOpen={setCommandOpen} />
      <PalettePicker />
      <ScrollRestoration />
    </div>
  )
}

/** Title block at the top of a subpage. */
export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-xs tracking-[0.12em] text-label uppercase">{eyebrow}</p>
      <h1 className="mt-1 text-2xl font-medium text-foreground">{title}</h1>
      {children && <p className="mt-2 max-w-prose text-paragraph">{children}</p>}
    </div>
  )
}
