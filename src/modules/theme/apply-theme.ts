const DARK_GROUND = "#0a0a0a";
const LIGHT_GROUND = "#ffffff";

// Sets `dark` on <html> from the stored choice ("light" | "dark" under
// localStorage "theme"), else from the system preference, and points the
// browser chrome (theme-color, the site shell) at the same ground.
// Self-contained except for its two literals, which ThemeHead inlines with it.
export const applyTheme = (): void => {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem("theme");
  } catch {
    // Storage is blocked: follow the system.
  }
  const dark =
    stored === "dark" || (stored !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", dark ? DARK_GROUND : LIGHT_GROUND);
  }
};

// The inline script: the constants, then one call, so the function's free
// names resolve while the HTML parses.
export const THEME_SCRIPT = `const DARK_GROUND=${JSON.stringify(DARK_GROUND)};const LIGHT_GROUND=${JSON.stringify(LIGHT_GROUND)};(${applyTheme.toString()})()`;

export const toggleStoredTheme = (): void => {
  const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Storage is blocked: the switch lasts for this page only.
    document.documentElement.classList.toggle("dark", next === "dark");
    return;
  }
  applyTheme();
};
