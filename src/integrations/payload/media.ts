import type { Media } from "@/payload-types";

// An upload field holds the related document when the read populated it
// (depth ≥ 1), else only its numeric id.
export type MediaRef = number | Media | null | undefined;

export const isMedia = (value: MediaRef): value is Media =>
  value !== null && value !== undefined && !Number.isFinite(value);
