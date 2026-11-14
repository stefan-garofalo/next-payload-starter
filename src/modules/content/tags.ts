export const CONTENT_GLOBALS = ["header", "footer"] as const
export type ContentGlobal = (typeof CONTENT_GLOBALS)[number]

export const PAGES_TAG = "pages"
export const MEDIA_TAG = "media"
export const globalTag = (slug: ContentGlobal) => `global:${slug}`
// A route reads a page by slug, so the slug tag also covers a slug that is not
// published yet (its cached 404 refreshes on publish). A found document also
// carries its id tag, so the route it was served under refreshes when the
// document changes, even after a slug rename or an unpublish.
export const pageTag = (slug: string) => `page:${slug}`
export const pageIdTag = (id: number | string) => `page-id:${id}`
export const mediaTag = (id: number | string) => `media:${id}`

const CONTENT_TAG_PATTERN = /^(?:global:(?:header|footer)|pages|media|page:[\w-]+|(?:page-id|media):\d+)$/

export const isContentTag = (value: unknown): value is string =>
  typeof value === "string" && CONTENT_TAG_PATTERN.test(value)

// Collections served at a slug. Add a collection here, to DOC_TAGS and to
// CONTENT_TAG_PATTERN to give it the same tag scheme.
export type SlugCollection = "pages"

const DOC_TAGS = {
  pages: { slug: pageTag, id: pageIdTag, all: PAGES_TAG },
} as const

// A page change affects the route at its slug, the route that served it
// before (its id tag), and every list that shows it. Other routes keep their
// cache.
export const tagsForDoc = (collection: SlugCollection, doc: { id: number | string; slug?: string | null }) => [
  ...(doc.slug ? [DOC_TAGS[collection].slug(doc.slug)] : []),
  DOC_TAGS[collection].id(doc.id),
  DOC_TAGS[collection].all,
]

// A cache entry carries a tag per image it shows, so an edited image refreshes
// only those entries. Next caps tags per entry; past MAX_MEDIA_TAGS a long list
// takes the shared tag instead, which every media change also sends.
const MAX_MEDIA_TAGS = 64

export const mediaTags = (ids: ReadonlyArray<number | string>) =>
  ids.length > MAX_MEDIA_TAGS ? [MEDIA_TAG] : [...new Set(ids)].map(mediaTag)

export const tagsForMedia = (id: number | string) => [mediaTag(id), MEDIA_TAG]
