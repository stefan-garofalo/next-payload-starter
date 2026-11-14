import * as Deferred from "effect/Deferred";
import * as Effect from "effect/Effect";
import { describe, expect, it } from "vitest";
import { effectQueryFn } from "./effect-query-fn";

describe(effectQueryFn, () => {
  it("resolves with the program's value", async () => {
    const queryFn = effectQueryFn(Effect.succeed("ok"));
    await expect(queryFn({ signal: new AbortController().signal })).resolves.toBe("ok");
  });

  it("interrupts the program when the query signal aborts", async () => {
    const interrupted = Deferred.makeUnsafe<boolean>();
    const controller = new AbortController();
    const queryFn = effectQueryFn(
      Effect.never.pipe(Effect.onInterrupt(() => Deferred.succeed(interrupted, true))),
    );
    const result = queryFn({ signal: controller.signal });
    await Effect.runPromise(Effect.sleep("10 millis"));
    controller.abort();
    await expect(Effect.runPromise(Deferred.await(interrupted))).resolves.toBeTruthy();
    await expect(result).rejects.toBeDefined();
  });
});
