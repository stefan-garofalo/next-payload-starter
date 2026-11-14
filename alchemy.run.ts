// Media infrastructure: one R2 bucket and the Vercel env vars Payload's S3
// adapter reads. Deploy with `bun run infra:deploy` (stage `prod`, Cloudflare
// profile from ALCHEMY_PROFILE in .envrc).
import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Command from "alchemy/Command"
import * as Output from "alchemy/Output"
import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

export default Alchemy.Stack(
  "Starter",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), Command.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const { accountId } = yield* yield* Cloudflare.CloudflareEnvironment
    // Origins whose admin uploads go straight from the browser to R2
    // (clientUploads), comma-separated: https://<project>.vercel.app,https://example.com
    const adminOrigins = (yield* Config.String("ADMIN_ORIGINS")).split(",").map((origin) => origin.trim())
    // e.g. media.example.com; until the zone is on Cloudflare, r2.dev serves media.
    const mediaDomain = yield* Config.String("MEDIA_DOMAIN").pipe(
      Effect.orElseSucceed(() => undefined)
    )

    const bucket = yield* Cloudflare.R2.Bucket("Media", {
      name: "starter-media",
      locationHint: "weur",
      domains: mediaDomain ? [{ name: mediaDomain }] : [],
      publicAccess: !mediaDomain,
      cors: [
        // Line drawings are CSS masks, which browsers fetch in CORS mode: every
        // origin that shows the site (production, Preview, local) reads them.
        { allowedMethods: ["GET", "HEAD"], allowedOrigins: ["*"], maxAgeSeconds: 86_400 },
        {
          allowedMethods: ["PUT"],
          allowedOrigins: adminOrigins,
          allowedHeaders: ["*"],
          exposeHeaders: ["etag"],
          maxAgeSeconds: 3600,
        },
      ],
    })

    // The S3 key is an R2 API token scoped to this bucket (Object Read & Write),
    // made in the dashboard: the OAuth login cannot create API tokens. Set in .envrc.local.
    const accessKeyId = yield* Config.String("R2_ACCESS_KEY_ID")
    const secretAccessKey = yield* Config.Redacted("R2_SECRET_ACCESS_KEY")

    const mediaBaseUrl = Output.all(bucket.publicDomain, bucket.domains).pipe(
      Output.map(([publicDomain, domains]) => `https://${domains[0]?.domain ?? publicDomain}`)
    )

    yield* Command.Exec("VercelEnv", {
      command: "bun scripts/sync-vercel-env.ts",
      env: {
        S3_ENDPOINT: `https://${accountId}.r2.cloudflarestorage.com`,
        S3_BUCKET: bucket.bucketName,
        S3_ACCESS_KEY_ID: accessKeyId,
        S3_SECRET: secretAccessKey,
        NEXT_PUBLIC_MEDIA_BASE_URL: mediaBaseUrl,
      },
      memo: { include: ["scripts/sync-vercel-env.ts"] },
    })

    return { bucket: bucket.bucketName, mediaBaseUrl }
  })
)
