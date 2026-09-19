import type { ComponentProps, ReactNode } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

import { cn } from "@/lib/utils"

/** The bento card surface. Interactive cards also get the hover lift. */
export const card = "relative flex flex-col rounded-lg border bg-card p-5 sm:p-6"
export const interactive =
  "group transition duration-250 ease-lift hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg hover:shadow-black/10 " +
  "focus-visible:outline-offset-2 motion-reduce:hover:translate-y-0"

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(card, className)} {...props} />
}

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-xs tracking-[0.12em] text-muted-foreground uppercase", className)} {...props} />
}

type TileProps = {
  icon?: ReactNode
  eyebrow: string
  title: ReactNode
  children?: ReactNode // the subtitle
  className?: string
} & ({ to: string; href?: never; onClick?: never } | { href: string; to?: never; onClick?: never } | { onClick: () => void; to?: never; href?: never })

/** icon, LABEL, title, subtitle — links in, out (↗), or runs an action. */
export function Tile({ icon, eyebrow, title, children, className, ...target }: TileProps) {
  const external = "href" in target && !!target.href
  const Arrow = external ? ArrowUpRight : ArrowRight
  const body = (
    <>
      {icon && <div className="mb-3 text-foreground [&_svg]:size-5">{icon}</div>}
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-1 text-lg font-medium text-foreground transition-colors group-hover:text-primary">{title}</h2>
      {children && <div className="mt-1 text-sm text-secondary-foreground">{children}</div>}
      <Arrow
        aria-hidden
        className={cn(
          "absolute right-5 bottom-5 size-4 text-primary transition-opacity",
          external ? "opacity-50 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100 max-md:opacity-60",
        )}
      />
    </>
  )
  const cls = cn(card, interactive, "text-left", className)

  if ("to" in target && target.to) return <Link to={target.to} className={cls}>{body}</Link>
  if (external) return <a href={target.href} className={cls}>{body}</a>
  return <button type="button" onClick={target.onClick} className={cls}>{body}</button>
}
