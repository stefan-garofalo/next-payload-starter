const NON_ALPHANUMERIC = /[^a-z0-9]+/gu;
const EDGE_DASHES = /^-+|-+$/gu;
const REPEATED_DASHES = /-+/gu;
const COMBINING_MARKS = /[̀-ͯ]/gu;

const toKebabToken = (value: string): string =>
  value
    .normalize("NFKD")
    .replaceAll(COMBINING_MARKS, "")
    .toLowerCase()
    .replaceAll(NON_ALPHANUMERIC, "-")
    .replaceAll(REPEATED_DASHES, "-")
    .replaceAll(EDGE_DASHES, "");

// "Été Photo.JPG" → "ete-photo.jpg": URL-safe upload names and slugs.
export const toKebabFilename = (filename: string): string => {
  const trimmed = filename.trim();
  if (trimmed === "") {
    return "file";
  }
  const lastDot = trimmed.lastIndexOf(".");
  const hasExtension = lastDot > 0 && lastDot < trimmed.length - 1;
  const name = toKebabToken(hasExtension ? trimmed.slice(0, lastDot) : trimmed) || "file";
  const extension = hasExtension ? toKebabToken(trimmed.slice(lastDot + 1)) : "";
  return extension === "" ? name : `${name}.${extension}`;
};
