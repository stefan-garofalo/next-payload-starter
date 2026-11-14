/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Prettify } from "@/utils/types"
import type { LANGS } from "./config"
import type en from "./dict/en"

export type Lang = Prettify<keyof typeof LANGS>
// Every dictionary has the shape of the English one.
export type Dictionary = typeof en
export type LangParams = Prettify<{ lang: Lang }>
export type ParamsWithLang<T extends object = object> = LangParams & T

// Deeply merge a union of object types into a single object type.
// - Keys are the union of keys across all members of the union.
// - For each key, the value is the union of that property's values across members;
//   if a member lacks the key, `undefined` is included in the union.
// - If the resulting value is itself a union of objects, the merge recurses.
type DeepMergeUnion<U> = U extends object
  ? {
      [K in keyof U]: DeepMergeUnion<
        U extends any ? (K extends keyof U ? U[K] : undefined) : never
      >
    }
  : U

// Splits a path string into an array of segments
type Split<S extends string, D extends string = "/"> = string extends S
  ? string[]
  : S extends ""
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S]

// Represents the merged structure of all dictionaries in LANGS for any number of languages.
type MergedDictionary = DeepMergeUnion<(typeof LANGS)[keyof typeof LANGS]>

// Navigates the MergedDictionary type using a path array (Split<P>)
// Returns the type at the end of the path, handling undefined possibilities.
type GetTypeFromPath<T, P extends string[]> = P extends []
  ? T
  : P extends [infer First, ...infer Rest]
    ? First extends keyof T
      ? T[First] extends infer Value
        ? Value extends undefined
          ? Rest extends string[]
            ? GetTypeFromPath<NonNullable<Value>, Rest> | undefined
            : Value
          : Rest extends string[]
            ? GetTypeFromPath<Value, Rest>
            : Value
        : undefined
      : undefined
    : never

export type { GetTypeFromPath, MergedDictionary, Split }
