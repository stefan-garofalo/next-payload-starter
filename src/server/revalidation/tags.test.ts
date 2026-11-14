import { describe, expect, it } from "vitest";
import { globalTag, isContentTag, MEDIA_TAG, mediaTags, tagsForDoc, tagsForMedia } from "./tags";

describe(tagsForDoc, () => {
  it("refreshes the route at the slug, the route that served the document, and the lists", () => {
    expect(tagsForDoc("pages", { id: 1, slug: "home" })).toStrictEqual([
      "page:home",
      "page-id:1",
      "pages",
    ]);
  });

  // Unpublishing, trashing or renaming a slug in a draft: the route that served
  // the published document carries its id tag, whatever slug it now has.
  it("keeps the id tag when the slug is missing", () => {
    expect(tagsForDoc("pages", { id: 9, slug: null })).toStrictEqual(["page-id:9", "pages"]);
  });
});

describe(mediaTags, () => {
  it("gives one tag per image, once each", () => {
    expect(mediaTags([3, 7, 3])).toStrictEqual(["media:3", "media:7"]);
    expect(mediaTags([])).toStrictEqual([]);
  });

  it("falls back to the shared media tag past the cap", () => {
    const many = Array.from({ length: 65 }, (_, index) => index + 1);
    expect(mediaTags(many)).toStrictEqual([MEDIA_TAG]);
    expect(mediaTags(many.slice(0, 64))).toHaveLength(64);
  });
});

describe(tagsForMedia, () => {
  it("refreshes the image's entries and the shared media tag", () => {
    expect(tagsForMedia(12)).toStrictEqual(["media:12", "media"]);
  });
});

describe(isContentTag, () => {
  it.each([
    globalTag("header"),
    globalTag("footer"),
    "pages",
    "media",
    "page:home",
    "page:about-us",
    "page-id:3",
    "media:42",
  ])("accepts %s", (tag) => {
    expect(isContentTag(tag)).toBeTruthy();
  });

  it.each([
    "global:home",
    "global:socials",
    "posts",
    "post:intro",
    "page:",
    "page-id:x",
    "media:abc",
    "media:",
    "/",
    "page:1;drop",
  ])("rejects %s", (tag) => {
    expect(isContentTag(tag)).toBeFalsy();
  });
});
