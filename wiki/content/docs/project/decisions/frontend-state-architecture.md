---
title: Frontend state architecture
description: TanStack Query owns all async data; XState owns flows; Effect owns the programs that read; Server Components own page content
surface: project
permission: project
---

Status: accepted (2026-11-14, template default; revised the same day: every async read goes through the query cache).

## Context

The starter needs one default for client-side logic, so each project does not invent its own mix of `useEffect` fetches, ad-hoc flags, promise actors and global stores. Page content already comes from Server Components and [tagged readers](../runbooks/content-caching.md). The default covers the interactive parts.

## Decision

One rule first: **every asynchronous read in the browser goes through the TanStack Query cache.** The other layers each own one job around it.

### Server Components and tagged readers: page content

Server Components read Payload through the `"use cache"` readers in each entity's `remote/server.ts`. Client machinery is for interactive islands only.

### TanStack Query: all browser async data

- `getQueryClient()` (`src/modules/query/query-client.ts`) follows TanStack's Next.js pattern: one client per browser session, a fresh one per server render. `composition/providers` mounts it.
- Each entity owns its query keys and `queryOptions` (`pageQueryKeys`, `pageSearchQuery` in `src/entities/page/queries.ts`). The `queryFn` is `effectQueryFn(program)` (`src/modules/query/effect-query-fn.ts`), the only place a browser Effect runs; TanStack's abort signal interrupts it.
- Components read with `useQuery(entityQuery(...))`.

### XState v5: flows

- Machines are built with `setup({ types, actors, delays, guards })` and receive their dependencies (the `QueryClient`, a Data Source) as machine input.
- A machine reads data only through `fromQuery` (`src/modules/machines/from-query.ts`): an actor that calls `queryClient.fetchQuery(options)`. A cached term returns at once; concurrent readers share one request. When the machine leaves the invoking state, XState aborts the actor, `fromQuery` cancels the query, TanStack aborts the `queryFn` signal, Effect interrupts the program, and the request aborts.

### Effect v4: the programs

- Entities define a port (`PageSource` in `src/entities/page/contract.ts`) whose operations are Effects with typed errors (`Schema.TaggedError`) and `Schema`-decoded results. A `remote/` Data Source implements it; Composition selects the source and passes it to features as input.
- The browser source uses `fetch` inside `Effect.tryPromise` with the fiber's abort signal, not the `effect/http` client: Effect 4 still marks that client unstable, and the `effect-tsgo` lint rule rejects unstable APIs.
- `AppRuntime` (`src/modules/effect/runtime.ts`) runs the programs; browser-wide services (tracer, logger) join its `AppLayer`.
- Modules are imported by path (`effect/Effect`), not from the `effect` barrel (`effect-no-barrel-imports`).

### Enforcement

`oxlint.local.ts` turns the rule into lint errors ([rule](../../../../../.agents/rules/root/browser-async-query-cache.md)):

- `fetch` only in an entity's `remote/` Data Source or `src/server/`;
- XState `fromPromise`, `fromCallback`, `fromObservable`, `fromEventObservable` only in `src/modules/machines/`;
- `@/modules/effect` only in `src/modules/query/`.

## Reference example: `src/features/site-search/`

Cmd/Ctrl+K page search.

- Machine states: `closed` → `open.{idle, debouncing, searching, results, failure}`.
- Typing re-enters `debouncing`; leaving `searching` cancels the query in flight, so a slow old response never overwrites a newer one.
- The `searching` state invokes `fromQuery(pageSearchQuery(source, term))`; reopening the dialog and typing a searched term again is served from the cache without a request.

Copy this feature's shape for a new interactive island.

## Consequences

- Every read is cached, deduplicated and visible in the Query devtools; no component or machine holds its own copy of server data.
- More concepts for newcomers: query options, machines, Effect programs and ports.
- Testability: machines run with a real `QueryClient` and an in-memory Data Source under vitest, with no network and no timers.
- Writes are not covered yet: the first mutation adds a `useMutation`-based bridge beside `fromQuery`.
