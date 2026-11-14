import * as Effect from "effect/Effect"
import { assign, setup } from "xstate"
import { type PageHit, PayloadApi } from "@/modules/effect/payload-api"
import { fromEffect } from "@/modules/machines/from-effect"

export const MIN_TERM_LENGTH = 2

const searchPages = fromEffect(({ term }: { term: string }) =>
  Effect.gen(function* () {
    const api = yield* PayloadApi
    return yield* api.searchPages(term)
  })
)

// The search dialog: closed, or open and idle → debouncing → searching →
// results | failure. Typing always re-enters debouncing, so a search in flight
// is stopped (its request aborted) and only the last term reaches the API.
export const siteSearchMachine = setup({
  types: {
    context: {} as { query: string; hits: readonly PageHit[] },
    events: {} as { type: "OPEN" } | { type: "CLOSE" } | { type: "TYPE"; query: string } | { type: "RETRY" },
  },
  actors: { searchPages },
  delays: { debounce: 200 },
  guards: { hasTerm: ({ context }) => context.query.trim().length >= MIN_TERM_LENGTH },
}).createMachine({
  id: "siteSearch",
  initial: "closed",
  context: { query: "", hits: [] },
  states: {
    closed: {
      entry: assign({ query: "", hits: [] }),
      on: { OPEN: "open" },
    },
    open: {
      initial: "idle",
      on: {
        CLOSE: "closed",
        TYPE: { target: ".debouncing", actions: assign({ query: ({ event }) => event.query }) },
      },
      states: {
        idle: {},
        debouncing: {
          after: {
            debounce: [{ guard: "hasTerm", target: "searching" }, { target: "idle", actions: assign({ hits: [] }) }],
          },
        },
        searching: {
          invoke: {
            src: "searchPages",
            input: ({ context }) => ({ term: context.query.trim() }),
            onDone: { target: "results", actions: assign({ hits: ({ event }) => event.output }) },
            onError: "failure",
          },
        },
        results: {},
        failure: { on: { RETRY: "searching" } },
      },
    },
  },
})
