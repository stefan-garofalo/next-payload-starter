import type { Footer, Header } from "@/payload-types";

export type SiteHeader = Header;
export type SiteFooter = Footer;

export interface NavLink {
  label: string;
  href: string;
}

export const headerNavLinks = (header: SiteHeader): NavLink[] =>
  (header.nav ?? []).map(({ label, href }) => ({ label, href }));

// Footer links with both a label and a target; half-filled rows are skipped.
export const footerLinks = (footer: SiteFooter): (NavLink & { id: string })[] =>
  (footer.links ?? []).flatMap(({ link, id }) => {
    const { label, href } = link ?? {};
    return label !== null &&
      label !== undefined &&
      href !== null &&
      href !== undefined &&
      label !== "" &&
      href !== ""
      ? [{ id: id ?? href, label, href }]
      : [];
  });
