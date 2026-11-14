---
title: Frontend state architecture
description: Effect for IO, XState for UI flows, TanStack Query for cached client reads, Server Components for page content
surface: project
permission: project
---

Status: accepted (2026-11-14, template default).

## Context

The starter needs one default for client-side logic, so each project does not invent its own mix of `useEffect` fetches, ad-hoc flags, and global stores. Page content already comes from Server Components and [tagged readers](../runbooks/content-caching.md). The default covers only the interactive parts.

## Decision

Four layers, each with one job.

### Server Components and tagged readers: page content

Server Components that call the tagged readers in `src/modules/content/readers.ts` stay the default for page content. The client state machinery below is for interactive islands only.

### Effect v4: IO and typed failures

- Services follow `effect-service-design`: an `Interface`, a `Context.Service` class, then a module-level `make` and `layer`.
- Outgoing HTTP uses `effect/http` `HttpClient`; `runtime.ts` provides `FetchHttpClient.layer`, and tests provide a stub client layer.
- Errors are `Schema.TaggedError` classes, so each failure has a type and a tag.
- Response bodies are decoded with `Schema`.
- One browser `ManagedRuntime` (`AppRuntime`, composed from `AppLayer`) in `src/modules/effect/runtime.ts` runs every program.
- `PayloadApi` (`src/modules/effect/payload-api.ts`) is the service for the Payload REST API.
- Import modules by path (`effect/Effect`, `effect/http/HttpClient`), not from the `effect` barrel (lint asset `effect-no-barrel-imports`).

### XState v5: UI flows

- Machines are built with `setup({ types, actors, delays, guards })`.
- Side effects run as invoked actors, never inline in actions.
- Tests swap implementations with `machine.provide(...)`.

### The bridge: `fromEffect`

`fromEffect` in `src/modules/machines/from-effect.ts` turns an Effect program into an XState promise actor. It wires XState's abort signal into Effect interruption. When the machine leaves a state, XState stops the actor, Effect interrupts the program, and the in-flight HTTP request aborts: cancellation works end to end.

### TanStack Query: cached server reads on the client

- `QueryProvider` in `src/modules/query/provider.tsx` holds the client cache.
- `effectQueryFn` in `src/modules/query/effect.ts` runs an Effect as a `queryFn` and passes TanStack's abort signal to it.

Use Query for reads that several components share or that must stay cached across navigation. Use a machine for a flow with states and transitions.

## Reference example: `src/features/site-search/`

Cmd/Ctrl+K page search.

- Machine states: `closed` → `open.{idle, debouncing, searching, results, failure}`.
- Typing re-enters `debouncing`. That exit stops the search actor and aborts its fetch, so a slow old response never overwrites a newer one.
- The search calls the Payload REST API `/api/pages` through the `PayloadApi` Effect service, via `fromEffect`.

Copy this feature's shape for a new interactive island.

## Consequences

- More concepts for newcomers: Effect services, layers, and tagged errors, plus XState machines and actors.
- Testability: machines are tested with stub actors and zero delays under `bun test`, with no network and no timers.
- No global client store. State lives in a machine, in the Query cache, or on the server.
