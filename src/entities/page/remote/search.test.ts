import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import { describe, expect, it } from "vitest";
import type { Fetch } from "./search";
import { makeRemotePageSource } from "./search";

interface Answer {
  status?: number;
  body: Record<string, readonly Record<string, number | string>[]>;
}

// A fetch that answers every request with one response and records the URLs.
const answering = (answer: Answer) => {
  const urls: URL[] = [];
  const fetchPages: Fetch = async (url) => {
    urls.push(new URL(url, "http://site.test"));
    return await Promise.resolve(Response.json(answer.body, { status: answer.status }));
  };
  return { urls, source: makeRemotePageSource(fetchPages) };
};

describe(makeRemotePageSource, () => {
  it("asks Payload for matching titles and decodes the hits", async () => {
    const api = answering({ body: { docs: [{ id: 1, title: "About", slug: "about" }] } });
    await expect(Effect.runPromise(api.source.search("ab"))).resolves.toStrictEqual([
      { id: 1, title: "About", slug: "about" },
    ]);
    expect(api.urls[0]?.pathname).toBe("/api/pages");
    expect(api.urls[0]?.searchParams.get("where[title][like]")).toBe("ab");
  });

  it("fails with reason request and the status on an HTTP error", async () => {
    const api = answering({ status: 500, body: { errors: [] } });
    const error = await Effect.runPromise(Effect.flip(api.source.search("ab")));
    expect(error).toMatchObject({ _tag: "PageSearchError", reason: "request", status: 500 });
  });

  it("fails with reason decode on an unexpected body", async () => {
    const api = answering({ body: { docs: [{ id: "x" }] } });
    const error = await Effect.runPromise(Effect.flip(api.source.search("ab")));
    expect(error).toMatchObject({ _tag: "PageSearchError", reason: "decode" });
  });

  it("aborts the request when the search is interrupted", async () => {
    const signals: AbortSignal[] = [];
    const source = makeRemotePageSource(async (_url, init) => {
      if (init.signal !== null && init.signal !== undefined) {
        signals.push(init.signal);
      }
      return await Effect.runPromise(Effect.never);
    });
    const fiber = Effect.runFork(source.search("ab"));
    await Effect.runPromise(Effect.sleep("10 millis"));
    await Effect.runPromise(Fiber.interrupt(fiber));
    expect(signals.map((signal) => signal.aborted)).toStrictEqual([true]);
  });
});
