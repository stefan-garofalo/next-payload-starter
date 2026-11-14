import { Suspense, use } from "react";
import type { SiteFooter as SiteFooterDoc } from "@/entities/site";
import { footerLinks } from "@/entities/site";

interface SiteFooterProps {
  appName: string;
  footer: Promise<SiteFooterDoc>;
}

const FooterContent = ({ appName, footer }: SiteFooterProps) => {
  const doc = use(footer);
  const links = footerLinks(doc);
  return (
    <>
      <p>{doc.note ?? appName}</p>
      {links.length > 0 ? (
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.id}>
              <a className="hover:text-foreground" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export const SiteFooter = ({ appName, footer }: SiteFooterProps) => (
  <footer className="border-t">
    <div className="container flex flex-col gap-4 py-8 text-muted-foreground text-sm md:flex-row md:items-center md:justify-between">
      <Suspense fallback={<p>{appName}</p>}>
        <FooterContent appName={appName} footer={footer} />
      </Suspense>
    </div>
  </footer>
);
