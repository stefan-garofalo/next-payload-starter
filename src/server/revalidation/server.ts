import "server-only";
import { timingSafeEqual } from "node:crypto";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { revalidateTag } from "next/cache";
import { env } from "@/env";
import { REVALIDATE_SECRET_HEADER, revalidateSecret } from "./secret";
import { isContentTag } from "./tags";

const RevalidateBody = Schema.Struct({ tags: Schema.Array(Schema.String) });
const decodeBody = Schema.decodeUnknownOption(RevalidateBody);

const isAuthorized = (secret: string | null): boolean => {
  if (secret === null || secret === "") {
    return false;
  }
  const given = Buffer.from(secret);
  const expected = Buffer.from(revalidateSecret(env));
  return given.length === expected.length && timingSafeEqual(given, expected);
};

// Only well-formed content tags pass; anything else is dropped.
const tagsIn = (body: Option.Option<typeof RevalidateBody.Type>): string[] =>
  Option.match(body, {
    onNone: () => [],
    onSome: ({ tags }) => [...new Set(tags.filter(isContentTag))],
  });

// The only place that calls revalidateTag: Payload hooks (sender.ts) post here
// after their transaction commits.
export const POST = async (request: Request): Promise<Response> => {
  if (!isAuthorized(request.headers.get(REVALIDATE_SECRET_HEADER))) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const json: unknown = await request.json().catch(() => null);
  const tags = tagsIn(decodeBody(json));

  if (tags.length === 0) {
    return Response.json({ ok: false, error: "no_valid_tags" }, { status: 400 });
  }

  // expire: 0 makes the next request render fresh content instead of stale.
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return Response.json({ ok: true, invalidated: tags.length, tags });
};
