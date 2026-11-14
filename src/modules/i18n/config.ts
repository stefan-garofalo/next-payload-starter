import type { Dictionary } from "./dictionaries/en";
import { en } from "./dictionaries/en";
import { it } from "./dictionaries/it";

const DICTIONARIES = { en, it } as const satisfies Record<string, Dictionary>;

export type Lang = keyof typeof DICTIONARIES;

export const LOCALES = { en: "en-US", it: "it-IT" } as const satisfies Record<Lang, string>;

// The language of the public site: <html lang> and every UI string. The site
// has no locale routing; switch this to "it" for an Italian site.
export const SITE_LANG: Lang = "en";

export const getDictionary = (lang: Lang): Dictionary => DICTIONARIES[lang];
