import { describe, expect, it } from "vitest";
import { atLeastOneSlug, HOME_SLUG, pagePath } from "./routes";

describe(pagePath, () => {
  it("serves the home page at / and every other page at /<slug>", () => {
    expect(pagePath(HOME_SLUG)).toBe("/");
    expect(pagePath("about")).toBe("/about");
  });
});

// Cache Components fails the build on an empty generateStaticParams.
describe(atLeastOneSlug, () => {
  it("keeps the published slugs, or prerenders one placeholder", () => {
    expect(atLeastOneSlug(["about", "contact"])).toStrictEqual([
      { slug: "about" },
      { slug: "contact" },
    ]);
    expect(atLeastOneSlug([])).toHaveLength(1);
  });
});
