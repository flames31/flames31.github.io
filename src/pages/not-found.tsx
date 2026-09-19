import { Link } from "react-router"

import { PageHeader } from "@/components/layout"

export function NotFound() {
  return (
    <PageHeader eyebrow="404" title="Nothing here">
      That page doesn't exist.{" "}
      <Link to="/" className="lift text-foreground underline underline-offset-4">
        Back home
      </Link>
      .
    </PageHeader>
  )
}
