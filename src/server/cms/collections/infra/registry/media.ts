import type {
  CollectionAfterReadHook,
  CollectionBeforeOperationHook,
  CollectionConfig,
} from "payload";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { env } from "@/env";
import type { Media as MediaDoc } from "@/payload-types";
import { access } from "@/server/cms/access";
import {
  mediaAfterChangeRevalidateHook,
  mediaAfterDeleteRevalidateHook,
} from "@/server/cms/revalidation-hooks";
import { toKebabFilename } from "@/server/cms/validators/media";

// Upload names become kebab-case ("Été Photo.JPG" → "ete-photo.jpg") before
// Payload stores them: Payload reads the file from req.file in every API, and
// names the stored object before beforeValidate, so this runs before the operation.
/* oxlint-disable typescript/no-deprecated -- the arg union keeps Payload's deprecated "read" member; only create and update are handled */
const normalizeFilenameForUpload: CollectionBeforeOperationHook<"media"> = ({
  args,
  operation,
  req,
}) => {
  if ((operation === "create" || operation === "update") && req.file !== undefined) {
    const filename = toKebabFilename(req.file.name);
    req.file.name = filename;
    if ("data" in args && args.data !== undefined) {
      args.data.filename = filename;
    }
  }
  return args;
};
/* oxlint-enable typescript/no-deprecated */

// Every file URL carries the document's last change ("?v=…"), so a replaced
// file gets a new URL and caches (browser, Cloudflare) can keep each URL forever.
const versionFileUrls: CollectionAfterReadHook<MediaDoc> = ({ doc }) => {
  const version = Date.parse(doc.updatedAt).toString(36);
  const versioned = (url: string | null | undefined) =>
    url !== null && url !== undefined && !url.includes("?") ? `${url}?v=${version}` : url;
  doc.url = versioned(doc.url);
  for (const size of Object.values(doc.sizes ?? {})) {
    size.url = versioned(size.url);
  }
  return doc;
};

// The fields adminThumbnail reads from Payload's untyped document.
const OptionalString = Schema.optional(Schema.NullOr(Schema.String));
const decodeThumbnailDoc = Schema.decodeUnknownOption(
  Schema.Struct({
    _objectKey: OptionalString,
    prefix: OptionalString,
    sizes: Schema.Struct({ thumbnail: Schema.Struct({ filename: Schema.String }) }),
  }),
);

// A stored file's public URL. With R2 (payload.config.ts) the bucket's domain
// serves it, never Vercel: Payload's /api/media/file route reads R2 only for a
// browser upload in progress (disablePayloadAccessControl). Without R2 the file
// sits on local disk behind that route. `folders` are the object's prefix and
// `_objectKey`, the folder R2 keeps each browser upload in.
export const mediaFileURL = (
  filename: string,
  ...folders: (string | null | undefined)[]
): string => {
  const base = env.NEXT_PUBLIC_MEDIA_BASE_URL;
  if (base === undefined) {
    return `/api/media/file/${encodeURIComponent(filename)}`;
  }
  const path = [...folders, encodeURIComponent(filename)].filter(
    (part) => part !== null && part !== undefined && part !== "",
  );
  return `${base}/${path.join("/")}`;
};

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "System",
    defaultColumns: ["filename", "mimeType", "filesize", "updatedAt"],
  },
  access: {
    // Anyone reads media; editors and admins upload; only admins delete.
    read: access.publicRead,
    create: access.adminOrEditor,
    update: access.authenticated,
    delete: access.adminOnly,
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
    adminThumbnail: ({ doc }) =>
      Option.match(decodeThumbnailDoc(doc), {
        onNone: () => null,
        onSome: ({ _objectKey, prefix, sizes }) =>
          mediaFileURL(sizes.thumbnail.filename, prefix, _objectKey),
      }),
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
    formatOptions: {
      format: "webp",
    },
    mimeTypes: ["image/*", "video/*", "audio/*", "application/pdf"],
  },
};
