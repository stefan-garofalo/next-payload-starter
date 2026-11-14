// Run by alchemy.run.ts (Command.Exec): writes the R2 media variables to the
// Vercel project for Production and Preview. Uses this repo's Vercel login
// (.vercel/cli, see scripts/bin/vercel) and the linked project (.vercel/project.json).
import { readFileSync } from "node:fs"

const KEYS = ["S3_ENDPOINT", "S3_BUCKET", "S3_ACCESS_KEY_ID", "S3_SECRET", "NEXT_PUBLIC_MEDIA_BASE_URL"]
const PUBLIC_KEYS = new Set(["NEXT_PUBLIC_MEDIA_BASE_URL", "S3_ENDPOINT", "S3_BUCKET"])

const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"))
const { token } = readJson(".vercel/cli/auth.json")
const { projectId, orgId } = readJson(".vercel/project.json")

const body = KEYS.map((key) => {
  const value = process.env[key]
  if (!value) throw new Error(`${key} is not set`)
  return {
    key,
    value,
    type: PUBLIC_KEYS.has(key) ? "plain" : "encrypted",
    target: ["production", "preview"],
  }
})

const response = await fetch(
  `https://api.vercel.com/v10/projects/${projectId}/env?upsert=true&teamId=${orgId}`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }
)
if (!response.ok) throw new Error(`Vercel env sync failed: ${response.status} ${await response.text()}`)
console.log(`Vercel env synced: ${KEYS.join(", ")}`)
