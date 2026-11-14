import { QueryClient } from "@tanstack/react-query";
import * as Effect from "effect/Effect";
import { describe, expect, it } from "vitest";
import { createActor, waitFor } from "xstate";
import type { PageHit, PageSource } from "@/entities/page";
import { PageSearchError } from "@/entities/page";
import { siteSearchMachine } from "./machine";

const ABOUT: PageHit = { id: 1, title: "About", slug: "about" };

interface FakeSource extends PageSource {
  terms: string[];
}

// A complete in-memory PageSource that records each term it is asked for.
const answering = (
  answer: (term: string) => Effect.Effect<readonly PageHit[], PageSearchError>,
): FakeSource => {
  const terms: string[] = [];
  return {
    terms,
    search: (term) => Effect.sync(() => terms.push(term)).pipe(Effect.andThen(answer(term))),
  };
};

// The real machine and query cache; only the debounce is dropped.
const start = (source: PageSource, queryClient = new QueryClient()) =>
  createActor(siteSearchMachine.provide({ delays: { debounce: 0 } }), {
    input: { queryClient, source },
  }).start();

describe("site search machine", () => {
  it("searches a typed term after the debounce and shows its hits", async () => {
    const source = answering(() => Effect.succeed([ABOUT]));
    const actor = start(source);
    actor.send({ type: "OPEN" });
    actor.send({ type: "TYPE", query: " ab " });
    const snapshot = await waitFor(actor, (state) => state.matches({ open: "results" }));
    expect(source.terms).toStrictEqual(["ab"]);
    expect(snapshot.context.hits).toStrictEqual([ABOUT]);
  });

  it("does not search a term shorter than the minimum", async () => {
    const source = answering(() => Effect.succeed([ABOUT]));
    const actor = start(source);
    actor.send({ type: "OPEN" });
    actor.send({ type: "TYPE", query: "a" });
    await waitFor(actor, (state) => state.matches({ open: "idle" }));
    expect(source.terms).toStrictEqual([]);
  });

  it("serves a term searched before from the query cache", async () => {
    const source = answering(() => Effect.succeed([ABOUT]));
    const actor = start(source);
    actor.send({ type: "OPEN" });
    actor.send({ type: "TYPE", query: "about" });
    await waitFor(actor, (state) => state.matches({ open: "results" }));
    actor.send({ type: "CLOSE" });
    actor.send({ type: "OPEN" });
    actor.send({ type: "TYPE", query: "about" });
    await waitFor(actor, (state) => state.matches({ open: "results" }));
    expect(source.terms).toStrictEqual(["about"]);
  });

  it("cancels a search in flight when the visitor types again", async () => {
    const interrupted: string[] = [];
    const source = answering((term) =>
      term === "abc"
        ? Effect.succeed([ABOUT])
        : Effect.never.pipe(Effect.onInterrupt(() => Effect.sync(() => interrupted.push(term)))),
    );
    const actor = start(source);
    actor.send({ type: "OPEN" });
    actor.send({ type: "TYPE", query: "ab" });
    await waitFor(actor, (state) => state.matches({ open: "searching" }));
    actor.send({ type: "TYPE", query: "abc" });
    await waitFor(actor, (state) => state.matches({ open: "results" }));
    await waitFor(actor, () => interrupted.length > 0);
    expect(interrupted).toStrictEqual(["ab"]);
  });

  it("can retry a failed search", async () => {
    let calls = 0;
    const source = answering(() => {
      calls += 1;
      return calls === 1
        ? Effect.fail(new PageSearchError({ reason: "request" }))
        : Effect.succeed([ABOUT]);
    });
    const actor = start(source, new QueryClient({ defaultOptions: { queries: { retry: false } } }));
    actor.send({ type: "OPEN" });
    actor.send({ type: "TYPE", query: "about" });
    await waitFor(actor, (state) => state.matches({ open: "failure" }));
    actor.send({ type: "RETRY" });
    await waitFor(actor, (state) => state.matches({ open: "results" }));
    expect(calls).toBe(2);
  });

  it("clears the query and the hits on close", async () => {
    const actor = start(answering(() => Effect.succeed([ABOUT])));
    actor.send({ type: "OPEN" });
    actor.send({ type: "TYPE", query: "about" });
    await waitFor(actor, (state) => state.matches({ open: "results" }));
    actor.send({ type: "CLOSE" });
    expect(actor.getSnapshot().context).toMatchObject({ query: "", hits: [] });
  });
});
