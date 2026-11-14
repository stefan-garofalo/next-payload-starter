import type * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

// A published page found by title search.
export const PageHitSchema = Schema.Struct({
  id: Schema.Finite,
  title: Schema.String,
  slug: Schema.String,
});
export type PageHit = typeof PageHitSchema.Type;

// The search failed: `request` for network, timeout or a non-2xx status;
// `decode` when the response is not the expected body.
// oxlint-disable-next-line unicorn/throw-new-error -- Schema.TaggedError builds a class; nothing is thrown here
export class PageSearchError extends Schema.TaggedError<
  PageSearchError,
  { readonly brand: unique symbol }
>()("PageSearchError", {
  reason: Schema.Literals(["request", "decode"]),
  status: Schema.optional(Schema.Finite),
}) {}

// The port a page Data Source implements. Composition selects the source;
// features take it as an input.
export interface PageSource {
  readonly search: (term: string) => Effect.Effect<readonly PageHit[], PageSearchError>;
}
