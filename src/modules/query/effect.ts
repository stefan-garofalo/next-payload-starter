import type * as Effect from "effect/Effect"
import { AppRuntime, type AppServices } from "@/modules/effect/runtime"

// A TanStack Query queryFn that runs an Effect program on the app runtime.
// TanStack's signal interrupts the program when the query is cancelled.
//   useQuery({ queryKey: ["pages", term], queryFn: effectQueryFn(searchPages(term)) })
export const effectQueryFn =
  <A, E>(program: Effect.Effect<A, E, AppServices>) =>
  ({ signal }: { signal: AbortSignal }) =>
    AppRuntime.runPromise(program, { signal })
