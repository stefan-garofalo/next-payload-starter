import type { Metadata } from "next"
import { PageTemplate, pageMetadata } from "@/features/content/components/templates/page"
import { getPageBySlug } from "@/modules/content/readers"
import { HOME_SLUG } from "@/modules/content/routes"
import { Missing } from "./missing"
import { metadata as notFoundMetadata } from "./not-found"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(HOME_SLUG)
  return page ? pageMetadata(page) : notFoundMetadata
}

// The page's own document is part of the prerendered shell, so its first
// screen paints with the first bytes.
export default async function HomePage() {
  const page = await getPageBySlug(HOME_SLUG)
  return page ? <PageTemplate page={page} /> : <Missing />
}
