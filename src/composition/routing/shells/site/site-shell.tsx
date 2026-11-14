import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";
import { AppProviders } from "@/composition/providers";
import { getFooter, getHeader } from "@/entities/site/remote/server";
import { env } from "@/env";
import { SiteFooter, SiteHeader } from "@/features/navigation";
import { getDictionary, SITE_LANG } from "@/modules/i18n";
import { ThemeHead, ThemeToggle } from "@/modules/theme";
import { geistMono, geistSans } from "@/ui/fonts";
import { SiteSearchSlot } from "./site-search-slot";

interface SiteShellProps {
  children: ReactNode;
}

// The public site's root layout: html and body, global providers, header
// and footer around the page.
export const SiteShell = ({ children }: SiteShellProps) => {
  const dict = getDictionary(SITE_LANG);
  return (
    // ThemeHead adds `dark` before hydration, hence suppressHydrationWarning.
    <html
      className={`${geistSans.variable} ${geistMono.variable}`}
      lang={SITE_LANG}
      suppressHydrationWarning
    >
      {/* A column at least the viewport tall: the footer closes short pages at the bottom. */}
      <body className="flex min-h-svh flex-col">
        {/* First in body: its inline script runs before anything below paints. */}
        <ThemeHead />
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
          href="#main-content"
        >
          {dict.common.skipToContent}
        </a>
        <AppProviders>
          <SiteHeader
            actions={
              <>
                <SiteSearchSlot labels={dict.search} />
                <ThemeToggle labels={dict.common.theme} />
              </>
            }
            appName={env.NEXT_PUBLIC_APP_NAME}
            header={getHeader()}
            labels={dict.common.menu}
          />
          <main className="flex-1" id="main-content">
            {children}
          </main>
          <SiteFooter appName={env.NEXT_PUBLIC_APP_NAME} footer={getFooter()} />
        </AppProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};
