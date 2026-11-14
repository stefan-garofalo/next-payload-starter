import assert from "node:assert/strict"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

// Every module under features/ and modules/ui/ has an importer in src/.
// Static `from`/`import` and `import()` specifiers count; test files do not.
// modules/ui/components is exempt: it is the shadcn library (components.json),
// added by the CLI ahead of use, and the Next build drops unused files.

const SRC = fileURLToPath(new URL("..", import.meta.url))
const GUARDED = ["features", "modules/ui"].map((dir) => join(SRC, dir))
const LIBRARY = join(SRC, "modules/ui/components")
const SOURCE = /\.(ts|tsx|js|mjs)$/
const TEST = /\.test\.tsx?$/
const SPECIFIER = /(?:\bfrom|\bimport)\s*\(?\s*["']([^"']+)["']/g
const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".mjs", "/index.ts", "/index.tsx"]

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, encoding: "utf8" })
    .map((entry) => join(dir, entry))
    .filter((path) => SOURCE.test(path) && !TEST.test(path) && statSync(path).isFile())

const resolveSpecifier = (from: string, specifier: string) => {
  const base = specifier.startsWith("@/")
    ? join(SRC, specifier.slice(2))
    : specifier.startsWith(".")
      ? resolve(dirname(from), specifier)
      : null
  if (!base) return null
  const hit = EXTENSIONS.map((ext) => base + ext).find((path) => existsSync(path) && statSync(path).isFile())
  return hit ?? null
}

test("no file under src/features or src/modules/ui is left without an importer", () => {
  const imported = new Set<string>()
  for (const file of sourceFiles(SRC)) {
    for (const [, specifier = ""] of readFileSync(file, "utf8").matchAll(SPECIFIER)) {
      const target = resolveSpecifier(file, specifier)
      if (target && target !== file) imported.add(target)
    }
  }

  const orphans = GUARDED.flatMap(sourceFiles)
    .filter((file) => !(imported.has(file) || file.startsWith(LIBRARY)))
    .map((file) => relative(SRC, file))
    .sort()

  assert.deepEqual(orphans, [])
})
