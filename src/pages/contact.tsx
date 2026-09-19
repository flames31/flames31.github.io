import { Mail } from "lucide-react"

import { PageHeader } from "@/components/layout"
import { Logo } from "@/components/tech-icon"
import { Tile } from "@/components/tile"
import { profile } from "@/data"

export function Contact() {
  const [github, linkedin] = profile.links

  return (
    <>
      <PageHeader eyebrow="Contact" title="Get in touch">
        The quickest way to reach me is a message on LinkedIn.
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Tile href={linkedin.href} icon={<Logo name="linkedin" />} eyebrow="LinkedIn" title="Message me">
          linkedin.com/in/rahulraghupathi
        </Tile>
        <Tile href={github.href} icon={<Logo name="github" />} eyebrow="GitHub" title={profile.handle}>
          github.com/flames31
        </Tile>
        {profile.email && (
          <Tile href={`mailto:${profile.email}`} icon={<Mail />} eyebrow="Email" title="Write to me">
            {profile.email}
          </Tile>
        )}
      </div>
    </>
  )
}
