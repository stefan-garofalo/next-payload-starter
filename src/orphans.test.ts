import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Every module in the frontend layers has an importer in src/. Static
// `from`/`import` and `import()` specifiers count; test files do not.
// ui/components is exempt: it is the shadcn library (components.json), added
// by the CLI ahead of use, and the Next build drops unused files.

const SRC = import.meta.dirname;
const GUARDED = ["composition", "features", "entities", "modules", "integrations", "ui"].map(
  (dir) => path.join(SRC, dir),
);
const LIBRARY = path.join(SRC, "ui/components");
const SOURCE = /\.(?:ts|tsx|js|mjs)$/u;
const TEST = /\.test\.tsx?$/u;
const SPECIFIER = /(?:\bfrom|\bimport)\s*\(?\s*["'](?<specifier>[^"']+)["']/gu;
const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".mjs", "/index.ts", "/index.tsx"];

const isFile = (file: string): boolean => existsSync(file) && statSync(file).isFile();

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, encoding: "utf-8" })
    .map((entry) => path.join(dir, entry))
    .filter((file) => SOURCE.test(file) && !TEST.test(file) && isFile(file));

const resolveSpecifier = (from: string, specifier: string): string | undefined => {
  let base: string | undefined;
  if (specifier.startsWith("@/")) {
    base = path.join(SRC, specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    base = path.resolve(path.dirname(from), specifier);
  }
  return base === undefined ? undefined : EXTENSIONS.map((ext) => base + ext).find(isFile);
};

describe("frontend layers", () => {
  it("leave no file without an importer", () => {
    const imported = new Set<string>();
    for (const file of sourceFiles(SRC)) {
      for (const match of readFileSync(file, "utf-8").matchAll(SPECIFIER)) {
        const target = resolveSpecifier(file, match.groups?.specifier ?? "");
        if (target !== undefined && target !== file) {
          imported.add(target);
        }
      }
    }
    const orphans = GUARDED.flatMap(sourceFiles)
      .filter((file) => !(imported.has(file) || file.startsWith(LIBRARY)))
      .map((file) => path.relative(SRC, file))
      .toSorted();
    expect(orphans).toStrictEqual([]);
  });
});
