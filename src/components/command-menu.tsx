import { useEffect } from "react"
import { Folder, Hash } from "lucide-react"

import { Logo } from "@/components/tech-icon"
import { themes, useTheme } from "@/components/theme"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { profile, projects } from "@/data"

const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
]

export function CommandMenu({
  open,
  setOpen,
  onOpenProject,
}: {
  open: boolean
  setOpen: (open: boolean | ((o: boolean) => boolean)) => void
  onOpenProject: (id: string) => void
}) {
  const { setTheme } = useTheme()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [setOpen])

  // close first, so the dialog hands focus back before we move it
  const run = (fn: () => void) => () => {
    setOpen(false)
    requestAnimationFrame(fn)
  }

  const goTo = (id: string) => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" })
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command menu" description="Jump to a section, open a project or link, or change the theme.">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>

        <CommandGroup heading="Go to">
          {sections.map((s) => (
            <CommandItem key={s.id} onSelect={run(() => goTo(s.id))}>
              <Hash aria-hidden />
              {s.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem key={p.id} onSelect={run(() => onOpenProject(p.id))}>
              <Folder aria-hidden />
              {p.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Links">
          {profile.links.map((l) => (
            <CommandItem key={l.href} onSelect={run(() => location.assign(l.href))}>
              <Logo name={l.icon} className="size-4" />
              {l.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          {themes.map(({ value, label, icon: Icon }) => (
            <CommandItem key={value} value={`theme ${label}`} onSelect={run(() => setTheme(value))}>
              <Icon aria-hidden />
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
