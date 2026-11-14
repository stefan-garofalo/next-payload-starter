import { timingSafeEqual } from "node:crypto"
import { revalidateTag } from "next/cache"
import { env } from "@/env"
import { isContentTag } from "@/modules/content/tags"

const REVALIDATE_SECRET = env.NEXT_REVALIDATE_TAGS_SECRET ?? env.PAYLOAD_SECRET

const isAuthorized = (secret: string | null) => {
  if (!secret) return false
  const given = Buffer.from(secret)
  const expected = Buffer.from(REVALIDATE_SECRET)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export async function POST(request: Request) {
  if (!isAuthorized(request.headers.get("x-revalidate-secret"))) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null
  const tags = Array.isArray(body?.tags)
    ? Array.from(new Set(body.tags.filter(isContentTag)))
    : []

  if (tags.length === 0) {
    return Response.json({ ok: false, error: "no_valid_tags" }, { status: 400 })
  }

  // expire: 0 makes the next request render fresh content instead of stale.
  for (const tag of tags) revalidateTag(tag, { expire: 0 })

  return Response.json({ ok: true, invalidated: tags.length, tags })
}
