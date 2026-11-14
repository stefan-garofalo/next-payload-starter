import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isMedia } from "@/integrations/payload";
import type { Footer, Header } from "@/payload-types";
import { getCms } from "@/server/cms/server";
import { globalTag, mediaTags } from "@/server/revalidation";

// The site-wide globals, cached under their tag (and the logo's media tag).
// Payload hooks invalidate them on save.

export const getHeader = async (): Promise<Header> => {
  "use cache";
  cacheLife("max");
  cacheTag(globalTag("header"));
  const cms = await getCms();
  const header = await cms.findGlobal({ slug: "header", depth: 1 });
  if (isMedia(header.logo)) {
    cacheTag(...mediaTags([header.logo.id]));
  }
  return header;
};

export const getFooter = async (): Promise<Footer> => {
  "use cache";
  cacheLife("max");
  cacheTag(globalTag("footer"));
  const cms = await getCms();
  return await cms.findGlobal({ slug: "footer", depth: 0 });
};
