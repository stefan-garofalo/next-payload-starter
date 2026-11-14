---
title: Content caching
description: Tagged "use cache" readers for Payload content, and how Payload edits revalidate them
surface: project
permission: project
---

## Model

`next.config.ts` sets `cacheComponents: true` (Cache Components). Content stays cached until an edit invalidates it. There is no time-based expiry.

- **Read:** every Payload read on the frontend goes through a tagged reader in an entity's `remote/server.ts` (`src/entities/page/remote/server.ts`, `src/entities/site/remote/server.ts`). Each reader is a `"use cache"` function with `cacheLife("max")` and the tags of the resource it reads. Pages and components do not call Payload directly.
- **Write:** Payload `afterChange` / `afterDelete` hooks (`src/server/cms/revalidation-hooks.ts`, sending through `src/server/revalidation/sender.ts`) send the affected tags to `POST /api/revalidate/tags`.
- **Invalidate:** only that Route Handler (`src/server/revalidation/server.ts`, re-exported at `src/app/api/revalidate/tags/route.ts`) calls `revalidateTag(tag, { expire: 0 })`. `expire: 0` makes the next request render fresh content instead of stale content.

## Tags

The tag helpers are in `src/server/revalidation/tags.ts` (the `server/revalidation` contract).

| Tag             | Set by                                                                     | Sent when                                                |
| --------------- | -------------------------------------------------------------------------- | -------------------------------------------------------- |
| `global:<slug>` | the reader of that global                                                  | the global changes                                       |
| `pages`         | lists of pages (static params, sitemap)                                    | any page changes                                         |
| `page:<slug>`   | the page reader for that slug, also when no page is found                  | a page with that slug changes                            |
| `page-id:<id>`  | the page reader, when it finds a page                                      | that page changes (covers a slug rename or an unpublish) |
| `media:<id>`    | every reader, once per image in its result                                 | that media document changes                              |
| `media`         | a reader whose result shows more than 64 images (Next caps tags per entry) | any media document changes                               |

Each cache entry carries the `media:<id>` tag of every image it shows, so an image edit refreshes only the entries that show it.

## Revalidation request

The hooks send `POST <NEXT_PUBLIC_FRONTEND_URL>/api/revalidate/tags` with header `x-revalidate-secret: <NEXT_REVALIDATE_TAGS_SECRET>` (falls back to `PAYLOAD_SECRET`) and body `{ "tags": [...] }`. The route compares the secret in constant time and accepts only tags that match its content tag pattern.

Payload hooks run inside the database transaction, before it commits. In a Next.js request (admin, REST), the hook sends the tags in `after()`, so they go out after the response and after the commit. Sent earlier, a visitor request could re-render from the old rows and cache them for good. Outside a Next.js request (scripts), `after()` throws and the tags go out at once.

Every save sends the tags, draft saves included: Payload's `previousDoc` is the latest version, not the published one, so a hook cannot tell whether visitors saw a change.

## Add a collection to the tag scheme

For a new collection served at a slug (for example `posts`):

1. In `src/server/revalidation/tags.ts`: add tag helpers (`post:<slug>`, `post-id:<id>`, `posts`), add the collection to `SlugCollection` and `DOC_TAGS`, and extend `CONTENT_TAG_PATTERN`. Tags that do not match the pattern are rejected by the route.
2. In a new entity, `src/entities/<name>/remote/server.ts` (first line `import "server-only"`): add `"use cache"` readers with `cacheLife("max")`, the slug tag before the query, the id tag when a document is found, and the list tag on list readers. Add `mediaTags(...)` for the upload fields the document shows (see `pageMediaIds` in the page entity).
3. On the collection config: add `createCollectionAfterChangeRevalidateHook("<slug>")` and `createCollectionAfterDeleteRevalidateHook("<slug>")`.
4. For a new global: add its slug to `CONTENT_GLOBALS`, the pattern, a reader with `globalTag(slug)`, and `createGlobalAfterChangeRevalidateHook(slug)`.

## Check freshness

Run a production build (`bun run build && bun run start`), edit the document in `/admin`, then reload the route. The next request must show the edit. The server log shows `[revalidate-tags] <source>: <tags>` for each send.
