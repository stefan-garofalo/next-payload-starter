import * as Layer from "effect/Layer"
import * as ManagedRuntime from "effect/ManagedRuntime"
import * as FetchHttpClient from "effect/http/FetchHttpClient"
import * as PayloadApi from "./payload-api"

// The browser composition root: every client-side service with its concrete
// dependencies. Machines (modules/machines/from-effect) and queries
// (modules/query/effect) run their programs through this one runtime.
export const AppLayer = Layer.mergeAll(PayloadApi.layer).pipe(Layer.provide(FetchHttpClient.layer))

export type AppServices = Layer.Success<typeof AppLayer>

export const AppRuntime = ManagedRuntime.make(AppLayer)
