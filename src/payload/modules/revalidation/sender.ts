import { after } from "next/server"
import type { PayloadRequest } from "payload"
import { env } from "@/env"

const REVALIDATE_SECRET =
  env.NEXT_REVALIDATE_TAGS_SECRET ?? env.PAYLOAD_SECRET

type InvalidateTagsParams = {
  tags: ReadonlyArray<string>
  req: PayloadRequest
  source: string
}

const isLocalHostname = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname.endsWith(".local") ||
  hostname.startsWith("192.168.") ||
  hostname.startsWith("10.") ||
  /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)

const getRevalidateEndpointCandidates = () => {
  const configured = new URL(env.NEXT_PUBLIC_FRONTEND_URL)
  const basePath = configured.pathname === "/" ? "" : configured.pathname
  const primary = `${configured.origin}${basePath}/api/revalidate/tags`

  if (!(configured.protocol === "https:" && isLocalHostname(configured.hostname))) {
    return [primary]
  }

  const httpFallback = `${new URL(
    `${configured.origin}${basePath}`.replace(/^https:/, "http:")
  ).origin}${basePath}/api/revalidate/tags`

  return Array.from(new Set([primary, httpFallback]))
}

// Hooks run inside Payload's database transaction, before it commits. Sent
// then, a visitor request could re-render from the old rows and cache them
// for good. In a Next.js request (admin, REST) the tags go out after the
// response, so after the commit; elsewhere (seed, scripts) after() throws and
// they go out at once.
export const invalidateTags = async (params: InvalidateTagsParams) => {
  if (params.tags.length === 0) return
  try {
    after(() => sendTags(params))
  } catch {
    await sendTags(params)
  }
}

// Hooks also run outside a Next.js request (seed, scripts), where next/cache
// throws. The Route Handler is the single place that calls revalidateTag.
const sendTags = async ({ tags, req, source }: InvalidateTagsParams) => {
  const endpoints = getRevalidateEndpointCandidates()

  let lastError: Error | null = null

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-revalidate-secret": REVALIDATE_SECRET,
        },
        body: JSON.stringify({ tags }),
      })

      if (!response.ok) {
        lastError = new Error(
          `${source} -> ${response.status} ${response.statusText} (${endpoint})`
        )
        continue
      }

      req.payload.logger.info(
        `[revalidate-tags] ${source}: ${tags.join(", ")} via ${endpoint}`
      )
      return
    }
    catch (error) {
      lastError =
        error instanceof Error ? error : new Error("unknown fetch error")
    }
  }

  req.payload.logger.error({
    msg: `Tag revalidation request error from ${source}`,
    err: lastError ?? new Error("no revalidation endpoint candidates"),
  })
}
