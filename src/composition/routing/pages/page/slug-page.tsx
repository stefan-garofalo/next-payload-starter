import type { Metadata } from "next";
import { getPageBySlug, getPublishedPages } from "@/entities/page/remote/server";
import { atLeastOneSlug, HOME_SLUG } from "@/server/pages";
import { PageTemplate, pageMetadata } from "./page-template";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

// Every published page is prerendered (/about, /contact…). A page published
// after the build is generated on its first request, then served static;
// Payload hooks invalidate its tags, so only the touched pages regenerate.
// "/home" redirects to "/" in next.config.ts.
export const generateSlugParams = async (): Promise<{ slug: string }[]> => {
  const pages = await getPublishedPages();
  return atLeastOneSlug(pages.flatMap((page) => (page.slug === HOME_SLUG ? [] : [page.slug])));
};

export const generateSlugMetadata = async ({ params }: SlugPageProps): Promise<Metadata> => {
  const { slug } = await params;
  return pageMetadata(await getPageBySlug(slug));
};

const pageFor = async (params: SlugPageProps["params"]) => {
  const { slug } = await params;
  return await getPageBySlug(slug);
};

export const SlugPage = ({ params }: SlugPageProps) => <PageTemplate page={pageFor(params)} />;
