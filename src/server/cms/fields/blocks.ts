import type { BlocksField } from "payload";
import { Content } from "../blocks/content";
import { Hero } from "../blocks/hero";

export const blocksField = (name = "blocks"): BlocksField => ({
  name,
  type: "blocks",
  admin: { description: "The page, top to bottom." },
  blocks: [Hero, Content],
});
