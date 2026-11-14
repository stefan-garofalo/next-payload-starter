import type { Block } from "payload"
import { SimpleRichTextField } from "../fields/richtext-simple"
import { AnchorField } from "../fields/section"

// A text section: an optional heading and a rich text body.
export const Content: Block = {
  slug: "content",
  interfaceName: "ContentBlock",
  fields: [AnchorField, { name: "title", type: "text" }, SimpleRichTextField("body", { required: true })],
}
