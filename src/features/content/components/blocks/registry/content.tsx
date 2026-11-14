import { RichText } from "@payloadcms/richtext-lexical/react"
import type { BlockProps } from "../types"

// A text section. Opening the page, its title is the h1.
export function ContentBlock({ block, first }: BlockProps<"content">) {
  const Heading = first ? "h1" : "h2"
  return (
    <section className="container py-12 md:py-16" id={block.anchor ?? undefined}>
      {block.title ? (
        <Heading className="text-balance font-semibold text-3xl tracking-tight">{block.title}</Heading>
      ) : null}
      <RichText
        className="mt-6 grid max-w-prose gap-4 text-muted-foreground [&_a]:underline [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:text-xl [&_strong]:text-foreground"
        data={block.body}
      />
    </section>
  )
}
