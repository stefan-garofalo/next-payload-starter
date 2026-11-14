import type { Metadata } from "next"
import { env } from "@/env"
import { SITE_LANG } from "@/modules/i18n/config"
import { getGlobalDictionary } from "@/modules/i18n/lib/getters"
import { ButtonLink } from "@/modules/ui/primitives/button-link"

const { notFound } = getGlobalDictionary(SITE_LANG)

export const metadata: Metadata = { title: `${notFound.title} · ${env.NEXT_PUBLIC_APP_NAME}` }

export default function NotFound() {
  return (
    <section className="container py-24 md:py-32">
      <p aria-hidden className="font-mono text-muted-foreground text-sm">
        404
      </p>
      <h1 className="mt-4 text-balance font-semibold text-4xl tracking-tight">{notFound.heading}</h1>
      <ButtonLink className="mt-8" href="/">
        {notFound.home}
      </ButtonLink>
    </section>
  )
}
