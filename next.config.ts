import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import { HOME_SLUG } from "./src/server/pages";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const TRAILING_SLASHES = /\/+$/u;

// next/image may load from these origins: the media bucket's domain and the
// site's own /api/media/file route (local-disk uploads).
const remotePattern = (rawUrl: string | undefined, rootPathname = "/**"): RemotePattern[] => {
  if (rawUrl === undefined || !URL.canParse(rawUrl)) {
    return [];
  }
  const parsed = new URL(rawUrl);
  return [
    {
      protocol: parsed.protocol === "http:" ? "http" : "https",
      hostname: parsed.hostname,
      port: parsed.port,
      pathname:
        parsed.pathname === "/"
          ? rootPathname
          : `${parsed.pathname.replace(TRAILING_SLASHES, "")}/**`,
    },
  ];
};

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Unmatched URLs get src/app/global-not-found.tsx: with two root layouts
  // there is no single root not-found to fall back to.
  experimental: { globalNotFound: true },
  partialPrefetching: true,
  turbopack: { root: import.meta.dirname },
  typedRoutes: true,
  // The home page lives at "/" only; its slug as a path is an old address.
  redirects: () =>
    Promise.resolve([{ source: `/${HOME_SLUG}`, destination: "/", permanent: true }]),
  images: {
    remotePatterns: [
      ...remotePattern(process.env.NEXT_PUBLIC_MEDIA_BASE_URL),
      ...remotePattern(process.env.NEXT_PUBLIC_FRONTEND_URL, "/api/media/file/**"),
    ],
    formats: ["image/webp", "image/avif"],
  },
};

export default withPayload(nextConfig);
