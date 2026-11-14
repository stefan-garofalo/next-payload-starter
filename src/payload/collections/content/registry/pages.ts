import type { CollectionConfig } from "payload"
import { BASE_PAGE_CONFIG } from "@/payload/config/collections"
import { blocksField } from "@/payload/fields/blocks"
import { SlugField } from "@/payload/fields/slug"
import { access } from "@/payload/modules/auth"
import {
  createCollectionAfterChangeRevalidateHook,
  createCollectionAfterDeleteRevalidateHook,
} from "@/payload/modules/revalidation/hooks"
import { HOME_SLUG } from "@/modules/content/routes"

export const Pages: CollectionConfig = {
  ...BASE_PAGE_CONFIG,
  slug: "pages",
  access: {
    ...BASE_PAGE_CONFIG.access,
    create: access.adminOnly,
    update: access.adminOrEditor,
    delete: access.adminOnly,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
  },
  defaultPopulate: { title: true, slug: true },
  hooks: {
    afterChange: [createCollectionAfterChangeRevalidateHook("pages")],
    afterDelete: [createCollectionAfterDeleteRevalidateHook("pages")],
  },
  fields: [
    { name: "title", type: "text", required: true },
    SlugField(`The page address: /about. The home page has «${HOME_SLUG}».`),
    blocksField(),
  ],
}
