import "server-only";
import config from "@payload-config";
import type { Payload } from "payload";
import { getPayload } from "payload";

// The Payload Local API for server readers (entities' remote/server.ts).
export const getCms = async (): Promise<Payload> => await getPayload({ config });
