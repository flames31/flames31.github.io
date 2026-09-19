import { useRef, type ReactNode } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

import { Stack } from "@/components/tech-icon"
import { card, interactive } from "@/components/tile"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { projects, type Project } from "@/data"
import { useMediaQuery } from "@/hooks/use-media-query"
import { icons } from "@/icons"
import { cn } from "@/lib/utils"

/** A project card; opens its write-up at /projects#id. */
export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article className={cn(card, interactive, "h-full")}>
      <h2 className="font-medium text-foreground transition-colors group-hover:text-primary">
        {/* the ::after stretches the link over the whole card; the logos sit above it */}
        <Link to={`/projects#${p.id}`} preventScrollReset className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring">
          {p.title}
        </Link>
      </h2>
      <p className="mt-1 text-sm text-paragraph">{p.desc}</p>
      <Stack names={p.stack} className="mt-auto pt-4" />
      <ArrowRight aria-hidden className="absolute right-5 bottom-5 size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100 max-md:opacity-60" />
    </article>
  )
}

/** One dialog for whichever project is open — a bottom sheet on phones. */
export function ProjectDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const wide = useMediaQuery("(min-width: 640px)")

  // keep the last project mounted while the dialog animates closed
  const last = useRef<Project | undefined>(undefined)
  const found = projects.find((x) => x.id === id)
  if (found) last.current = found
  const p = last.current
  if (!p) return null

  const open = !!found
  const onOpenChange = (o: boolean) => !o && onClose()

  if (wide) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-foreground">{p.title}</DialogTitle>
            <DialogDescription className="text-paragraph">{p.desc}</DialogDescription>
          </DialogHeader>
          <Body project={p} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto bg-card">
        <SheetHeader>
          <SheetTitle className="pr-6 font-medium">{p.title}</SheetTitle>
          <SheetDescription className="text-paragraph">{p.desc}</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">
          <Body project={p} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Body({ project: p }: { project: Project }) {
  return (
    <div className="grid gap-4 text-sm">
      <Part title="Problem">{p.problem}</Part>
      <Part title="Approach">{p.approach}</Part>
      <Part title="Results">{p.results}</Part>

      <div className="flex flex-wrap gap-1.5">
        {p.stack.map((n) => (
          <Badge key={n} variant="outline" className="text-secondary-foreground">
            {icons[n].title}
          </Badge>
        ))}
      </div>

      {p.repo && (
        <a href={p.repo} className="lift inline-flex w-fit items-center gap-1 text-link">
          source <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      )}
    </div>
  )
}

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h4 className="text-xs tracking-[0.12em] text-label uppercase">{title}</h4>
      <p className="mt-1 text-paragraph">{children}</p>
    </section>
  )
}
