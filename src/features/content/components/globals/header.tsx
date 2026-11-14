import Link from "next/link"
import { Suspense } from "react"
import { env } from "@/env"
import { SiteSearch } from "@/features/site-search/components/site-search"
import { MediaImage } from "@/features/content/components/fields/media-image"
import { SITE_LANG } from "@/modules/i18n/config"
import { getGlobalDictionary } from "@/modules/i18n/lib/getters"
import { getHeader } from "@/modules/content/readers"
import { ThemeToggle } from "@/modules/ui/theme/theme-toggle"
import { MobileMenu, type NavLink } from "./mobile-menu"

const dict = getGlobalDictionary(SITE_LANG)

// Sticky bar. The shell, search and theme toggle are static; each part that
// reads Payload sits in its own Suspense boundary.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Suspense fallback={<HomeLink logo={null} />}>
          <HeaderHome />
        </Suspense>
        <div className="flex items-center gap-1">
          <Suspense fallback={null}>
            <HeaderNav />
          </Suspense>
          <SiteSearch labels={dict.search} />
          <ThemeToggle labels={dict.common.theme} />
          <Suspense fallback={null}>
            <HeaderMobileMenu />
          </Suspense>
        </div>
      </div>
    </header>
  )
}

type HeaderDoc = Awaited<ReturnType<typeof getHeader>>

const navLinks = (header: HeaderDoc): NavLink[] =>
  (header.nav ?? []).map(({ label, href }) => ({ label, href }))

function HomeLink({ logo }: { logo: HeaderDoc["logo"] }) {
  return (
    <Link className="font-semibold tracking-tight" href="/">
      {logo ? <MediaImage className="h-8 w-auto" media={logo} sizes="160px" /> : env.NEXT_PUBLIC_APP_NAME}
      {logo ? <span className="sr-only">{env.NEXT_PUBLIC_APP_NAME}</span> : null}
    </Link>
  )
}

async function HeaderHome() {
  const { logo } = await getHeader()
  return <HomeLink logo={logo} />
}

async function HeaderNav() {
  const links = navLinks(await getHeader())
  return (
    <nav aria-label={dict.common.menu.title} className="mr-2 hidden md:block">
      <ul className="flex items-center gap-6 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <a className="text-muted-foreground transition-colors hover:text-foreground" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

async function HeaderMobileMenu() {
  const links = navLinks(await getHeader())
  return links.length > 0 ? <MobileMenu labels={dict.common.menu} links={links} /> : null
}
