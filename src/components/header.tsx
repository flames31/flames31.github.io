import { Logo } from "@/components/tech-icon"
import { ThemeMenu } from "@/components/theme"
import { profile } from "@/data"

export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)

export function Header({ onOpenCommand }: { onOpenCommand: () => void }) {
  return (
    <header>
      {/* name and links share a row; the role line sits underneath it */}
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <h1 className="text-[1.75rem] font-medium tracking-[-0.02em] text-foreground">{profile.name}</h1>

        <nav className="flex items-center gap-[1.125rem] max-sm:gap-[0.875rem]">
          {profile.links.map((l) => (
            <a key={l.href} href={l.href} className="lift inline-flex items-center gap-[0.4375rem]">
              <Logo name={l.icon} />
              {l.label}
            </a>
          ))}

          <button
            type="button"
            onClick={onOpenCommand}
            className="rounded-md border px-2 py-0.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary max-sm:hidden"
            aria-label="Open command menu"
            aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
          >
            {isMac ? "⌘K" : "Ctrl K"}
          </button>

          <ThemeMenu />
        </nav>
      </div>

      <p className="mt-0.5 text-muted-foreground">{profile.role}</p>
    </header>
  )
}
