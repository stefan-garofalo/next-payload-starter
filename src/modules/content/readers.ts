import { cacheLife, cacheTag } from "next/cache"
import type { Footer, Header, Page } from "@/payload-types"
import getInstance from "@/payload/lib/instance"
import type { Joined } from "@/utils/types"
import { type ContentGlobal, globalTag, mediaTags, PAGES_TAG, pageIdTag, pageTag } from "./tags"

// Each reader caches one Payload resource under its tag, plus a tag per image
// it shows. Payload hooks invalidate the tags, so every page that read the
// resource or one of its images refreshes on the next request.

const MEDIA_DEPTH = 1 as const

const PUBLISHED = { _status: { equals: "published" } } as const

// Populated uploads are the objects with a mimeType; their ids become media tags.
const mediaIdsIn = (value: unknown, ids: number[] = []): number[] => {
  if (Array.isArray(value)) for (const item of value) mediaIdsIn(item, ids)
  else if (value && typeof value === "object") {
    if ("mimeType" in value && "id" in value && typeof value.id === "number") ids.push(value.id)
    for (const child of Object.values(value)) mediaIdsIn(child, ids)
  }
  return ids
}

const tagMedia = <T>(value: T) => {
  const tags = mediaTags(mediaIdsIn(value))
  if (tags.length > 0) cacheTag(...tags)
  return value
}

const readGlobal = async (slug: ContentGlobal) =>
  (await getInstance()).findGlobal({ slug, depth: MEDIA_DEPTH })

export async function getHeader() {
  "use cache"
  cacheLife("max")
  cacheTag(globalTag("header"))
  return tagMedia((await readGlobal("header")) as Joined<Header, typeof MEDIA_DEPTH>)
}

export async function getFooter() {
  "use cache"
  cacheLife("max")
  cacheTag(globalTag("footer"))
  return (await readGlobal("footer")) as Footer
}

export async function getPageBySlug(slug: string) {
  "use cache"
  cacheLife("max")
  cacheTag(pageTag(slug))
  const result = await (await getInstance()).find({
    collection: "pages",
    where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    depth: MEDIA_DEPTH,
    limit: 1,
  })
  const page = (result.docs[0] as Joined<Page, typeof MEDIA_DEPTH> | undefined) ?? null
  if (page) cacheTag(pageIdTag(page.id))
  return tagMedia(page)
}

// Slugs and dates only: static params and the sitemap.
export async function getPublishedPages() {
  "use cache"
  cacheLife("max")
  cacheTag(PAGES_TAG)
  const result = await (await getInstance()).find({
    collection: "pages",
    where: PUBLISHED,
    depth: 0,
    pagination: false,
    select: { slug: true, updatedAt: true },
  })
  return result.docs
}
