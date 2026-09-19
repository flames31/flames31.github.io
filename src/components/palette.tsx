// Color palettes, layered over light/dark (see the [data-palette] blocks in index.css).
// The choice is stored per visitor and applied before first paint by the inline
// script in index.html; the corner switcher and the ⌘K menu both change it here.

import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

export const palettes = [
  { id: "", label: "Amber" },
  { id: "terminal", label: "Terminal" },
  { id: "gruvbox", label: "Gruvbox" },
  { id: "tokyo", label: "Tokyo Night" },
  { id: "synthwave", label: "Synthwave" },
] as const

const KEY = "palette"
const EVENT = "palettechange"

export function setPalette(id: string) {
  const root = document.documentElement
  if (id) root.dataset.palette = id
  else delete root.dataset.palette
  try {
    if (id) localStorage.setItem(KEY, id)
    else localStorage.removeItem(KEY)
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

export function usePalette() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener(EVENT, onChange)
      return () => window.removeEventListener(EVENT, onChange)
    },
    () => document.documentElement.dataset.palette ?? "",
  )
}

export function PalettePicker({ className }: { className?: string }) {
  const current = usePalette()

  return (
    <div
      role="group"
      aria-label="Color palette"
      className={cn("fixed bottom-4 left-4 z-40 flex max-w-[calc(100%-2rem)] flex-wrap gap-1 rounded-lg border bg-card p-1 text-xs shadow-lg", className)}
    >
      {palettes.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setPalette(p.id)}
          aria-pressed={current === p.id}
          className="rounded-md px-2.5 py-1 text-secondary-foreground transition-colors hover:text-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
