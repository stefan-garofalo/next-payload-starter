import { queryOptions } from "@tanstack/react-query";
import { effectQueryFn } from "@/modules/query";
import type { PageSource } from "./contract";

const SEARCH_STALE_MS = 30_000;

export const pageQueryKeys = {
  search: (term: string) => ["pages", "search", term] as const,
};

// Every page read in the browser goes through the query cache: a repeated
// term is served from it, and concurrent reads of one term share one request.
export const pageSearchQuery = (source: PageSource, term: string) =>
  queryOptions({
    queryKey: pageQueryKeys.search(term),
    queryFn: effectQueryFn(source.search(term)),
    staleTime: SEARCH_STALE_MS,
  });
