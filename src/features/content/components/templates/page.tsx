import type { Metadata } from "next"
import { env } from "@/env"
import type { getPageBySlug } from "@/modules/content/readers"
import { pagePath } from "@/modules/content/routes"
import { RenderBlocks } from "../blocks/render"

type PublishedPage = NonNullable<Awaited<ReturnType<typeof getPageBySlug>>>

// A page is its blocks, top to bottom.
export function PageTemplate({ page }: { page: PublishedPage }) {
  return <RenderBlocks blocks={page.blocks ?? []} />
}

// SEO fields from Payload (plugin-seo), else the page title.
export const pageMetadata = (page: PublishedPage): Metadata => ({
  alternates: { canonical: pagePath(page.slug) },
  title: page.meta?.title ?? `${page.title} · ${env.NEXT_PUBLIC_APP_NAME}`,
  description: page.meta?.description ?? undefined,
})
