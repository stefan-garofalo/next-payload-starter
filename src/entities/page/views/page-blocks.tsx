import { ContentBlock } from "./content-block";
import { HeroBlock } from "./hero-block";
import type { AnyBlock, PageDoc } from "./types";

interface RenderBlockProps {
  block: AnyBlock;
  first: boolean;
}

const RenderBlock = ({ block, first }: RenderBlockProps) => {
  switch (block.blockType) {
    case "hero": {
      return <HeroBlock block={block} first={first} />;
    }
    case "content": {
      return <ContentBlock block={block} first={first} />;
    }
    default: {
      return null;
    }
  }
};

interface PageBlocksProps {
  page: PageDoc;
}

// A page is its blocks, top to bottom.
export const PageBlocks = ({ page }: PageBlocksProps) =>
  (page.blocks ?? []).map((block, index) => (
    <RenderBlock
      block={block}
      first={index === 0}
      key={block.id ?? `${block.blockType}-${index}`}
    />
  ));
