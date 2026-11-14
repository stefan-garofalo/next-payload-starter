---
title: R2 media
description: Store Payload media in one Cloudflare R2 bucket, managed by alchemy.run.ts
surface: project
permission: project
---

`alchemy.run.ts` declares the media infrastructure: one R2 bucket and the sync of its variables to Vercel. Payload's S3 adapter reads those variables. When they are unset (local default), Payload keeps media on the local disk.

## Cloudflare login

`.envrc` exports `ALCHEMY_PROFILE=starter`, an Alchemy profile kept apart from `default`. Rename it per project in `.envrc`; the `infra:*` scripts read it from the environment. Connect the profile once per machine, in your own terminal (Alchemy refuses interactive login inside coding agents):

```bash
bunx alchemy profile edit --profile "$ALCHEMY_PROFILE" --add Cloudflare   # choose OAuth; pick the account that owns the bucket
```

A new Cloudflare account needs two one-time steps before the first deploy:

- **workers.dev subdomain**, for Alchemy's state-store Worker. Open Workers in the dashboard once, or `PUT /accounts/<id>/workers/subdomain` with `{"subdomain": "<name>"}`.
- **Enable R2** in the dashboard (R2 Object Storage → add a payment method → purchase the $0 plan). There is no API for this step. R2 asks for a payment method even inside the free tier.

Alchemy keeps its state in the Cloudflare account (`Cloudflare.state()`: an encrypted state-store Worker). Create it once:

```bash
bunx alchemy provider cloudflare bootstrap --profile "$ALCHEMY_PROFILE"
```

## R2 API token and admin origins

The OAuth login has no scope to create API tokens, so the S3 key is the one dashboard step. Create it once: R2 → API Tokens → Create Account API token, permission **Object Read & Write**, applied to the media bucket only (`starter-media`; rename it per project in `alchemy.run.ts`, with the stack name `Starter`). Put its Access Key ID and Secret Access Key in `.envrc.local` (gitignored), next to the required admin origins:

```bash
export R2_ACCESS_KEY_ID=…
export R2_SECRET_ACCESS_KEY=…
export ADMIN_ORIGINS=https://<project>.vercel.app,https://example.com   # comma-separated origins that serve /admin
```

Use the default S3 endpoint `https://<account>.r2.cloudflarestorage.com`. The `eu.` endpoint serves only EU-jurisdiction buckets.

## Deploy

```bash
bun run infra:plan     # show the changes
bun run infra:deploy   # apply them
```

Agents pass `--no-input --yes` to `alchemy deploy`. Do not set `CI=1`: it makes Alchemy read credentials from env instead of the profile.

The deploy creates or updates:

- **One R2 bucket.** CORS: `GET`/`HEAD` from any origin, so production, Preview, and local pages can read media (also in CORS mode, such as CSS masks). `PUT` only from the origins in `ADMIN_ORIGINS`. Add each origin that serves `/admin`, then deploy again.
- **`Command.Exec` → `scripts/sync-vercel-env.ts`.** It writes `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET`, and `NEXT_PUBLIC_MEDIA_BASE_URL` to Vercel Production and Preview. It uses the repo-local Vercel login (`scripts/bin/vercel`, `.vercel/cli`) and the linked project (`.vercel/project.json`). It runs again when a value or the script changes. Redeploy Vercel afterwards.

## Media domain

- Without `MEDIA_DOMAIN`, the bucket has public `r2.dev` access. `r2.dev` is rate-limited: use it before launch only.
- With the zone on Cloudflare: `MEDIA_DOMAIN=media.<domain> bun run infra:deploy` attaches the custom domain and turns `r2.dev` off. Add the site origin to `ADMIN_ORIGINS` when `/admin` moves to the custom domain. Add a Cloudflare Cache Rule for `media.<domain>` with a long edge TTL, so the edge answers repeat reads. Redeploy Vercel: media URLs are computed on read.

## How uploads and URLs work

- **Uploads go from the browser straight to R2** (`clientUploads`). This bypasses the Vercel 4.5 MB function body limit. The server then reads the file back from R2 into a temp file to make the image sizes. `req.file.data` is empty, so a `beforeChange` hook that needs the bytes reads `req.file.tempFilePath`.
- **Every media URL points at the bucket domain**, admin thumbnails included. `disablePayloadAccessControl` is on: Payload's `/api/media/file/*` route reads R2 only for an upload in progress.
- **Media URLs carry `?v=<updatedAt>`.** A replaced file gets a new URL, so a cached URL can live forever and a long edge TTL never serves a stale file.
- Each cached page carries a `media:<id>` tag per image it shows. An image edit refreshes only those pages ([content caching](./content-caching.md)).
