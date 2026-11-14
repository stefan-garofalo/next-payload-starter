---
title: Local setup
description: Run the app on your machine with a local Postgres database
surface: project
permission: project
---

## Requirements

- Bun.
- Postgres 16 or 17, on any install (Homebrew, Postgres.app, Docker). Local data stays on your machine.

## 1. Install

```bash
bun install
```

## 2. Create the database

Create an empty database. The default connection string expects user `postgres` on `127.0.0.1:5432` and database `starter`:

```bash
createdb -h 127.0.0.1 -U postgres starter
```

## 3. Set the environment

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable                             | Local value                                                                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URI`                       | `postgres://postgres@127.0.0.1:5432/starter` (default)                                                                        |
| `PAYLOAD_SECRET`                     | `openssl rand -hex 32`                                                                                                        |
| `NEXT_REVALIDATE_TAGS_SECRET`        | `openssl rand -hex 24`. Empty falls back to `PAYLOAD_SECRET`.                                                                 |
| `NEXT_PUBLIC_FRONTEND_URL`           | the URL where `bun run dev` serves the app, such as `https://localhost:3000`. Payload hooks send revalidation requests to it. |
| `S3_*`, `NEXT_PUBLIC_MEDIA_BASE_URL` | leave empty                                                                                                                   |

When the `S3_*` variables are empty, Payload disables the S3 storage and keeps media on the local disk. To use R2 locally, see [R2 media](./r2-media.md).

## 4. Migrate

```bash
bun run payload migrate
```

Payload `push` is disabled everywhere. The schema comes only from the committed migrations in `src/migrations/`.

## 5. Run

```bash
bun run dev
```

`dev` runs `next dev --experimental-https`, so the app serves over HTTPS with a local certificate. Open `/admin` and create the first admin user.

## Language

- The Payload admin supports `en` (fallback) and `it`.
- The public site has one language and no locale routing. `SITE_LANG` in `src/modules/i18n/config/index.ts` selects it (default `en`). The UI strings for each language are in `src/modules/i18n/dict/`.

## Schema changes

After you change a collection, global, block, or field:

```bash
bun run payload:typegen                          # regenerate src/payload-types.ts
bun run payload:migration:create <name>          # write a migration for the change
bun run payload migrate                          # apply it locally
```

Commit the migration with the schema change. Production applies it in its build ([deploy runbook](./deploy-vercel-neon.md#2-build-order)).
