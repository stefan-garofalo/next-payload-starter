import en from "@/modules/i18n/dict/en"
import it from "@/modules/i18n/dict/it"
import type { Lang } from "../types"

export const LANGS = {
  en,
  it,
}

export const LOCALES: Record<Lang, Intl.LocalesArgument> = {
  en: "en-US",
  it: "it-IT",
} as const

export const LOCALE_LIST = Object.keys(LOCALES) as Lang[]
export const FALLBACK_LOCALE: Lang = "en"

// The language of the public site: <html lang> and every UI string. The site
// has no locale routing; switch this to "it" for an Italian site.
export const SITE_LANG: Lang = "en"
