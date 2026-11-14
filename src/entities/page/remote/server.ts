import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isMedia } from "@/integrations/payload";
import type { Page } from "@/payload-types";
import { getCms } from "@/server/cms/server";
import { mediaTags, PAGES_TAG, pageIdTag, pageTag } from "@/server/revalidation";

// Each reader caches one Payload resource under its tag, plus a tag per image
// it shows. Payload hooks invalidate the tags, so every page that read the
// resource or one of its images refreshes on the next request.

const MEDIA_DEPTH = 1;

const PUBLISHED = { _status: { equals: "published" } } as const;

// The images a page shows. Add a block's upload fields here when it gets one.
const pageMediaIds = (page: Page): number[] =>
  (page.blocks ?? []).flatMap((block) =>
    block.blockType === "hero" && isMedia(block.image) ? [block.image.id] : [],
  );

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  "use cache";
  cacheLife("max");
  cacheTag(pageTag(slug));
  const cms = await getCms();
  const result = await cms.find({
    collection: "pages",
    where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    depth: MEDIA_DEPTH,
    limit: 1,
  });
  const page = result.docs[0] ?? null;
  if (page) {
    cacheTag(pageIdTag(page.id), ...mediaTags(pageMediaIds(page)));
  }
  return page;
};

export interface PublishedPage {
  slug: string;
  updatedAt: string;
}

// Slugs and dates only: static params and the sitemap.
export const getPublishedPages = async (): Promise<PublishedPage[]> => {
  "use cache";
  cacheLife("max");
  cacheTag(PAGES_TAG);
  const cms = await getCms();
  const result = await cms.find({
    collection: "pages",
    where: PUBLISHED,
    depth: 0,
    pagination: false,
    select: { slug: true, updatedAt: true },
  });
  return result.docs;
};
