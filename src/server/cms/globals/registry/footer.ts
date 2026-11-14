import type { GlobalConfig } from "payload";
import { LinkField } from "@/server/cms/fields/link";
import { access } from "@/server/cms/access";
import { createGlobalAfterChangeRevalidateHook } from "@/server/cms/revalidation-hooks";

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
    {
      name: "note",
      type: "text",
      admin: { description: "One line under the links, for example the legal name." },
    },
    { name: "links", type: "array", fields: [LinkField("link", "Link")] },
  ],
};
