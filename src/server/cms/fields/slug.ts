import type { FieldHook, TextField } from "payload";
import type { Page } from "@/payload-types";
import { toKebabFilename } from "../validators/media";

const toSlug = (value: string): string => toKebabFilename(value).replaceAll(".", "-");

// The typed slug, else one from the title, else nothing (required fails).
const slugFromTitle: FieldHook<Page, string | null | undefined> = ({ value, data }) => {
  if (value !== null && value !== undefined && value !== "") {
    return toSlug(value);
  }
  const title = data?.title;
  return title === null || title === undefined || title === "" ? value : toSlug(title);
};

// A unique URL slug in the sidebar, generated from the title when left empty.
export const SlugField = (description: string): TextField => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: { position: "sidebar", description },
  hooks: { beforeValidate: [slugFromTitle] },
});
