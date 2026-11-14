import type { GroupField } from "payload"

// Site links are paths ("/about"), anchors ("/#contact") or absolute URLs; no
// relationship to a document, so a link survives any page change.
const LINK_PATTERN = /^(\/|#|https:\/\/|mailto:|tel:)/

export const validateHref = (value: string | null | undefined): true | string =>
  !value || LINK_PATTERN.test(value) || "Use a path (/about), an anchor (/#contact) or an https:// address"

// A label and where it goes.
export const LinkField = (name: string, label: string, admin: GroupField["admin"] = {}): GroupField => ({
  name,
  label,
  type: "group",
  admin: { hideGutter: true, ...admin },
  fields: [
    {
      type: "row",
      fields: [
        { name: "label", type: "text" },
        {
          name: "href",
          type: "text",
          validate: validateHref,
          admin: { description: "/about, /#contact, https://…" },
        },
      ],
    },
  ],
})
