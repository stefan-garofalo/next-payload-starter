import assert from "node:assert/strict"
import { after, before, test } from "node:test"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as HttpClient from "effect/http/HttpClient"
import * as HttpClientResponse from "effect/http/HttpClientResponse"
import { layer, PayloadApi } from "./payload-api"

// In the browser relative URLs resolve against the page; give tests a page.
const realLocation = Object.getOwnPropertyDescriptor(globalThis, "location")
before(() => {
  Object.defineProperty(globalThis, "location", { configurable: true, value: new URL("http://site.test/") })
})
after(() => {
  if (realLocation) Object.defineProperty(globalThis, "location", realLocation)
  else Reflect.deleteProperty(globalThis, "location")
})

// A client that answers every request with one response and records the URLs.
const answering = (body: unknown, init?: ResponseInit) => {
  const urls: URL[] = []
  const client = HttpClient.make((request, url) => {
    urls.push(url)
    return Effect.succeed(HttpClientResponse.fromWeb(request, Response.json(body, init)))
  })
  return { urls, layer: layer.pipe(Layer.provide(Layer.succeed(HttpClient.HttpClient, client))) }
}

const search = (term: string) =>
  Effect.gen(function* () {
    const api = yield* PayloadApi
    return yield* api.searchPages(term)
  })

test("searchPages asks Payload for matching titles and decodes the hits", async () => {
  const api = answering({ docs: [{ id: 1, title: "About", slug: "about" }], totalDocs: 1 })
  const hits = await Effect.runPromise(search("ab").pipe(Effect.provide(api.layer)))
  assert.deepEqual(hits, [{ id: 1, title: "About", slug: "about" }])
  assert.equal(api.urls[0]?.pathname, "/api/pages")
  assert.equal(api.urls[0]?.searchParams.get("where[title][like]"), "ab")
})

test("searchPages fails with PayloadRequestError and the status on an HTTP error", async () => {
  const api = answering({ errors: [] }, { status: 500 })
  const error = await Effect.runPromise(Effect.flip(search("ab").pipe(Effect.provide(api.layer))))
  assert.equal(error._tag, "PayloadRequestError")
  assert.equal(error._tag === "PayloadRequestError" ? error.status : null, 500)
})

test("searchPages fails with PayloadDecodeError on an unexpected body", async () => {
  const api = answering({ docs: [{ id: "x" }] })
  const error = await Effect.runPromise(Effect.flip(search("ab").pipe(Effect.provide(api.layer))))
  assert.equal(error._tag, "PayloadDecodeError")
})
