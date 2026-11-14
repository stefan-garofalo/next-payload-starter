import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";
import type { ContentGlobal, SlugCollection, TaggedDoc } from "@/server/revalidation";
import { globalTag, tagsForDoc, tagsForMedia } from "@/server/revalidation";
import { invalidateTags } from "@/server/revalidation/sender";

interface MediaDoc {
  id: number;
}

// Every save sends the tags, drafts included: Payload's previousDoc is the
// latest version (possibly a draft), not the published one, so it cannot tell
// whether visitors were affected. A draft save re-renders the same published
// content once.
export const createCollectionAfterChangeRevalidateHook =
  <T extends TaggedDoc>(collection: SlugCollection): CollectionAfterChangeHook<T> =>
  async ({ doc, req }) => {
    await invalidateTags({
      tags: tagsForDoc(collection, doc),
      req,
      source: `${collection}.afterChange`,
    });
    return doc;
  };

export const createCollectionAfterDeleteRevalidateHook =
  <T extends TaggedDoc>(collection: SlugCollection): CollectionAfterDeleteHook<T> =>
  async ({ doc, req }) => {
    await invalidateTags({
      tags: tagsForDoc(collection, doc),
      req,
      source: `${collection}.afterDelete`,
    });
    return doc;
  };

export const createGlobalAfterChangeRevalidateHook =
  (slug: ContentGlobal): GlobalAfterChangeHook =>
  async ({ req }) => {
    await invalidateTags({ tags: [globalTag(slug)], req, source: `${slug}.afterChange` });
  };

// An image edit (file, alt, caption) refreshes every cached entry that shows it.
export const mediaAfterChangeRevalidateHook: CollectionAfterChangeHook<MediaDoc> = async ({
  doc,
  req,
}) => {
  await invalidateTags({ tags: tagsForMedia(doc.id), req, source: "media.afterChange" });
  return doc;
};

export const mediaAfterDeleteRevalidateHook: CollectionAfterDeleteHook<MediaDoc> = async ({
  doc,
  req,
}) => {
  await invalidateTags({ tags: tagsForMedia(doc.id), req, source: "media.afterDelete" });
  return doc;
};
