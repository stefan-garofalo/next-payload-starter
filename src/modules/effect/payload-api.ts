import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Schema from "effect/Schema"
import * as HttpClient from "effect/http/HttpClient"
import * as HttpClientRequest from "effect/http/HttpClientRequest"
import * as HttpClientResponse from "effect/http/HttpClientResponse"

// The browser's view of the Payload REST API (/api/<collection>). Server code
// reads Payload through the cached readers in modules/content instead.

export const PageHit = Schema.Struct({ id: Schema.Number, title: Schema.String, slug: Schema.String })
export type PageHit = typeof PageHit.Type

const PageHits = Schema.Struct({ docs: Schema.Array(PageHit) })

// The request failed: network, timeout or a non-2xx status.
export class PayloadRequestError extends Schema.TaggedError<PayloadRequestError>()("PayloadRequestError", {
  operation: Schema.String,
  status: Schema.optional(Schema.Number),
}) {}

// Payload answered with a body this app does not expect.
export class PayloadDecodeError extends Schema.TaggedError<PayloadDecodeError>()("PayloadDecodeError", {
  operation: Schema.String,
}) {}

export interface Interface {
  // Published pages whose title contains the term (Payload access control
  // hides drafts from visitors).
  readonly searchPages: (term: string) => Effect.Effect<readonly PageHit[], PayloadRequestError | PayloadDecodeError>
}

export class PayloadApi extends Context.Service<PayloadApi, Interface>()("@app/PayloadApi") {}

const SEARCH_LIMIT = 8

export const make = Effect.gen(function* () {
  // Relative URLs resolve against the page's origin.
  const client = (yield* HttpClient.HttpClient).pipe(
    HttpClient.mapRequest(HttpClientRequest.acceptJson),
    HttpClient.filterStatusOk
  )

  const searchPages = Effect.fn("PayloadApi.searchPages")(function* (term: string) {
    const operation = "PayloadApi.searchPages"
    const response = yield* client
      .get("/api/pages", {
        urlParams: {
          "where[title][like]": term,
          limit: SEARCH_LIMIT,
          depth: 0,
          "select[title]": true,
          "select[slug]": true,
        },
      })
      .pipe(
        Effect.mapError(
          (error) =>
            new PayloadRequestError({
              operation,
              status: error.reason._tag === "StatusCodeError" ? error.reason.response.status : undefined,
            })
        )
      )
    const { docs } = yield* HttpClientResponse.schemaBodyJson(PageHits)(response).pipe(
      Effect.mapError(() => new PayloadDecodeError({ operation }))
    )
    return docs
  })

  return PayloadApi.of({ searchPages })
})

export const layer = Layer.effect(PayloadApi, make)
