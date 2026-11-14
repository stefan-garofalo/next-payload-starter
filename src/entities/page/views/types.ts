import type { Page } from "@/payload-types";

export type PageDoc = Page;
export type AnyBlock = NonNullable<Page["blocks"]>[number];
export type BlockType = AnyBlock["blockType"];
export type BlockByType<T extends BlockType> = Extract<AnyBlock, { blockType: T }>;

// What the page tells each block: whether it opens the page, in which case
// its title is the h1.
export interface BlockProps<T extends BlockType> {
  block: BlockByType<T>;
  first: boolean;
}
