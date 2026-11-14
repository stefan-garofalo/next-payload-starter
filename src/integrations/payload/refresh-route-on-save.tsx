"use client";

import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { env } from "@/env";

// Payload live preview: refreshes the route when the admin saves a draft.
export const RefreshRouteOnSave = () => {
  const router = useRouter();
  const refresh = () => {
    router.refresh();
  };
  return <PayloadLivePreview refresh={refresh} serverURL={env.NEXT_PUBLIC_FRONTEND_URL} />;
};
