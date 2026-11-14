import type { Block } from "payload";
import { LinkField } from "../fields/link";
import { ImageField } from "../fields/section";

// The page opening: the h1, a short intro, up to two links and one image.
export const Hero: Block = {
  slug: "hero",
  interfaceName: "HeroBlock",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea" },
    {
      name: "links",
      type: "array",
      maxRows: 2,
      admin: { description: "The first link is the primary button." },
      fields: [LinkField("link", "Link")],
    },
    ImageField("image", "Image"),
  ],
};
