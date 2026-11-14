import type { BlocksField } from "payload"
import { Content, Hero } from "../blocks"

export const blocksField = (name = "blocks"): BlocksField => ({
  name,
  type: "blocks",
  admin: { description: "The page, top to bottom." },
  blocks: [Hero, Content],
})
