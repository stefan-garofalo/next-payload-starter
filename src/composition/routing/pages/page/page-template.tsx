import type { Metadata } from "next";
import { Suspense, use } from "react";
import type { PageDoc } from "@/entities/page";
import { PageBlocks } from "@/entities/page";
import { env } from "@/env";
import { pagePath } from "@/server/pages";
import { Missing, notFoundMetadata } from "../not-found";

interface PageContentProps {
  page: Promise<PageDoc | null>;
}

const PageContent = ({ page }: PageContentProps) => {
  const doc = use(page);
  return doc ? <PageBlocks page={doc} /> : <Missing />;
};

// A page's blocks, or the 404 page when no published page has the slug. The
// read is cached, so the prerendered HTML already holds the content.
export const PageTemplate = ({ page }: PageContentProps) => (
  <Suspense fallback={null}>
    <PageContent page={page} />
  </Suspense>
);

// SEO fields from Payload (plugin-seo), else the page title.
export const pageMetadata = (page: PageDoc | null): Metadata =>
  page
    ? {
        alternates: { canonical: pagePath(page.slug) },
        title: page.meta?.title ?? `${page.title} · ${env.NEXT_PUBLIC_APP_NAME}`,
        description: page.meta?.description ?? undefined,
      }
    : notFoundMetadata;
