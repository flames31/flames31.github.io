import type { CSSProperties } from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { icons, type IconName } from "@/icons"
import { cn } from "@/lib/utils"

function style(name: IconName) {
  const i: { color: string; dark?: string; light?: string } = icons[name]
  return { "--c": i.color, "--c-dark": i.dark, "--c-light": i.light } as CSSProperties
}

/** A brand logo in its brand color. Decorative unless given a label. */
export function Logo({ name, className, label }: { name: IconName; className?: string; label?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("tech size-[1.375rem] shrink-0", className)}
      style={style(name)}
      {...(label ? { role: "img", "aria-label": icons[name].title } : { "aria-hidden": true })}
    >
      <path d={icons[name].path} />
    </svg>
  )
}

/** A logo with its name in a tooltip. */
export function TechIcon({ name }: { name: IconName }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="relative z-10 inline-flex">
          <Logo name={name} label />
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{icons[name].title}</TooltipContent>
    </Tooltip>
  )
}

export function Stack({ names, className }: { names: IconName[]; className?: string }) {
  if (!names.length) return null
  return (
    <div className={cn("mt-[0.625rem] flex flex-wrap items-center gap-[0.8125rem]", className)}>
      {names.map((n) => (
        <TechIcon key={n} name={n} />
      ))}
    </div>
  )
}
