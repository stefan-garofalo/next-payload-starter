import assert from "node:assert/strict"
import test from "node:test"
import * as Effect from "effect/Effect"
import { effectQueryFn } from "./effect"

test("effectQueryFn resolves with the program's value", async () => {
  const queryFn = effectQueryFn(Effect.succeed("ok"))
  assert.equal(await queryFn({ signal: new AbortController().signal }), "ok")
})

test("aborting the query signal interrupts the program", async () => {
  const { promise: interrupted, resolve } = Promise.withResolvers<void>()
  const controller = new AbortController()
  const queryFn = effectQueryFn(Effect.never.pipe(Effect.onInterrupt(() => Effect.sync(resolve))))
  const result = queryFn({ signal: controller.signal })
  await new Promise((r) => setTimeout(r, 10))
  controller.abort()
  await interrupted
  await assert.rejects(result)
})
