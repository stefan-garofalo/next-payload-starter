import { MediaImage } from "@/integrations/payload";
import { ButtonLink } from "@/ui/button-link";
import type { BlockProps } from "./types";

// The page opening: the h1, its intro, up to two links, an optional image.
export const HeroBlock = ({ block }: BlockProps<"hero">) => {
  const links = (block.links ?? []).flatMap(({ link }) => {
    const { label, href } = link ?? {};
    return label !== null &&
      label !== undefined &&
      href !== null &&
      href !== undefined &&
      label !== "" &&
      href !== ""
      ? [{ label, href }]
      : [];
  });

  return (
    <section className="container grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
      <div>
        <h1 className="text-balance font-semibold text-4xl tracking-tight md:text-5xl">
          {block.title}
        </h1>
        {block.body !== null && block.body !== undefined && block.body !== "" ? (
          <p className="mt-6 max-w-prose text-lg text-muted-foreground">{block.body}</p>
        ) : null}
        {links.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {links.map((link, index) => (
              <ButtonLink
                href={link.href}
                key={link.href}
                size="lg"
                variant={index === 0 ? "default" : "outline"}
              >
                {link.label}
              </ButtonLink>
            ))}
          </div>
        ) : null}
      </div>
      <MediaImage
        className="h-auto w-full rounded-xl"
        media={block.image}
        priority
        sizes="(min-width: 768px) 50vw, 100vw"
      />
    </section>
  );
};
