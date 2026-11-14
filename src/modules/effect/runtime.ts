import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";

// The browser runtime. Browser-wide services (a tracer, a logger) join this
// layer; programs run on it only inside query functions (modules/query).
export const AppLayer = Layer.empty;

export const AppRuntime = ManagedRuntime.make(AppLayer);
