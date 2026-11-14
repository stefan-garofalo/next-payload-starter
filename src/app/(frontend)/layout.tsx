import "./globals.css";

// The public site is CMS content only: every page, including its metadata,
// must prerender to static output. The build fails on request-time work.
export const ensureStatic = "navigation";

export {
  SiteShell as default,
  siteMetadata as metadata,
  siteViewport as viewport,
} from "@/composition/routing";
