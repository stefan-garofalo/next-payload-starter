"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import type { Dictionary } from "@/modules/i18n";
import { Button } from "@/ui/components/button";
import { toggleStoredTheme } from "./apply-theme";

// Both icons share one spot; the `dark` class turns one away and the other
// in. CSS alone picks the icon and the label, so the server HTML is right for
// every visitor.
const ICON = "absolute transition-[opacity,scale,rotate] duration-200 ease-(--ease-out-strong)";

interface ThemeToggleProps {
  labels: Dictionary["common"]["theme"];
}

// Sun/moon switch between light and dark.
export const ThemeToggle = ({ labels }: ThemeToggleProps) => (
  <Button className="relative" onClick={toggleStoredTheme} size="icon" variant="ghost">
    <MoonIcon aria-hidden className={`${ICON} dark:-rotate-90 dark:scale-50 dark:opacity-0`} />
    <SunIcon
      aria-hidden
      className={`${ICON} rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100`}
    />
    <span className="sr-only dark:hidden">{labels.toDark}</span>
    <span className="sr-only hidden dark:inline">{labels.toLight}</span>
  </Button>
);
