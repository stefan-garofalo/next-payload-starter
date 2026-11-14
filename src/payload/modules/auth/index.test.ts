import assert from "node:assert/strict"
import test from "node:test"
import type { AccessArgs } from "payload"
import { access } from "./index"

const readAs = (role?: string) =>
  access.public({ req: { user: role ? { role } : null } } as unknown as AccessArgs)

test("access.public lets admins and editors read drafts", () => {
  assert.equal(readAs("admin"), true)
  assert.equal(readAs("editor"), true)
})

test("access.public limits contributors and visitors to published content", () => {
  const publishedOnly = { _status: { equals: "published" } }
  assert.deepEqual(readAs("contributor"), publishedOnly)
  assert.deepEqual(readAs(), publishedOnly)
})
