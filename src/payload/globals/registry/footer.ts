import type { GlobalConfig } from "payload"
import { LinkField } from "@/payload/fields/link"
import { access } from "@/payload/modules/auth"
import { createGlobalAfterChangeRevalidateHook } from "@/payload/modules/revalidation/hooks"

export const Footer: GlobalConfig = {
  slug: "footer",
  hooks: {
    afterChange: [createGlobalAfterChangeRevalidateHook("footer")],
  },
  access: {
    read: access.publicRead,
    update: access.adminOrEditor,
  },
  fields: [
    { name: "note", type: "text", admin: { description: "One line under the links, for example the legal name." } },
    { name: "links", type: "array", fields: [LinkField("link", "Link")] },
  ],
}
