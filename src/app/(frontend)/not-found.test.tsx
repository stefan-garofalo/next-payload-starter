import assert from "node:assert/strict"
import test from "node:test"
import { renderToStaticMarkup } from "react-dom/server"
import { SITE_LANG } from "@/modules/i18n/config"
import { getGlobalDictionary } from "@/modules/i18n/lib/getters"
import NotFound from "./not-found"

test("the 404 page says the page is missing and links home", () => {
  const { notFound } = getGlobalDictionary(SITE_LANG)
  const html = renderToStaticMarkup(<NotFound />)
  assert.match(html, new RegExp(`<h1[^>]*>${notFound.heading}</h1>`))
  assert.match(html, new RegExp(`<a[^>]*href="/"[^>]*>${notFound.home}</a>`))
})
