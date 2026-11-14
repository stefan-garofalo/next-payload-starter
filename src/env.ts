import { createEnv } from "@t3-oss/env-nextjs";
import { type } from "arktype";

export const env = createEnv({
  server: {
    NO_INDEX: type("boolean"),
    DATABASE_URI: type("string"),
    PAYLOAD_SECRET: type("string"),
    S3_ACCESS_KEY_ID: type("string | undefined"),
    S3_SECRET: type("string | undefined"),
    S3_BUCKET: type("string | undefined"),
    S3_ENDPOINT: type("string.url | undefined"),
    NEXT_REVALIDATE_TAGS_SECRET: type("string | undefined"),
    VERCEL_ENV: type("'production' | 'development' | 'preview' | undefined"),
  },
  client: {
    NEXT_PUBLIC_FRONTEND_URL: type("string.url"),
    NEXT_PUBLIC_APP_NAME: type("string"),
    NEXT_PUBLIC_MEDIA_BASE_URL: type("string.url | undefined"),
  },
  runtimeEnv: {
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET: process.env.S3_SECRET,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    NEXT_REVALIDATE_TAGS_SECRET: process.env.NEXT_REVALIDATE_TAGS_SECRET,
    // On Vercel, Neon's integration sets DATABASE_URL (pooled).
    DATABASE_URI:
      process.env.DATABASE_URI ??
      process.env.DATABASE_URL ??
      "postgres://postgres@127.0.0.1:5432/starter",
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ?? "local-payload-secret",
    NO_INDEX: process.env.NO_INDEX === "true",
    // On Vercel, the production domain (custom once added) for every
    // environment: canonical URLs and revalidation target production.
    NEXT_PUBLIC_FRONTEND_URL:
      process.env.NEXT_PUBLIC_FRONTEND_URL ??
      (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL === undefined
        ? "http://localhost:3000"
        : `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`),
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Next Payload Starter",
    NEXT_PUBLIC_MEDIA_BASE_URL: process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
});
