"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import type { Dictionary } from "@/modules/i18n/types"
import { Button } from "@/modules/ui/components/button"
import { cn } from "@/modules/ui/utils/tailwind"
import { applyTheme } from "./apply-theme"

// Both icons share one spot; the `dark` class turns one away and the other
// in (state indication, 200 ms). CSS alone picks the icon and the label, so
// the server HTML is right for every visitor.
const ICON = "absolute transition-[opacity,scale,rotate] duration-200 ease-(--ease-out-strong)"

// Sun/moon switch between light and dark.
export function ThemeToggle({ labels, className }: { labels: Dictionary["common"]["theme"]; className?: string }) {
  const toggle = () => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark"
    try {
      localStorage.setItem("theme", next)
    } catch {
      // storage blocked: the switch lasts for this page only
      document.documentElement.classList.toggle("dark", next === "dark")
      return
    }
    applyTheme()
  }

  return (
    <Button className={cn("relative", className)} onClick={toggle} size="icon" variant="ghost">
      <MoonIcon aria-hidden className={`${ICON} dark:-rotate-90 dark:scale-50 dark:opacity-0`} />
      <SunIcon aria-hidden className={`${ICON} rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100`} />
      <span className="sr-only dark:hidden">{labels.toDark}</span>
      <span className="sr-only hidden dark:inline">{labels.toLight}</span>
    </Button>
  )
}
