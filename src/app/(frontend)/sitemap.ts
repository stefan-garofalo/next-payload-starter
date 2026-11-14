import type { MetadataRoute } from "next"
import { connection } from "next/server"
import { env } from "@/env"
import { getPublishedPages } from "@/modules/content/readers"
import { pagePath } from "@/modules/content/routes"

const toAbsoluteUrl = (path: string) => new URL(path, env.NEXT_PUBLIC_FRONTEND_URL).toString()

// Rendered per request from the tagged readers' cache: on Vercel the
// prerendered sitemap ignored tag invalidation, so new or removed pages
// stayed out of it until the next deploy.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection()
  const pages = await getPublishedPages()
  return pages.map((page) => ({ url: toAbsoluteUrl(pagePath(page.slug)), lastModified: page.updatedAt }))
}
