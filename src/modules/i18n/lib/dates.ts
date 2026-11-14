import { LOCALES } from "../config"
import type { Lang } from "../types"

export const PAYLOAD_LOCAL_TIME_ZONE = "Europe/Rome"

export function getLocalizedDateFormatter(
  lang: Lang,
  options?: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const locale = LOCALES[lang]
  return new Intl.DateTimeFormat(locale, options)
}

export function getLocalizedPayloadTimeFormatter(
  lang: Lang,
  options?: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  return getLocalizedDateFormatter(lang, {
    ...options,
    timeZone: PAYLOAD_LOCAL_TIME_ZONE,
  })
}
