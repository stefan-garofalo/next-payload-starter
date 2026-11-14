/** biome-ignore-all lint/style/noMagicNumbers: no issue */
import path from "node:path"
import { withPayload } from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"
import { HOME_SLUG } from "./src/modules/content/routes"

const parseRemotePattern = (
  rawUrl: string | undefined,
  fallbackPathname = "/**"
): {
  protocol: "http" | "https"
  hostname: string
  port: string
  pathname: string
} | null => {
  if (!rawUrl) return null

  try {
    const parsed = new URL(rawUrl)
    return {
      protocol: parsed.protocol === "http:" ? "http" : "https",
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname === "/" ? fallbackPathname : `${parsed.pathname.replace(/\/+$/, "")}/**`,
    }
  } catch {
    return null
  }
}

const remotePatterns = [
  parseRemotePattern(process.env.NEXT_PUBLIC_MEDIA_BASE_URL),
  parseRemotePattern(process.env.NEXT_PUBLIC_FRONTEND_URL, "/api/media/file/**"),
].filter((pattern) => pattern !== null)

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Unmatched URLs get src/app/global-not-found.tsx: with two root layouts
  // there is no single root not-found to fall back to.
  experimental: { globalNotFound: true },
  partialPrefetching: true,
  turbopack: {
    root: path.join(__dirname),
  },
  typedRoutes: true,
  // The home page lives at "/" only; its slug as a path is an old address.
  redirects: async () => [{ source: `/${HOME_SLUG}`, destination: "/", permanent: true }],
  images: {
    // Enable Next.js image optimization for Payload uploads
    remotePatterns,
    formats: ["image/webp", "image/avif"],
  },
}

export default withPayload(nextConfig)
