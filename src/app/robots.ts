import type { MetadataRoute } from "next"
import { env } from "@/env"

// Answer engines cite pages their search crawlers index.
const ANSWER_ENGINE_CRAWLERS = ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"]

export default function robots(): MetadataRoute.Robots {
  if (env.NO_INDEX) return { rules: { userAgent: "*", disallow: "/" } }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/admin" },
      { userAgent: ANSWER_ENGINE_CRAWLERS, allow: "/", disallow: "/admin" },
    ],
    sitemap: new URL("/sitemap.xml", env.NEXT_PUBLIC_FRONTEND_URL).toString(),
  }
}
