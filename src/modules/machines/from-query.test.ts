import { QueryClient } from "@tanstack/react-query";
import * as Deferred from "effect/Deferred";
import * as Effect from "effect/Effect";
import { describe, expect, it } from "vitest";
import { createActor, toPromise } from "xstate";
import { effectQueryFn } from "@/modules/query";
import { fromQuery } from "./from-query";

describe(fromQuery, () => {
  it("outputs the query's data and stores it in the cache", async () => {
    const client = new QueryClient();
    let calls = 0;
    const logic = fromQuery((term: string) => ({
      queryKey: ["echo", term],
      queryFn: effectQueryFn(
        Effect.sync(() => {
          calls += 1;
          return term.toUpperCase();
        }),
      ),
      staleTime: Number.POSITIVE_INFINITY,
    }));
    await expect(
      toPromise(createActor(logic, { input: { client, params: "ab" } }).start()),
    ).resolves.toBe("AB");
    await expect(
      toPromise(createActor(logic, { input: { client, params: "ab" } }).start()),
    ).resolves.toBe("AB");
    expect(calls).toBe(1);
    expect(client.getQueryData(["echo", "ab"])).toBe("AB");
  });

  it("cancels the query, interrupting its program, when the actor stops", async () => {
    const client = new QueryClient();
    const started = Deferred.makeUnsafe<boolean>();
    const interrupted = Deferred.makeUnsafe<boolean>();
    const logic = fromQuery((term: string) => ({
      queryKey: ["slow", term],
      queryFn: effectQueryFn(
        Deferred.succeed(started, true).pipe(
          Effect.andThen(Effect.never),
          Effect.onInterrupt(() => Deferred.succeed(interrupted, true)),
        ),
      ),
    }));
    const actor = createActor(logic, { input: { client, params: "ab" } }).start();
    await Effect.runPromise(Deferred.await(started));
    actor.stop();
    await expect(Effect.runPromise(Deferred.await(interrupted))).resolves.toBeTruthy();
  });
});
