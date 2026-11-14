import type { Metadata } from "next";
import { getPageBySlug } from "@/entities/page/remote/server";
import { HOME_SLUG } from "@/server/pages";
import { PageTemplate, pageMetadata } from "../page/page-template";

export const generateHomeMetadata = async (): Promise<Metadata> =>
  pageMetadata(await getPageBySlug(HOME_SLUG));

// The page with the slug "home", at "/".
export const HomePage = () => <PageTemplate page={getPageBySlug(HOME_SLUG)} />;
