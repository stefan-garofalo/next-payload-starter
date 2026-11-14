import Image from "next/image"
import { preload } from "react-dom"
import type { Media } from "@/payload-types"

type MaybeMedia = number | Media | null | undefined

export const asMedia = (value: MaybeMedia): Media | null =>
  value && typeof value === "object" && value.url ? value : null

// Payload's pre-sized WebP variants (media collection), smallest first; the
// thumbnail is admin-only. Sizes wider than the original are not generated.
const SRCSET_SIZES = ["smallPhone", "largePhone", "mobile", "laptop", "desktop", "ultraWide"] as const

// One candidate per width: an original as wide as a variant adds nothing.
const srcSetFor = (image: Media) => {
  const byWidth = new Map<number, string>()
  for (const variant of [...SRCSET_SIZES.map((name) => image.sizes?.[name]), image]) {
    if (variant?.url && variant.width && !byWidth.has(variant.width)) byWidth.set(variant.width, variant.url)
  }
  return [...byWidth].map(([width, url]) => `${url} ${width}w`).join(", ")
}

type MediaImageProps = {
  media: MaybeMedia
  sizes: string
  className?: string
  priority?: boolean
}

// Serves the stored variants as they are (unoptimized): the browser picks one
// from the srcset and loads it from the bucket's CDN, so Vercel never
// transforms or proxies an image.
export function MediaImage({ media, sizes, className, priority }: MediaImageProps) {
  const image = asMedia(media)
  if (!(image?.url && image.width && image.height)) return null
  const srcSet = srcSetFor(image)
  if (priority) preload(image.url, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" })
  return (
    <picture className="contents">
      <source sizes={sizes} srcSet={srcSet} />
      <Image
        alt={image.alt}
        className={className}
        fetchPriority={priority ? "high" : undefined}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        src={image.url}
        unoptimized
        width={image.width}
      />
    </picture>
  )
}
