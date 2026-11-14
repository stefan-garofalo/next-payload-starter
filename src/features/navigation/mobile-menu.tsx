"use client";

import { MenuIcon } from "lucide-react";
import { useState } from "react";
import type { NavLink } from "@/entities/site";
import type { Dictionary } from "@/modules/i18n";
import { Button } from "@/ui/components/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/ui/components/sheet";

interface MobileMenuProps {
  links: NavLink[];
  labels: Dictionary["common"]["menu"];
}

// Below md the navigation is a sheet from the right: Base UI traps focus,
// closes on Escape and locks page scroll. A tapped link closes the sheet.
export const MobileMenu = ({ links, labels }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
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
                <a
                  className="block py-3 font-medium"
                  href={link.href}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
