import { isServer, QueryClient } from "@tanstack/react-query";

const makeQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

let browserClient: QueryClient | undefined;

// TanStack's Next.js pattern: a fresh client per server render, one client
// per browser session. Machines read through it with fromQuery, components
// with useQuery.
export const getQueryClient = (): QueryClient => {
  if (isServer) {
    return makeQueryClient();
  }
  browserClient ??= makeQueryClient();
  return browserClient;
};
