import { useLocation, useNavigate } from "react-router"

import { PageHeader } from "@/components/layout"
import { ProjectCard, ProjectDialog } from "@/components/projects"
import { projects } from "@/data"

export function Projects() {
  // the open project lives in the hash, so /projects#id links straight to it
  const { hash } = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <PageHeader eyebrow="Projects" title="My work">
        Things I've built. Open one for the problem, the approach, and what came of it.
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      <ProjectDialog
        id={hash.slice(1) || null}
        onClose={() => navigate({ hash: "" }, { replace: true, preventScrollReset: true })}
      />
    </>
  )
}
