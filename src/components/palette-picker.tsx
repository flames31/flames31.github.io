// Temporary: flips between the preview palettes in index.css. Only rendered by
// the dev server (see layout.tsx); remove once a palette is chosen.

import { useState } from "react"

const palettes = [
  { id: "", label: "Amber (current)" },
  { id: "terminal", label: "Terminal" },
  { id: "gruvbox", label: "Gruvbox" },
  { id: "tokyo", label: "Tokyo Night" },
  { id: "synthwave", label: "Synthwave" },
]

export function PalettePicker() {
  const [current, setCurrent] = useState(() => document.documentElement.dataset.palette ?? "")

  const pick = (id: string) => {
    const root = document.documentElement
    if (id) root.dataset.palette = id
    else delete root.dataset.palette
    try {
      sessionStorage.setItem("palette", id)
    } catch {}
    setCurrent(id)
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-wrap gap-1 rounded-lg border bg-card p-1 text-xs shadow-lg">
      {palettes.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => pick(p.id)}
          aria-pressed={current === p.id}
          className="rounded-md px-2.5 py-1 text-secondary-foreground transition-colors hover:text-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
