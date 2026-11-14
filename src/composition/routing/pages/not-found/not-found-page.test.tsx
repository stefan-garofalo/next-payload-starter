import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getDictionary, SITE_LANG } from "@/modules/i18n";
import { NotFoundPage } from "./not-found-page";

describe(NotFoundPage, () => {
  it("says the page is missing and links home", () => {
    const { notFound } = getDictionary(SITE_LANG);
    const html = renderToStaticMarkup(<NotFoundPage />);
    expect(html).toContain(`>${notFound.heading}</h1>`);
    expect(html).toMatch(new RegExp(`<a[^>]*href="/"[^>]*>${notFound.home}</a>`, "u"));
  });
});
