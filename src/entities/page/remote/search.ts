import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { PageSource } from "../contract";
import { PageHitSchema, PageSearchError } from "../contract";

const PageHitsJson = Schema.fromJsonString(Schema.Struct({ docs: Schema.Array(PageHitSchema) }));
const decodeHits = Schema.decodeEffect(PageHitsJson);

const SEARCH_LIMIT = "8";

export type Fetch = (url: string, init: RequestInit) => Promise<Response>;

// Published pages whose title contains the term, from the Payload REST API.
// Payload access control hides drafts from visitors. Raw fetch, not the
// unstable effect/http client: the fiber's signal still reaches the request.
export const makeRemotePageSource = (fetchPages: Fetch): PageSource => ({
  search: Effect.fn("PageSource.search")(function* searchPages(term: string) {
    const params = new URLSearchParams({
      "where[title][like]": term,
      limit: SEARCH_LIMIT,
      depth: "0",
      "select[title]": "true",
      "select[slug]": "true",
    });
    const response = yield* Effect.tryPromise({
      try: async (signal) =>
        await fetchPages(`/api/pages?${params}`, {
          signal,
          headers: { accept: "application/json" },
        }),
      catch: () => new PageSearchError({ reason: "request" }),
    });
    if (!response.ok) {
      return yield* new PageSearchError({ reason: "request", status: response.status });
    }
    const body = yield* Effect.tryPromise({
      try: async () => await response.text(),
      catch: () => new PageSearchError({ reason: "decode" }),
    });
    const { docs } = yield* decodeHits(body).pipe(
      Effect.mapError(() => new PageSearchError({ reason: "decode" })),
    );
    return docs;
  }),
});

export const remotePageSource = makeRemotePageSource(async (url, init) => await fetch(url, init));
