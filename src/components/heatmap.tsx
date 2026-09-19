// This year's GitHub contributions, one dot per day. The data is fetched at build
// time by scripts/contributions.mjs, so nothing is requested from the browser.

import { ArrowUpRight } from "lucide-react"

import { Logo } from "@/components/tech-icon"
import { card, Eyebrow, interactive } from "@/components/tile"
import data from "@/generated/contributions.json"
import { cn } from "@/lib/utils"

const CELL = 10
const GAP = 3
const STEP = CELL + GAP

// level 0 is an empty dot; 1–4 step up the accent
const fill = ["var(--border)", "color-mix(in oklab, var(--primary) 35%, var(--border))", "color-mix(in oklab, var(--primary) 60%, var(--border))", "color-mix(in oklab, var(--primary) 82%, var(--border))", "var(--primary)"]

const fmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" })

export function Heatmap({ className }: { className?: string }) {
  const { user, year, total, days } = data
  const today = new Date().toISOString().slice(0, 10)
  // the calendar starts on Sunday, so Jan 1 sits in its weekday's row
  const offset = days.length ? new Date(days[0].date + "T00:00:00Z").getUTCDay() : 0
  const weeks = Math.ceil((days.length + offset) / 7)

  return (
    <a href={`https://github.com/${user}`} className={cn(card, interactive, "gap-4", className)}>
      <div className="flex items-center gap-2">
        <Logo name="github" className="size-4" />
        <Eyebrow>GitHub activity · {year}</Eyebrow>
        <ArrowUpRight aria-hidden className="ml-auto size-4 text-primary opacity-50 transition-opacity group-hover:opacity-100" />
      </div>

      {days.length ? (
        <svg
          viewBox={`0 0 ${weeks * STEP - GAP} ${7 * STEP - GAP}`}
          className="w-full"
          role="img"
          aria-label={`${total} contributions in ${year}`}
        >
          {days.map((d, i) => {
            const future = d.date > today
            return (
              <rect
                key={d.date}
                x={Math.floor((i + offset) / 7) * STEP}
                y={((i + offset) % 7) * STEP}
                width={CELL}
                height={CELL}
                rx={2}
                fill={fill[d.level] ?? fill[0]}
                opacity={future ? 0.35 : 1}
              >
                {!future && <title>{`${d.count || "No"} contribution${d.count === 1 ? "" : "s"} on ${fmt.format(new Date(d.date + "T00:00:00Z"))}`}</title>}
              </rect>
            )
          })}
        </svg>
      ) : (
        <p className="text-sm text-muted-foreground">Contribution data wasn't available at build time.</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-secondary-foreground">
        <span>
          {total.toLocaleString("en")} contributions in {year}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-hidden>
          Less
          {fill.map((f) => (
            <span key={f} className="size-2.5 rounded-[2px]" style={{ background: f }} />
          ))}
          More
        </span>
      </div>
    </a>
  )
}
