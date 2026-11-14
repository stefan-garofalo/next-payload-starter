import Image from "next/image";
import { preload } from "react-dom";
import type { Media } from "@/payload-types";
import type { MediaRef } from "./media";
import { isMedia } from "./media";

// Payload's pre-sized WebP variants (media collection), smallest first; the
// thumbnail is admin-only. Sizes wider than the original are not generated.
const SRCSET_SIZES = [
  "smallPhone",
  "largePhone",
  "mobile",
  "laptop",
  "desktop",
  "ultraWide",
] as const;

// One candidate per width: an original as wide as a variant adds nothing.
const srcSetFor = (image: Media): string => {
  const byWidth = new Map<number, string>();
  for (const variant of [...SRCSET_SIZES.map((name) => image.sizes?.[name]), image]) {
    const url = variant?.url;
    const width = variant?.width;
    if (
      url !== null &&
      url !== undefined &&
      width !== null &&
      width !== undefined &&
      !byWidth.has(width)
    ) {
      byWidth.set(width, url);
    }
  }
  return [...byWidth].map(([width, url]) => `${url} ${width}w`).join(", ");
};

interface MediaImageProps {
  media: MediaRef;
  sizes: string;
  className?: string;
  priority?: boolean;
}

// Serves the stored variants as they are (unoptimized): the browser picks one
// from the srcset and loads it from the bucket's CDN, so Vercel never
// transforms or proxies an image.
export const MediaImage = ({ media, sizes, className, priority = false }: MediaImageProps) => {
  if (!isMedia(media)) {
    return null;
  }
  const { url, width, height } = media;
  if (
    url === null ||
    url === undefined ||
    width === null ||
    width === undefined ||
    height === null ||
    height === undefined
  ) {
    return null;
  }
  const srcSet = srcSetFor(media);
  if (priority) {
    preload(url, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
  }
  return (
    <picture className="contents">
      <source sizes={sizes} srcSet={srcSet} />
      <Image
        alt={media.alt}
        className={className}
        fetchPriority={priority ? "high" : undefined}
        height={height}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        src={url}
        unoptimized
        width={width}
      />
    </picture>
  );
};
