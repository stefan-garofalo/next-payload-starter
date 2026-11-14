// biome-ignore lint/style/noExportedImports: the type is also needed outside of this module
import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// shadcn components import `cn` too (components.json `aliases.utils`).
export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args))
}
export type { ClassValue }
