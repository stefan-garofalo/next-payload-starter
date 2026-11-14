import {
  BoldFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical"
import type { RichTextField } from "payload"

/**
 * Simple richText field configuration with limited formatting options.
 * Includes: bold, italic, underline, strikethrough, h2 only, links, lists
 * Excludes: multiple headings, checklists, indentation, code blocks
 */
export const simpleRichTextEditor = lexicalEditor({
  features: () => [
    // Paragraph (required)
    ParagraphFeature(),

    // Single heading level (h2 only)
    HeadingFeature({
      enabledHeadingSizes: ["h2"],
    }),

    // Text formatting
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SuperscriptFeature(),
    SubscriptFeature(),

    // Links
    LinkFeature({
      enabledCollections: [],
    }),

    // Lists (no checklists)
    UnorderedListFeature(),
    OrderedListFeature(),

    // Inline toolbar - enables text selection formatting menu
    InlineToolbarFeature(),

    // Explicitly omitted:
    // - ChecklistFeature() - checklist removed
    // - IndentFeature() - nested indentation removed
    // - CodeFeature() - inline code removed
    // - CodeBlockFeature() - code blocks removed
  ],
})

/**
 * Helper to create a simple richText field with standard configuration
 */
export function SimpleRichTextField(
  name: string,
  overrides?: Partial<RichTextField>
): RichTextField {
  return {
    name,
    type: "richText",
    editor: simpleRichTextEditor,
    ...overrides,
  }
}
