import { useMemo, useRef, type ReactNode } from "react"
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"
import { ArrowUpRight } from "lucide-react"

import { Stack } from "@/components/tech-icon"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { projects, type Project } from "@/data"
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query"
import { icons } from "@/icons"

// Embla only loops when the slides are wider than the view, so the set is
// repeated. Three copies of three cards cover a ~4000px-wide window.
const COPIES = 3

export function Projects({ onOpen }: { onOpen: (id: string) => void }) {
  const root = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const opts = useMemo(
    () => ({
      loop: true,
      duration: reduce ? 0 : 25,
      // snap each card to the page's text edge rather than the bleed edge
      align: () => (root.current ? -parseFloat(getComputedStyle(root.current).marginLeft) : 0),
    }),
    [reduce],
  )
  const plugins = useMemo(() => [WheelGesturesPlugin()], [])

  return (
    <Carousel
      ref={root}
      opts={opts}
      plugins={plugins}
      className="strip"
      tabIndex={0}
      aria-label="Projects — drag or use the arrow keys"
    >
      {/* block padding: room for the card lift */}
      <CarouselContent className="ml-0 py-1">
        {Array.from({ length: COPIES }, (_, copy) =>
          projects.map((p) => (
            <CarouselItem
              key={`${copy}-${p.id}`}
              className="basis-[min(23.75rem,78vw)] pr-5 pl-0"
              inert={copy > 0}
              aria-hidden={copy > 0 || undefined}
            >
              <ProjectCard project={p} onOpen={() => onOpen(p.id)} />
            </CarouselItem>
          )),
        )}
      </CarouselContent>
    </Carousel>
  )
}

function ProjectCard({ project: p, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <article className="group relative h-full rounded-md border bg-card px-[1.375rem] py-5 transition duration-250 ease-lift select-none hover:-translate-y-[3px] hover:border-primary has-focus-visible:border-primary motion-reduce:hover:translate-y-0">
      <h3>
        {/* the ::after stretches the button over the whole card; the logos sit above it */}
        <button
          type="button"
          onClick={onOpen}
          className="text-left font-medium text-foreground transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-primary focus-visible:outline-none"
        >
          {p.title}
        </button>
      </h3>
      <p className="mt-0.5 text-paragraph">{p.desc}</p>
      <Stack names={p.stack} />
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
        <a href={p.repo} className="lift inline-flex w-fit items-center gap-1 text-foreground">
          source <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      )}
    </div>
  )
}

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h4 className="text-xs tracking-[0.12em] text-muted-foreground uppercase">{title}</h4>
      <p className="mt-1 text-paragraph">{children}</p>
    </section>
  )
}
