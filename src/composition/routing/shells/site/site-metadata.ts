import type { Metadata, Viewport } from "next";
import { env } from "@/env";

export const siteMetadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_FRONTEND_URL),
  title: env.NEXT_PUBLIC_APP_NAME,
  robots: env.NO_INDEX ? { index: false, follow: false } : undefined,
};

export const siteViewport: Viewport = {
  viewportFit: "cover",
  // Browser chrome follows the system scheme (--background in globals.css).
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};
