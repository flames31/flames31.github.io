import { PageHeader } from "@/components/layout"
import { Stack } from "@/components/tech-icon"
import { card } from "@/components/tile"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { jobs } from "@/data"
import { cn } from "@/lib/utils"

export function Experience() {
  return (
    <>
      <PageHeader eyebrow="Experience" title="Where I've worked">
        Open a role for what I did there.
      </PageHeader>

      <Accordion type="multiple" defaultValue={jobs.filter((j) => j.current).map((j) => j.org)} className="grid gap-4">
        {jobs.map((j) => (
          <AccordionItem key={j.org} value={j.org} className={cn(card, "py-0 last:border-b sm:py-0")}>
            <AccordionTrigger className="group/job py-5 text-base font-normal hover:no-underline [&>svg]:mt-1.5">
              {/* role sits under the org so rows never wrap unevenly as names change length */}
              <div className="flex flex-1 items-baseline justify-between gap-4 max-sm:flex-col max-sm:gap-0.5">
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-medium text-foreground transition-colors group-hover/job:text-primary">
                    {j.org}
                    {j.current && (
                      <Badge variant="outline" className="border-primary/50 text-[0.7rem] font-normal text-primary">
                        current
                      </Badge>
                    )}
                  </span>
                  <span className="text-sm text-paragraph">{j.role}</span>
                </div>
                <span className="text-sm whitespace-nowrap text-muted-foreground">{j.dates}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-5">
              <ul className="list-['–_'] space-y-1 pl-5 text-paragraph">
                {j.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Stack names={j.stack} className="pl-5" />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}
