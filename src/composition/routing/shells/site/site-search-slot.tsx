"use client";

import { remotePageSource } from "@/entities/page/remote";
import { SiteSearch } from "@/features/site-search";
import type { Dictionary } from "@/modules/i18n";

interface SiteSearchSlotProps {
  labels: Dictionary["search"];
}

// Composition selects the Data Source: the search reads pages from Payload's
// REST API. A source holds functions, so it is bound here, on the client.
export const SiteSearchSlot = ({ labels }: SiteSearchSlotProps) => (
  <SiteSearch labels={labels} source={remotePageSource} />
);
