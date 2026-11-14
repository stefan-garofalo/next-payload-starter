import type { FetchQueryOptions, QueryClient, QueryKey } from "@tanstack/react-query";
import { fromPromise } from "xstate";

export interface QueryActorInput<TParams> {
  client: QueryClient;
  params: TParams;
}

// The only async actor machines invoke: it reads through the query cache
// (fetchQuery), so a cached result returns at once and concurrent readers share
// one request. When the machine leaves the invoking state, XState aborts the
// actor and the query is cancelled, which aborts its queryFn.
export const fromQuery = <TParams, TData, TError, TKey extends QueryKey>(
  toOptions: (params: TParams) => FetchQueryOptions<TData, TError, TData, TKey>,
) =>
  fromPromise<TData, QueryActorInput<TParams>>(async ({ input, signal }) => {
    const options = toOptions(input.params);
    const cancel = () => {
      void input.client.cancelQueries({ queryKey: options.queryKey, exact: true });
    };
    signal.addEventListener("abort", cancel, { once: true });
    try {
      return await input.client.fetchQuery(options);
    } finally {
      signal.removeEventListener("abort", cancel);
    }
  });
