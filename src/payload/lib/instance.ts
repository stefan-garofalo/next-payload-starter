import { getPayload } from "payload"
import config from "@/payload.config"

export default async function getInstance() {
  return await getPayload({ config })
}
