"use client"

import { useEffect, useLayoutEffect } from "react"
import { applyTheme } from "./apply-theme"

const SCRIPT = `(${applyTheme.toString()})()`

// Class-strategy dark mode with no flash and static prerender intact (Next
// guide "Preventing flash before hydration"). Render once, inside <head>: the
// inline script sets `dark` on <html> while the HTML parses, before paint.
export function ThemeHead() {
  // React's dev remount resets the <html> class; re-apply (no-op in production).
  useLayoutEffect(applyTheme, [])

  // Follow live system changes while the visitor has not chosen a theme.
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)")
    query.addEventListener("change", applyTheme)
    return () => query.removeEventListener("change", applyTheme)
  }, [])

  return (
    <script
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
      suppressHydrationWarning
      // Executable only in the server HTML: the client copy is inert text, so
      // React does not warn about rendering a <script> (same Next guide).
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
    />
  )
}
