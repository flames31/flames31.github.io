import { useState, type ReactNode } from "react"

import { CommandMenu } from "@/components/command-menu"
import { Experience } from "@/components/experience"
import { Header } from "@/components/header"
import { ProjectDialog, Projects } from "@/components/projects"
import { profile } from "@/data"

export default function App() {
  const [commandOpen, setCommandOpen] = useState(false)
  const [project, setProject] = useState<string | null>(null)

  return (
    <main className="page">
      <Header onOpenCommand={() => setCommandOpen(true)} />

      <hr className="my-10" />

      <section id="about" className="scroll-mt-10">
        <p className="text-paragraph">{profile.about}</p>
      </section>

      <Section id="projects" label="Projects">
        <Projects onOpen={setProject} />
      </Section>

      <Section id="experience" label="Experience">
        <Experience />
      </Section>

      <ProjectDialog id={project} onClose={() => setProject(null)} />
      <CommandMenu open={commandOpen} setOpen={setCommandOpen} onOpenProject={setProject} />
    </main>
  )
}

function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-15 scroll-mt-10">
      <h2 className="mb-3.5 text-[0.8125rem] tracking-[0.12em] text-muted-foreground uppercase">{label}</h2>
      {children}
    </section>
  )
}
