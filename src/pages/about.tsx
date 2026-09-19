import { PageHeader } from "@/components/layout"
import { Logo } from "@/components/tech-icon"
import { Card, Eyebrow } from "@/components/tile"
import { projects, profile } from "@/data"
import { icons } from "@/icons"

// every tool used across the projects, in first-seen order
const tools = [...new Set(projects.flatMap((p) => p.stack))]

export function About() {
  return (
    <>
      <PageHeader eyebrow="About" title="Learn more" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="gap-4 lg:col-span-2">
          {profile.about.map((para) => (
            <p key={para} className="text-paragraph">
              {para}
            </p>
          ))}
        </Card>

        <Card>
          <Eyebrow>Tools I reach for</Eyebrow>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {tools.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-secondary-foreground">
                <Logo name={t} className="size-4" />
                {icons[t].title}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
