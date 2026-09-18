// Light / dark / system. The stored choice is applied before first paint by the
// inline script in index.html; this keeps it in sync afterwards.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Monitor, Moon, Sun } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Theme = "light" | "dark" | "system"

const KEY = "scheme" // same key the plain-HTML site used, so returning visitors keep their choice
const light = () => window.matchMedia("(prefers-color-scheme: light)")

function stored(): Theme {
  try {
    const s = localStorage.getItem(KEY)
    if (s === "light" || s === "dark") return s
  } catch {}
  return "system"
}

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(stored)

  useEffect(() => {
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && !light().matches)
      document.documentElement.classList.toggle("dark", dark)
    }
    apply()

    try {
      if (theme === "system") localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, theme)
    } catch {}

    // follow the OS while no explicit choice has been made
    if (theme !== "system") return
    const mq = light()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [theme])

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>")
  return ctx
}

export const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

export function ThemeMenu() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group grid size-[2.375rem] shrink-0 place-items-center rounded-md text-muted-foreground transition-colors duration-250 hover:bg-card hover:text-primary data-[state=open]:bg-card data-[state=open]:text-primary"
        aria-label="Theme"
      >
        {/* only the icon lifts; the button's hit area stays put */}
        <span className="transition-transform duration-250 ease-lift group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0">
          <Moon className="hidden size-[1.125rem] dark:block" aria-hidden />
          <Sun className="size-[1.125rem] dark:hidden" aria-hidden />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
          {themes.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon aria-hidden />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
