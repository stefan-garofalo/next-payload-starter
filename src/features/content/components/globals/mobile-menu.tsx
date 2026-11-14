"use client"

import { MenuIcon } from "lucide-react"
import { useState } from "react"
import type { Dictionary } from "@/modules/i18n/types"
import { Button } from "@/modules/ui/components/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/modules/ui/components/sheet"

export type NavLink = { label: string; href: string }

type MobileMenuProps = { links: NavLink[]; labels: Dictionary["common"]["menu"] }

// Below md the navigation is a sheet from the right: Base UI traps focus,
// closes on Escape and locks page scroll. A tapped link closes the sheet.
export function MobileMenu({ links, labels }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger render={<Button className="md:hidden" size="icon" variant="ghost" />}>
        <MenuIcon aria-hidden />
        <span className="sr-only">{labels.open}</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle className="px-6 pt-6">{labels.title}</SheetTitle>
        <nav aria-label={labels.title} className="px-6">
          <ul className="divide-y">
            {links.map((link) => (
              <li key={link.href}>
                <a className="block py-3 font-medium" href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
