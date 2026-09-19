import { useEffect } from "react"
import { CornerDownRight, Folder } from "lucide-react"
import { useNavigate } from "react-router"

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
import { pages } from "@/routes"

const destinations = [{ path: "/", title: "Home" }, ...pages]

export function CommandMenu({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean | ((o: boolean) => boolean)) => void
}) {
  const { setTheme } = useTheme()
  const navigate = useNavigate()

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

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command menu" description="Go to a page, open a project or link, or change the theme.">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>

        <CommandGroup heading="Go to">
          {destinations.map((d) => (
            <CommandItem key={d.path} onSelect={run(() => navigate(d.path))}>
              <CornerDownRight aria-hidden />
              {d.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem key={p.id} onSelect={run(() => navigate(`/projects#${p.id}`))}>
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
