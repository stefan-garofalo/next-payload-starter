import { ContentBlock } from "./registry/content"
import { HeroBlock } from "./registry/hero"
import type { AnyBlock, BlockContext } from "./types"

function RenderBlock({ block, ...context }: { block: AnyBlock } & BlockContext) {
  switch (block.blockType) {
    case "hero":
      return <HeroBlock block={block} />
    case "content":
      return <ContentBlock block={block} {...context} />
    default:
      return null
  }
}

export function RenderBlocks({ blocks }: { blocks: AnyBlock[] }) {
  return blocks.map((block, index) => (
    <RenderBlock block={block} first={index === 0} key={block.id ?? `${block.blockType}-${index}`} />
  ))
}
