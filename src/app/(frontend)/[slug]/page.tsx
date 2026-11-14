import type { Metadata } from "next"
import { PageTemplate, pageMetadata } from "@/features/content/components/templates/page"
import { getPageBySlug, getPublishedPages } from "@/modules/content/readers"
import { atLeastOneSlug, HOME_SLUG } from "@/modules/content/routes"
import { Missing } from "../missing"
import { metadata as notFoundMetadata } from "../not-found"

// Every published page is prerendered (/about, /contact…). A page published
// after the build is generated on its first request, then served static;
// Payload hooks invalidate its tags, so only the touched pages regenerate.
// "/home" redirects to "/" in next.config.ts.
export async function generateStaticParams() {
  const pages = await getPublishedPages()
  return atLeastOneSlug(pages.flatMap((page) => (page.slug === HOME_SLUG ? [] : [page.slug])))
}

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const page = await getPageBySlug(slug)
  return page ? pageMetadata(page) : notFoundMetadata
}

// The page's own document is part of the prerendered shell (no boundary), so
// its first screen paints with the first bytes; the blocks wrap their other
// Payload reads in their own Suspense boundaries.
export default async function Page(props: PageProps<"/[slug]">) {
  const { slug } = await props.params
  const page = await getPageBySlug(slug)
  return page ? <PageTemplate page={page} /> : <Missing />
}
