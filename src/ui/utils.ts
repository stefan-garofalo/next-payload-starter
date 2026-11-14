import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn components import `cn` too (components.json `aliases.utils`).
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
