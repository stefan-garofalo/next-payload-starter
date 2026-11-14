import { SiteShell } from "../../shells/site";
import { NotFoundPage } from "./not-found-page";

// The app has two root layouts ((frontend) and (payload)), so an unmatched URL
// never reaches (frontend)/not-found.tsx. Next serves this page instead, as
// static HTML with status 404, inside the same site shell.
export const GlobalNotFound = () => (
  <SiteShell>
    <NotFoundPage />
  </SiteShell>
);
