import type { QueryClient } from "@tanstack/react-query";
import { assign, setup } from "xstate";
import type { PageHit, PageSource } from "@/entities/page";
import { pageSearchQuery } from "@/entities/page";
import { fromQuery } from "@/modules/machines";

const MIN_TERM_LENGTH = 2;

interface SearchParams {
  source: PageSource;
  term: string;
}

// Hits come only from the query cache: a term searched before returns at once.
const searchPages = fromQuery(({ source, term }: SearchParams) => pageSearchQuery(source, term));

export interface SiteSearchInput {
  queryClient: QueryClient;
  source: PageSource;
}

interface SiteSearchContext extends SiteSearchInput {
  query: string;
  hits: readonly PageHit[];
}

type SiteSearchEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TYPE"; query: string }
  | { type: "RETRY" };

// The search dialog: closed, or open and idle → debouncing → searching →
// results | failure. Typing always re-enters debouncing, so a search in flight
// is stopped (its query cancelled) and only the last term reaches the API.
export const siteSearchMachine = setup({
  // SAFETY: XState's documented typing idiom; the object only carries types and is never read.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion, typescript/no-unnecessary-type-assertion, anti-slop/no-known-value-widening -- XState setup() types
  types: {} as { context: SiteSearchContext; events: SiteSearchEvent; input: SiteSearchInput },
  actors: { searchPages },
  delays: { debounce: 200 },
  guards: { hasTerm: ({ context }) => context.query.trim().length >= MIN_TERM_LENGTH },
}).createMachine({
  id: "siteSearch",
  initial: "closed",
  context: ({ input }) => ({ ...input, query: "", hits: [] }),
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
            debounce: [
              { guard: "hasTerm", target: "searching" },
              { target: "idle", actions: assign({ hits: [] }) },
            ],
          },
        },
        searching: {
          invoke: {
            src: "searchPages",
            input: ({ context }) => ({
              client: context.queryClient,
              params: { source: context.source, term: context.query.trim() },
            }),
            onDone: { target: "results", actions: assign({ hits: ({ event }) => event.output }) },
            onError: "failure",
          },
        },
        results: {},
        failure: { on: { RETRY: "searching" } },
      },
    },
  },
});
