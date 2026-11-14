import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { env } from "@/env"
import { SiteFooter } from "@/features/content/components/globals/footer"
import { SiteHeader } from "@/features/content/components/globals/header"
import { SITE_LANG } from "@/modules/i18n/config"
import { getGlobalDictionary } from "@/modules/i18n/lib/getters"
import { QueryProvider } from "@/modules/query/provider"
import { geistMono, geistSans } from "@/modules/ui/fonts"
import { ThemeHead } from "@/modules/ui/theme/theme-head"

// The public site is CMS content only: every page, including its metadata,
// must prerender to static output. The build fails on request-time work.
export const ensureStatic = "navigation"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_FRONTEND_URL),
  title: env.NEXT_PUBLIC_APP_NAME,
  ...(env.NO_INDEX ? { robots: { index: false, follow: false } } : {}),
}

export const viewport: Viewport = {
  viewportFit: "cover",
  // browser chrome follows the system scheme (--background in globals.css)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

const dict = getGlobalDictionary(SITE_LANG)

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // ThemeHead adds `dark` before hydration, hence suppressHydrationWarning
    <html className={`${geistSans.variable} ${geistMono.variable}`} lang={SITE_LANG} suppressHydrationWarning>
      <head>
        <ThemeHead />
      </head>
      {/* a column at least the viewport tall: the footer closes short pages at the bottom */}
      <body className="flex min-h-svh flex-col">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
          href="#main-content"
        >
          {dict.common.skipToContent}
        </a>
        <QueryProvider>
          <SiteHeader />
          <main className="flex-1" id="main-content">
            {children}
          </main>
          <SiteFooter />
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
