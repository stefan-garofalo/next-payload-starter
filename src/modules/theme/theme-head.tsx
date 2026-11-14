"use client";

import { useEffect, useLayoutEffect } from "react";
import { applyTheme, THEME_SCRIPT } from "./apply-theme";

// Class-strategy dark mode with no flash and static prerender intact (Next
// guide "Preventing flash before hydration"). Render once, inside <head>: the
// inline script sets `dark` on <html> while the HTML parses, before paint.
export const ThemeHead = () => {
  // React's dev remount resets the <html> class; re-apply (no-op in production).
  useLayoutEffect(applyTheme, []);

  // Follow live system changes while the visitor has not chosen a theme.
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", applyTheme);
    return () => {
      query.removeEventListener("change", applyTheme);
    };
  }, []);

  return (
    <script
      // oxlint-disable-next-line react/no-danger -- a constant script built in apply-theme.ts, no user input
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
      suppressHydrationWarning
      // Executable only in the server HTML: the client copy is inert text, so
      // React does not warn about rendering a <script> (same Next guide).
      type={"window" in globalThis ? "text/plain" : "text/javascript"}
    />
  );
};
