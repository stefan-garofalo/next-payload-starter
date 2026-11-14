import type { TextField } from "payload"
import { toKebabFilename } from "../validators/media"

const toSlug = (value: string) => toKebabFilename(value).replace(/\./g, "-")

// A unique URL slug in the sidebar, generated from the title when left empty.
export const SlugField = (description: string): TextField => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: { position: "sidebar", description },
  hooks: {
    beforeValidate: [
      ({ value, data }) =>
        typeof value === "string" && value.length > 0
          ? toSlug(value)
          : typeof data?.title === "string"
            ? toSlug(data.title)
            : value,
    ],
  },
})
