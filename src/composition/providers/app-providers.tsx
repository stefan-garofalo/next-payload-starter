"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getQueryClient } from "@/modules/query";

interface AppProvidersProps {
  children: ReactNode;
}

// The global root providers: one query client per browser session, which
// every async read (useQuery, fromQuery in machines) goes through.
export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
);
