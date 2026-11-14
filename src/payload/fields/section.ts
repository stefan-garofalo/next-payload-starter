import type { Condition, Field, UploadField } from "payload"

// The id menu links point to ("/#about"); kebab-case, no "#".
export const AnchorField: Field = {
  name: "anchor",
  type: "text",
  validate: (value: string | null | undefined) =>
    !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || "Use lowercase letters, numbers and dashes only",
  admin: { description: "Menu links and buttons point here (/#about)." },
}

export const ImageField = (name: string, label: string, condition?: Condition): UploadField => ({
  name,
  label,
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image" } },
  admin: { condition },
})
