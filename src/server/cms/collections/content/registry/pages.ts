import type { CollectionConfig } from "payload";
import { BASE_PAGE_CONFIG } from "@/server/cms/config/collections";
import { blocksField } from "@/server/cms/fields/blocks";
import { SlugField } from "@/server/cms/fields/slug";
import { access } from "@/server/cms/access";
import {
  createCollectionAfterChangeRevalidateHook,
  createCollectionAfterDeleteRevalidateHook,
} from "@/server/cms/revalidation-hooks";
import { HOME_SLUG } from "@/server/pages";

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
};
