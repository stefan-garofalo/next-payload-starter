import assert from "node:assert/strict"
import test from "node:test"
import { globalTag, isContentTag, MEDIA_TAG, mediaTags, tagsForDoc, tagsForMedia } from "./tags"

test("tagsForDoc refreshes the route at the slug, the route that served the document, and the lists", () => {
  assert.deepEqual(tagsForDoc("pages", { id: 1, slug: "home" }), ["page:home", "page-id:1", "pages"])
})

// Unpublishing, trashing or renaming a slug in a draft: the route that served
// the published document carries its id tag, whatever slug it now has.
test("tagsForDoc keeps the id tag when the slug is missing", () => {
  assert.deepEqual(tagsForDoc("pages", { id: 9, slug: null }), ["page-id:9", "pages"])
})

test("mediaTags gives one tag per image, once each", () => {
  assert.deepEqual(mediaTags([3, 7, 3]), ["media:3", "media:7"])
  assert.deepEqual(mediaTags([]), [])
})

test("mediaTags falls back to the shared media tag past the cap", () => {
  const many = Array.from({ length: 65 }, (_, index) => index + 1)
  assert.deepEqual(mediaTags(many), [MEDIA_TAG])
  assert.equal(mediaTags(many.slice(0, 64)).length, 64)
})

test("tagsForMedia refreshes the image's entries and the shared media tag", () => {
  assert.deepEqual(tagsForMedia(12), ["media:12", "media"])
})

test("isContentTag accepts only known tag shapes", () => {
  for (const tag of [
    globalTag("header"),
    globalTag("footer"),
    "pages",
    "media",
    "page:home",
    "page:about-us",
    "page-id:3",
    "media:42",
  ]) {
    assert.equal(isContentTag(tag), true, tag)
  }
  for (const tag of ["global:home", "global:other", "global:socials", "posts", "post:intro", "page:", "page-id:x", "media:abc", "media:", "/", 3, "page:1;drop"]) {
    assert.equal(isContentTag(tag), false, String(tag))
  }
})
