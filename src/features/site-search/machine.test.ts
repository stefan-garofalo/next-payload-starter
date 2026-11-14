import assert from "node:assert/strict"
import test from "node:test"
import { createActor, fromPromise, waitFor } from "xstate"
import type { PageHit } from "@/modules/effect/payload-api"
import { siteSearchMachine } from "./machine"

const ABOUT: PageHit = { id: 1, title: "About", slug: "about" }

// The real actor calls the API; tests swap it and drop the debounce.
const withSearch = (search: (term: string, signal: AbortSignal) => Promise<readonly PageHit[]>) =>
  createActor(
    siteSearchMachine.provide({
      actors: { searchPages: fromPromise(({ input, signal }) => search(input.term, signal)) },
      delays: { debounce: 0 },
    })
  ).start()

test("a typed term is searched after the debounce and its hits are shown", async () => {
  const terms: string[] = []
  const actor = withSearch(async (term) => {
    terms.push(term)
    return [ABOUT]
  })
  actor.send({ type: "OPEN" })
  actor.send({ type: "TYPE", query: " ab " })
  const snapshot = await waitFor(actor, (state) => state.matches({ open: "results" }))
  assert.deepEqual(terms, ["ab"])
  assert.deepEqual(snapshot.context.hits, [ABOUT])
})

test("a term shorter than the minimum is not searched", async () => {
  const actor = withSearch(async () => assert.fail("searched a one-letter term"))
  actor.send({ type: "OPEN" })
  actor.send({ type: "TYPE", query: "a" })
  await waitFor(actor, (state) => state.matches({ open: "idle" }))
})

test("typing during a search aborts it and searches the new term", async () => {
  const aborted: string[] = []
  const actor = withSearch(
    (term, signal) =>
      new Promise((resolve) => {
        if (term === "abc") return resolve([ABOUT])
        signal.addEventListener("abort", () => aborted.push(term))
      })
  )
  actor.send({ type: "OPEN" })
  actor.send({ type: "TYPE", query: "ab" })
  await waitFor(actor, (state) => state.matches({ open: "searching" }))
  actor.send({ type: "TYPE", query: "abc" })
  await waitFor(actor, (state) => state.matches({ open: "results" }))
  assert.deepEqual(aborted, ["ab"])
})

test("a failed search can be retried", async () => {
  let calls = 0
  const actor = withSearch(async () => {
    calls += 1
    if (calls === 1) throw new Error("offline")
    return [ABOUT]
  })
  actor.send({ type: "OPEN" })
  actor.send({ type: "TYPE", query: "about" })
  await waitFor(actor, (state) => state.matches({ open: "failure" }))
  actor.send({ type: "RETRY" })
  await waitFor(actor, (state) => state.matches({ open: "results" }))
  assert.equal(calls, 2)
})

test("closing the dialog clears the query and the hits", async () => {
  const actor = withSearch(async () => [ABOUT])
  actor.send({ type: "OPEN" })
  actor.send({ type: "TYPE", query: "about" })
  await waitFor(actor, (state) => state.matches({ open: "results" }))
  actor.send({ type: "CLOSE" })
  assert.deepEqual(actor.getSnapshot().context, { query: "", hits: [] })
})
