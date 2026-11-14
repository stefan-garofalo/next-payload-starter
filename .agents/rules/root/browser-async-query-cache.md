# root.browser-async-query-cache

- id: `root.browser-async-query-cache`
- authority: project decision ([frontend state architecture](../../../wiki/content/docs/project/decisions/frontend-state-architecture.md)); code evidence `oxlint.local.ts`, `src/modules/machines/from-query.ts`, `src/modules/query/effect-query-fn.ts`

## Requirement

Every asynchronous read in the browser goes through the TanStack Query cache: a component reads with `useQuery` and an entity's `queryOptions`, a machine invokes `fromQuery`. XState and Effect own the flow and the program; the query cache owns the data. Effect programs run in the browser only inside `effectQueryFn`, and `fetch` appears only in an entity's `remote/` Data Source or in `src/server/`.

## Activation

- Paths: `src/features/**`, `src/entities/**`, `src/modules/**`, `src/composition/**`, `src/integrations/**`
- Tasks: add or change a browser data read, a machine actor, or an Effect run

## Verification

`bun run lint` passes: `oxlint.local.ts` rejects `fetch` outside Data Sources and `server/`, XState's `fromPromise`/`fromCallback`/`fromObservable`/`fromEventObservable` outside `src/modules/machines/`, and `@/modules/effect` outside `src/modules/query/`. A new query has a key in its entity's query-key factory.

## Exceptions

Writes use `useMutation` (or a machine actor built on the mutation cache) with the same Effect-in-`queryFn`-style boundary; add that bridge beside `fromQuery` when the first mutation lands.
