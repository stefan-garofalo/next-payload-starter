import type * as Effect from "effect/Effect"
import { fromPromise } from "xstate"
import { AppRuntime, type AppServices } from "@/modules/effect/runtime"

// An XState actor that runs an Effect program on the app runtime. When the
// machine leaves the invoking state, XState aborts the actor's signal and the
// runtime interrupts the program, which cancels its in-flight requests. A
// failure rejects with the program's typed error (onError's `event.error`).
export const fromEffect = <A, E, Input>(program: (input: Input) => Effect.Effect<A, E, AppServices>) =>
  fromPromise<A, Input>(({ input, signal }) => AppRuntime.runPromise(program(input), { signal }))
