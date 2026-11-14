import { describe, expect, it } from "vitest";
import { publishedScope, ROLES } from "./roles";

describe(publishedScope, () => {
  it("lets admins and editors read drafts", () => {
    expect(publishedScope(ROLES.ADMIN)).toBeTruthy();
    expect(publishedScope(ROLES.EDITOR)).toBeTruthy();
  });

  it("limits contributors and visitors to published content", () => {
    const publishedOnly = { _status: { equals: "published" } };
    expect(publishedScope(ROLES.CONTRIBUTOR)).toStrictEqual(publishedOnly);
    expect(publishedScope()).toStrictEqual(publishedOnly);
  });
});
