// Sets `dark` on <html> from the stored choice ("light" | "dark" under
// localStorage "theme"), else from the system preference, and points the
// browser chrome (theme-color, layout.tsx) at the same ground: the tags carry
// a system-scheme media query that a manual choice would contradict.
// Self-contained (no closures) because ThemeHead inlines its source into <head>.
export function applyTheme() {
  let stored: string | null = null
  try {
    stored = localStorage.getItem("theme")
  } catch {
    // storage blocked: follow the system
  }
  const dark = stored === "dark" || (stored !== "light" && matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", dark ? "#0a0a0a" : "#ffffff")
  }
}
