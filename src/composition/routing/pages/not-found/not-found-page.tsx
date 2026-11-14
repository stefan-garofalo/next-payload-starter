import type { Metadata } from "next";
import { env } from "@/env";
import { getDictionary, SITE_LANG } from "@/modules/i18n";
import { ButtonLink } from "@/ui/button-link";

const { notFound } = getDictionary(SITE_LANG);

export const notFoundMetadata: Metadata = {
  title: `${notFound.title} · ${env.NEXT_PUBLIC_APP_NAME}`,
};

export const NotFoundPage = () => (
  <section className="container py-24 md:py-32">
    <p aria-hidden className="font-mono text-muted-foreground text-sm">
      404
    </p>
    <h1 className="mt-4 text-balance font-semibold text-4xl tracking-tight">{notFound.heading}</h1>
    <ButtonLink className="mt-8" href="/">
      {notFound.home}
    </ButtonLink>
  </section>
);
