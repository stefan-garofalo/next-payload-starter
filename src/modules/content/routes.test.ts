import assert from "node:assert/strict"
import test from "node:test"
import { atLeastOneSlug, HOME_SLUG, pagePath } from "./routes"

test("the home page lives at /, every other page at /<slug>", () => {
  assert.equal(pagePath(HOME_SLUG), "/")
  assert.equal(pagePath("about"), "/about")
})

// Cache Components fails the build on an empty generateStaticParams.
test("atLeastOneSlug keeps the published slugs, or prerenders one placeholder", () => {
  assert.deepEqual(atLeastOneSlug(["about", "contact"]), [{ slug: "about" }, { slug: "contact" }])
  assert.equal(atLeastOneSlug([]).length, 1)
})
