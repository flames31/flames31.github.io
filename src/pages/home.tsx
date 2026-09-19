import { ArrowRight, Briefcase, Code, Command, Mail, User } from "lucide-react"
import { Link } from "react-router"

import { Heatmap } from "@/components/heatmap"
import { shortcut, useOpenCommand } from "@/components/layout"
import { Logo } from "@/components/tech-icon"
import { card, Card, Eyebrow, interactive, Tile } from "@/components/tile"
import { jobs, profile, projects } from "@/data"
import { cn } from "@/lib/utils"

export function Home() {
  const openCommand = useOpenCommand()
  const building = projects.find((p) => p.id === profile.building)
  const now = jobs.find((j) => j.current)
  const [github, linkedin] = profile.links

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* hero: who, and what's on the bench */}
      <Card className="md:col-span-2 lg:col-span-3 sm:flex-row sm:items-center">
        <div className="flex-1 py-4 sm:pr-8">
          <Eyebrow>{profile.role}</Eyebrow>
          <h1 className="mt-2 text-3xl font-medium tracking-[-0.02em] text-foreground">{profile.name}</h1>
          <a href={github.href} className="lift mt-1 inline-block text-link">
            {profile.handle}
          </a>
        </div>

        {building && (
          <Link
            to={`/projects#${building.id}`}
            className="group flex flex-1 flex-col justify-center border-t pt-6 sm:self-stretch sm:border-t-0 sm:border-l sm:py-4 sm:pl-8"
          >
            <Eyebrow>Currently building</Eyebrow>
            <span className="mt-2 inline-flex items-center gap-1.5 text-lg text-foreground transition-colors group-hover:text-primary">
              {building.title}
              <ArrowRight className="size-4 opacity-60 group-hover:opacity-100" aria-hidden />
            </span>
            <p className="mt-1 text-sm text-paragraph">{building.desc}</p>
          </Link>
        )}
      </Card>

      {now && (
        <Link to="/experience" className={cn(card, interactive, "md:col-span-2 lg:col-span-1")}>
          <Eyebrow className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-primary" />
            </span>
            Now
          </Eyebrow>
          <p className="mt-3 text-lg font-medium text-foreground transition-colors group-hover:text-primary">{now.org}</p>
          <p className="text-sm text-paragraph">{now.role}</p>
          <p className="mt-auto pt-4 text-sm text-muted-foreground">{now.dates}</p>
        </Link>
      )}

      <Tile to="/projects" icon={<Code />} eyebrow="Projects" title="My work" className="lg:col-span-2">
        {projects.length} things I've built — what, how, and what came of it
      </Tile>
      <Tile to="/about" icon={<User />} eyebrow="About" title="Learn more" className="lg:col-span-2">
        How I got here, and the tools I reach for
      </Tile>

      <Tile to="/experience" icon={<Briefcase />} eyebrow="Experience" title="Where I've worked">
        {jobs.length} roles and degrees
      </Tile>
      <Tile to="/contact" icon={<Mail />} eyebrow="Contact" title="Get in touch">
        Let's talk
      </Tile>
      <Tile href={github.href} icon={<Logo name="github" />} eyebrow="GitHub" title={profile.handle}>
        Code and experiments
      </Tile>
      <Tile href={linkedin.href} icon={<Logo name="linkedin" />} eyebrow="LinkedIn" title="rahulraghupathi">
        Work history and more
      </Tile>

      <Tile onClick={openCommand} icon={<Command />} eyebrow="Command" title="Jump anywhere" className="md:col-span-2 lg:col-span-1">
        Press <kbd className="rounded border px-1.5 py-0.5 text-xs text-muted-foreground">{shortcut}</kbd> from any page
      </Tile>
      <Heatmap className="md:col-span-2 lg:col-span-3" />
    </div>
  )
}
