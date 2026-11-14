import Link from "next/link";
import type { ReactNode } from "react";
import { Suspense, use } from "react";
import type { SiteHeader as SiteHeaderDoc } from "@/entities/site";
import { headerNavLinks } from "@/entities/site";
import { isMedia, MediaImage } from "@/integrations/payload";
import type { Dictionary } from "@/modules/i18n";
import { MobileMenu } from "./mobile-menu";

interface SiteHeaderProps {
  appName: string;
  header: Promise<SiteHeaderDoc>;
  labels: Dictionary["common"]["menu"];
  // Controls the shell places beside the navigation (search, theme toggle).
  actions: ReactNode;
}

interface HeaderPart {
  appName: string;
  header: Promise<SiteHeaderDoc>;
}

const HomeLink = ({ appName, header }: HeaderPart) => {
  const { logo } = use(header);
  if (!isMedia(logo)) {
    return (
      <Link className="font-semibold tracking-tight" href="/">
        {appName}
      </Link>
    );
  }
  return (
    <Link className="font-semibold tracking-tight" href="/">
      <MediaImage className="h-8 w-auto" media={logo} sizes="160px" />
      <span className="sr-only">{appName}</span>
    </Link>
  );
};

interface NavProps {
  header: Promise<SiteHeaderDoc>;
  label: string;
}

const DesktopNav = ({ header, label }: NavProps) => (
  <nav aria-label={label} className="mr-2 hidden md:block">
    <ul className="flex items-center gap-6 text-sm">
      {headerNavLinks(use(header)).map((link) => (
        <li key={link.href}>
          <a
            className="text-muted-foreground transition-colors hover:text-foreground"
            href={link.href}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

interface MobileNavProps {
  header: Promise<SiteHeaderDoc>;
  labels: Dictionary["common"]["menu"];
}

const MobileNav = ({ header, labels }: MobileNavProps) => {
  const links = headerNavLinks(use(header));
  return links.length > 0 ? <MobileMenu labels={labels} links={links} /> : null;
};

// Sticky bar. The shell and the actions are static; each part that reads the
// header global waits in its own Suspense boundary.
export const SiteHeader = ({ appName, header, labels, actions }: SiteHeaderProps) => (
  <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
    <div className="container flex h-16 items-center justify-between gap-6">
      <Suspense fallback={<span className="font-semibold tracking-tight">{appName}</span>}>
        <HomeLink appName={appName} header={header} />
      </Suspense>
      <div className="flex items-center gap-1">
        <Suspense fallback={null}>
          <DesktopNav header={header} label={labels.title} />
        </Suspense>
        {actions}
        <Suspense fallback={null}>
          <MobileNav header={header} labels={labels} />
        </Suspense>
      </div>
    </div>
  </header>
);
