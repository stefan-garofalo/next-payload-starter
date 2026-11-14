import { after } from "next/server";
import type { PayloadRequest } from "payload";
import { env } from "@/env";
import { REVALIDATE_SECRET_HEADER, revalidateSecret } from "./secret";

interface InvalidateTagsParams {
  tags: readonly string[];
  req: PayloadRequest;
  source: string;
}

const LOCAL_HOSTNAME =
  /^(?:localhost|127\.0\.0\.1|192\.168\..*|10\..*|172\.(?:1[6-9]|2\d|3[0-1])\..*|.*\.local)$/u;

const endpointCandidates = (): string[] => {
  const configured = new URL(env.NEXT_PUBLIC_FRONTEND_URL);
  const basePath = configured.pathname === "/" ? "" : configured.pathname;
  const primary = `${configured.origin}${basePath}/api/revalidate/tags`;
  if (!(configured.protocol === "https:" && LOCAL_HOSTNAME.test(configured.hostname))) {
    return [primary];
  }
  // Local HTTPS dev servers may also answer on plain HTTP.
  const httpOrigin = new URL(`${configured.origin}${basePath}`.replace(/^https:/u, "http:")).origin;
  return [...new Set([primary, `${httpOrigin}${basePath}/api/revalidate/tags`])];
};

const postTags = async (endpoint: string, tags: readonly string[]): Promise<Response> =>
  await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      [REVALIDATE_SECRET_HEADER]: revalidateSecret(env),
    },
    body: JSON.stringify({ tags }),
  });

// Tries each endpoint in order and stops at the first that accepts the tags.
const sendTags = async ({ tags, req, source }: InvalidateTagsParams): Promise<void> => {
  const failures: string[] = [];
  for (const endpoint of endpointCandidates()) {
    // oxlint-disable-next-line eslint/no-await-in-loop -- the endpoints are fallbacks, tried in order
    const response = await postTags(endpoint, tags).catch(() => null);
    if (response?.ok === true) {
      req.payload.logger.info(`[revalidate-tags] ${source}: ${tags.join(", ")} via ${endpoint}`);
      return;
    }
    failures.push(
      response === null ? `network error ${endpoint}` : `${response.status} ${endpoint}`,
    );
  }
  req.payload.logger.error({ msg: `Tag revalidation request error from ${source}`, failures });
};

// Hooks run inside Payload's database transaction, before it commits. Sent
// then, a visitor request could re-render from the old rows and cache them
// for good. In a Next.js request (admin, REST) the tags go out after the
// response, so after the commit; elsewhere (scripts) after() throws and they
// go out at once. The route handler (server.ts) is the only revalidateTag caller.
export const invalidateTags = async (params: InvalidateTagsParams): Promise<void> => {
  if (params.tags.length === 0) {
    return;
  }
  try {
    after(() => sendTags(params));
  } catch {
    await sendTags(params);
  }
};
