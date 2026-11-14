import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { seoPlugin } from "@payloadcms/plugin-seo";
import type { GenerateTitle } from "@payloadcms/plugin-seo/types";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { en } from "@payloadcms/translations/languages/en";
import { it } from "@payloadcms/translations/languages/it";
import { buildConfig } from "payload";
import sharp from "sharp";
import { env } from "./env";
import type { Page } from "./payload-types";
import { Footer, Header, Media, mediaFileURL, Pages, Users } from "./server/cms";

// Turbopack bundles this file and leaves import.meta.dirname undefined.
// oxlint-disable-next-line unicorn/prefer-import-meta-properties -- the bundled config has no import.meta.dirname
const dirname = path.dirname(fileURLToPath(import.meta.url));

// Media lives in R2 (alchemy.run.ts) when every S3 variable is set, else on local disk.
const usesR2 = [env.S3_BUCKET, env.S3_ACCESS_KEY_ID, env.S3_SECRET, env.S3_ENDPOINT].every(
  (value) => value !== undefined && value !== "",
);

const generateTitle: GenerateTitle<Page> = ({ doc }) =>
  doc.title === undefined || doc.title === ""
    ? env.NEXT_PUBLIC_APP_NAME
    : `${doc.title} · ${env.NEXT_PUBLIC_APP_NAME}`;

export default buildConfig({
  defaultDepth: 0,
  maxDepth: 2,
  upload: {
    // 20 MB per file.
    limits: { fileSize: 20_000_000 },
  },
  admin: {
    user: Users.slug,
    suppressHydrationWarning: true,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: "en",
    supportedLanguages: { en, it },
  },
  collections: [Pages, Users, Media],
  globals: [Header, Footer],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: { connectionString: env.DATABASE_URI },
    // Schema changes ship as committed migrations in every environment.
    push: false,
    migrationDir: path.resolve(dirname, "server/cms/migrations"),
  }),
  sharp,
  plugins: [
    // URLs point straight at the bucket's public domain, so pages load the
    // pre-sized WebP files from Cloudflare, never through Vercel.
    s3Storage({
      enabled: usesR2,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename: name, prefix }) => mediaFileURL(name, prefix),
        },
      },
      bucket: env.S3_BUCKET ?? "",
      config: {
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: env.S3_SECRET ?? "",
        },
        endpoint: env.S3_ENDPOINT,
        region: "auto",
      },
      // Same schema with or without credentials, so local migrations match production.
      alwaysInsertFields: true,
      // Browser uploads go straight to R2, past Vercel's 4.5 MB request limit.
      clientUploads: true,
    }),
    seoPlugin({
      collections: ["pages"],
      uploadsCollection: "media",
      generateTitle,
    }),
  ],
});
