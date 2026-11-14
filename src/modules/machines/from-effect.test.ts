import assert from "node:assert/strict"
import test from "node:test"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { createActor, toPromise } from "xstate"
import { fromEffect } from "./from-effect"

class Boom extends Schema.TaggedError<Boom>()("Boom", { message: Schema.String }) {}

test("the actor outputs the program's value", async () => {
  const actor = createActor(fromEffect((n: number) => Effect.succeed(n * 2)), { input: 21 }).start()
  assert.equal(await toPromise(actor), 42)
})

test("the actor rejects with the program's typed error", async () => {
  const actor = createActor(fromEffect(() => Effect.fail(new Boom({ message: "no" }))), { input: undefined }).start()
  await assert.rejects(toPromise(actor), (error) => error instanceof Boom && error._tag === "Boom")
})

test("stopping the actor interrupts the program", async () => {
  const { promise: interrupted, resolve } = Promise.withResolvers<void>()
  const actor = createActor(
    fromEffect(() => Effect.never.pipe(Effect.onInterrupt(() => Effect.sync(resolve)))),
    { input: undefined }
  ).start()
  await new Promise((r) => setTimeout(r, 10))
  actor.stop()
  await interrupted
})
