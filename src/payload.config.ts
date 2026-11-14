import path from "node:path"
import { fileURLToPath } from "node:url"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { seoPlugin } from "@payloadcms/plugin-seo"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { s3Storage } from "@payloadcms/storage-s3"
import { en } from "@payloadcms/translations/languages/en"
import { it } from "@payloadcms/translations/languages/it"
import { buildConfig } from "payload"
import sharp from "sharp"
import { env } from "./env"
import { Media, mediaFileURL, Pages, Users } from "./payload/collections"
import { Footer, Header } from "./payload/globals"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  defaultDepth: 0,
  maxDepth: 2,
  upload: {
    limits: {
      fileSize: 20_000_000, // 20MB
    },
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
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  plugins: [
    // Media lives in R2 (alchemy.run.ts) when the S3 variables are set, else on
    // local disk. URLs point straight at the bucket's public domain, so pages
    // load the pre-sized WebP files from Cloudflare, never through Vercel.
    s3Storage({
      enabled: Boolean(env.S3_BUCKET && env.S3_ACCESS_KEY_ID && env.S3_SECRET && env.S3_ENDPOINT),
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => mediaFileURL(filename, prefix),
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
      generateTitle: ({ doc }) =>
        typeof doc?.title === "string" ? `${doc.title} · ${env.NEXT_PUBLIC_APP_NAME}` : env.NEXT_PUBLIC_APP_NAME,
    }),
  ],
})
