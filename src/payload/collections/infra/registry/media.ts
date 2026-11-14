import type { CollectionAfterReadHook, CollectionBeforeOperationHook, CollectionConfig } from "payload"
import { env } from "@/env"
import type { Media as MediaDoc } from "@/payload-types"
import { access } from "@/payload/modules/auth"
import { mediaAfterChangeRevalidateHook, mediaAfterDeleteRevalidateHook } from "@/payload/modules/revalidation/hooks"
import { toKebabFilename } from "@/payload/validators/media"

const normalizeFilenameForUpload: CollectionBeforeOperationHook<"media"> = (
  hookArgs
) => {
  if (!(hookArgs.operation === "create" || hookArgs.operation === "update")) {
    return hookArgs.args
  }

  const args = hookArgs.args as Record<string, unknown>
  const rawFile = args.file
  if (!rawFile || typeof rawFile !== "object") return hookArgs.args

  const file = rawFile as { name?: string }
  if (typeof file.name !== "string" || file.name.length === 0) {
    return hookArgs.args
  }

  const normalizedFilename = toKebabFilename(file.name)
  if (!normalizedFilename || normalizedFilename === file.name) {
    return hookArgs.args
  }

  args.file = {
    ...file,
    name: normalizedFilename,
  }

  if (hookArgs.req.file && typeof hookArgs.req.file === "object") {
    const reqFile = hookArgs.req.file as { name?: string }
    reqFile.name = normalizedFilename
  }

  if (args.data && typeof args.data === "object") {
    const data = args.data as { filename?: string }
    data.filename = normalizedFilename
  }

  return hookArgs.args
}

// Every file URL carries the document's last change ("?v=…"), so a replaced
// file gets a new URL and caches (browser, Cloudflare) can keep each URL forever.
const versionFileUrls: CollectionAfterReadHook<MediaDoc> = ({ doc }) => {
  const version = doc.updatedAt ? Date.parse(doc.updatedAt).toString(36) : null
  if (!version) return doc
  const versioned = (url?: string | null) => (url && !url.includes("?") ? `${url}?v=${version}` : url)
  doc.url = versioned(doc.url)
  for (const size of Object.values(doc.sizes ?? {})) if (size) size.url = versioned(size.url)
  return doc
}

// A stored file's public URL. With R2 (payload.config.ts) the bucket's domain
// serves it, never Vercel: Payload's /api/media/file route reads R2 only for a
// browser upload in progress (disablePayloadAccessControl). Without R2 the file
// sits on local disk behind that route. `folders` are the object's prefix and
// `_objectKey`, the folder R2 keeps each browser upload in.
export const mediaFileURL = (filename: string, ...folders: Array<string | null | undefined>) =>
  env.NEXT_PUBLIC_MEDIA_BASE_URL
    ? `${env.NEXT_PUBLIC_MEDIA_BASE_URL}/${[...folders, encodeURIComponent(filename)].filter(Boolean).join("/")}`
    : `/api/media/file/${encodeURIComponent(filename)}`

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "System",
    defaultColumns: ["filename", "mimeType", "filesize", "updatedAt"],
  },
  access: {
    read: () => true, // Public read access for media
    create: access.adminOrEditor, // Only editors and admins can upload
    update: access.authenticated, // Only admins and editors can update metadata
    delete: access.adminOnly, // Only admins can delete media
    readVersions: access.authenticated,
  },
  hooks: {
    beforeOperation: [normalizeFilenameForUpload],
    afterRead: [versionFileUrls],
    afterChange: [mediaAfterChangeRevalidateHook],
    afterDelete: [mediaAfterDeleteRevalidateHook],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "textarea",
    },
  ],
  upload: {
    // The admin's thumbnail at the same address as every other size: a size
    // name here would point it at /api/media/file, which does not serve R2.
    adminThumbnail: ({ doc }) => {
      const { _objectKey, prefix, sizes } = doc as Pick<MediaDoc, "_objectKey" | "prefix" | "sizes">
      const filename = sizes?.thumbnail?.filename
      return filename ? mediaFileURL(filename, prefix, _objectKey) : null
    },
    // Image optimization settings
    imageSizes: [
      {
        name: "thumbnail",
        width: 100,
        height: 100,
        formatOptions: { format: "webp" },
      },
      {
        name: "smallPhone",
        width: 320,
        formatOptions: { format: "webp" },
      },
      {
        name: "largePhone",
        width: 480,
        formatOptions: { format: "webp" },
      },
      {
        name: "mobile",
        width: 960,
        formatOptions: { format: "webp" },
      },
      {
        name: "laptop",
        width: 1280,
        formatOptions: { format: "webp" },
      },
      {
        name: "desktop",
        width: 1920,
        formatOptions: { format: "webp" },
      },
      {
        name: "ultraWide",
        width: 2560,
        formatOptions: { format: "webp" },
      },
    ],
    // File format restrictions
    formatOptions: {
      format: "webp",
    },
    // MIME type restrictions
    mimeTypes: ["image/*", "video/*", "audio/*", "application/pdf"],
  },
}
