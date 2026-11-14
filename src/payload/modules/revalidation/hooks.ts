import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload"
import { type ContentGlobal, globalTag, type SlugCollection, tagsForDoc, tagsForMedia } from "@/modules/content/tags"
import { invalidateTags } from "./sender"

type DocLike = { id: number | string; slug?: string | null }

export const createCollectionAfterChangeRevalidateHook = <T extends DocLike>(
  collection: SlugCollection
): CollectionAfterChangeHook<T> => {
  // Every save sends the tags, drafts included: Payload's previousDoc is the
  // latest version (possibly a draft), not the published one, so it cannot
  // tell whether visitors were affected. A draft save re-renders the same
  // published content once.
  return async ({ doc, req }) => {
    await invalidateTags({
      tags: tagsForDoc(collection, doc),
      req,
      source: `${collection}.afterChange`,
    })
    return doc
  }
}

export const createCollectionAfterDeleteRevalidateHook = <T extends DocLike>(
  collection: SlugCollection
): CollectionAfterDeleteHook<T> => {
  return async ({ doc, req }) => {
    await invalidateTags({
      tags: tagsForDoc(collection, doc),
      req,
      source: `${collection}.afterDelete`,
    })
    return doc
  }
}

export const createGlobalAfterChangeRevalidateHook = (
  slug: ContentGlobal
): GlobalAfterChangeHook => {
  return async ({ doc, req }) => {
    await invalidateTags({
      tags: [globalTag(slug)],
      req,
      source: `${slug}.afterChange`,
    })
    return doc
  }
}

// An image edit (file, alt, caption) refreshes every cached entry that shows it.
export const mediaAfterChangeRevalidateHook: CollectionAfterChangeHook = async ({ doc, req }) => {
  await invalidateTags({ tags: tagsForMedia(doc.id), req, source: "media.afterChange" })
  return doc
}

export const mediaAfterDeleteRevalidateHook: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await invalidateTags({ tags: tagsForMedia(doc.id), req, source: "media.afterDelete" })
  return doc
}
