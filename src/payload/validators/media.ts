import type { UploadFieldValidation } from "payload"
import type { Media } from "@/payload-types"

const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g
const LEADING_TRAILING_DASH_REGEX = /^-+|-+$/g
const MULTI_DASH_REGEX = /-+/g
const COMBINING_MARKS_REGEX = /[\u0300-\u036f]/g

const toKebabToken = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(COMBINING_MARKS_REGEX, "")
    .toLowerCase()
    .replace(NON_ALPHANUMERIC_REGEX, "-")
    .replace(MULTI_DASH_REGEX, "-")
    .replace(LEADING_TRAILING_DASH_REGEX, "")

export const toKebabFilename = (filename: string): string => {
  const trimmed = String(filename ?? "").trim()
  if (!trimmed) return "file"

  const lastDotIndex = trimmed.lastIndexOf(".")
  const hasExtension = lastDotIndex > 0 && lastDotIndex < trimmed.length - 1
  const rawName = hasExtension ? trimmed.slice(0, lastDotIndex) : trimmed
  const rawExtension = hasExtension ? trimmed.slice(lastDotIndex + 1) : ""

  const name = toKebabToken(rawName) || "file"
  const extension = toKebabToken(rawExtension)

  return extension ? `${name}.${extension}` : name
}

export const isImage: UploadFieldValidation = (value) => {
  if (!value) return true
  return (
    (value as Media).mimeType?.includes("image") ||
    "Only images are allowed"
  )
}

export const isVideo: UploadFieldValidation = (value) => {
  if (!value) return true
  return (
    (value as Media).mimeType?.includes("video") ||
    "Only videos are allowed"
  )
}
