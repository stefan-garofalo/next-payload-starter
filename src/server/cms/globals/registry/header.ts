import type { GlobalConfig } from "payload";
import { validateHref } from "@/server/cms/fields/link";
import { access } from "@/server/cms/access";
import { createGlobalAfterChangeRevalidateHook } from "@/server/cms/revalidation-hooks";

export const Header: GlobalConfig = {
  slug: "header",
  hooks: {
    afterChange: [createGlobalAfterChangeRevalidateHook("header")],
  },
  access: {
    read: access.publicRead,
    update: access.adminOrEditor,
  },
  fields: [
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      admin: { description: "Optional: without a logo the site shows its name as text." },
    },
    {
      name: "nav",
      type: "array",
      admin: { description: "Pages (/about) and home sections (/#contact), in order." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true, validate: validateHref },
          ],
        },
      ],
    },
  ],
};
