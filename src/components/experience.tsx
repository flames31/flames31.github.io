import { Stack } from "@/components/tech-icon"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { jobs } from "@/data"

export function Experience() {
  return (
    <Accordion type="multiple" className="flex flex-col gap-2">
      {jobs.map((j) => (
        <AccordionItem key={j.org} value={j.org} className="border-b-0">
          <AccordionTrigger className="group/job -mx-2 px-2 py-2 text-base font-normal hover:no-underline [&>svg]:mt-1.5">
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
                <span className="text-paragraph">{j.role}</span>
              </div>
              <span className="text-sm whitespace-nowrap text-muted-foreground">{j.dates}</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-3">
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
  )
}
