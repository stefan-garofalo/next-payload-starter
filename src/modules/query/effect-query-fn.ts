import type * as Effect from "effect/Effect";
import { AppRuntime } from "@/modules/effect";

interface QueryFnContext {
  signal: AbortSignal;
}

// A TanStack Query queryFn that runs an Effect program on the app runtime:
// the only place browser Effects run. TanStack's signal interrupts the
// program when the query is cancelled.
export const effectQueryFn =
  <A, E>(program: Effect.Effect<A, E>) =>
  async ({ signal }: QueryFnContext): Promise<A> =>
    // Effect edge: TanStack Query owns the promise boundary of every browser read.
    await AppRuntime.runPromise(program, { signal });
