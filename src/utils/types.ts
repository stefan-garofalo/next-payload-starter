/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export type Prettify<T> = T extends object
  ? T extends Function | any[] | Date
    ? T
    : {
        [K in keyof T]: Prettify<T[K]>
      } & {}
  : T

/**
 * Recursively make all properties of T optional.
 */
export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>
}
/**
 * Recursively remove null and undefined from T.
 * - Makes object properties required
 * - Preserves function and Date types as-is
 * - Recurses through arrays, sets and maps
 */
export type DeepNonNullable<T> =
  // Strip null/undefined at this level
  [T] extends [null | undefined]
    ? never
    : T extends Function
      ? T
      : T extends Date
        ? T
        : T extends readonly (infer U)[]
          ? readonly DeepNonNullable<NonNullable<U>>[]
          : T extends Set<infer U>
            ? Set<DeepNonNullable<NonNullable<U>>>
            : T extends Map<infer K, infer V>
              ? Map<
                  DeepNonNullable<NonNullable<K>>,
                  DeepNonNullable<NonNullable<V>>
                >
              : T extends object
                ? { [K in keyof T]-?: DeepNonNullable<NonNullable<T[K]>> }
                : NonNullable<T>

/**
 * Helper: remove `number` only when it appears inside a union.
 * - If `T` is exactly `number`, keep it.
 * - If `T` is `number | X`, drop the `number` → `X`.
 */
type StripNumberUnion<T> = [Exclude<T, number>] extends [never]
  ? T
  : Exclude<T, number>

/**
 * Recursively remove Payload relation ID unions (`number | Joined`) and expose only the joined type.
 * - Example: `number | Media` → `Media`
 * - Arrays/Sets/Maps/Objects are traversed recursively.
 * - Plain `number` fields remain `number`.
 * - Depth can be controlled with `MaxDepth` (default JoinedDefaultMaxDepth).
 */
// Extracted to a named constant to avoid magic numbers and allow central tuning
/* biome-ignore lint/style/noMagicNumbers: default recursion cap for Joined<T> */
export type JoinedDefaultMaxDepth = 10

export type Joined<
  T,
  MaxDepth extends number = JoinedDefaultMaxDepth,
> = _Joined<StripNumberUnion<T>, MaxDepth, []>

type _Joined<
  T,
  MaxDepth extends number,
  Seen extends unknown[],
> = Seen["length"] extends MaxDepth // Stop when depth reached
  ? StripNumberUnion<T>
  : T extends Function
    ? T
    : T extends Date
      ? T
      : T extends readonly (infer U)[]
        ? readonly _Joined<StripNumberUnion<U>, MaxDepth, [unknown, ...Seen]>[]
        : T extends Set<infer U>
          ? Set<_Joined<StripNumberUnion<U>, MaxDepth, [unknown, ...Seen]>>
          : T extends Map<infer K, infer V>
            ? Map<
                _Joined<StripNumberUnion<K>, MaxDepth, [unknown, ...Seen]>,
                _Joined<StripNumberUnion<V>, MaxDepth, [unknown, ...Seen]>
              >
            : T extends object
              ? {
                  [K in keyof T]: _Joined<
                    StripNumberUnion<T[K]>,
                    MaxDepth,
                    [unknown, ...Seen]
                  >
                }
              : StripNumberUnion<T>
