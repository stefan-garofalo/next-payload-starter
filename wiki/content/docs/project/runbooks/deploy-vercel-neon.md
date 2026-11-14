---
title: Deploy on Vercel with Neon
description: Provision production on Vercel with a Neon Postgres database, and keep Preview builds away from the schema
surface: project
permission: project
---

## Vercel login

The repo has its own Vercel CLI login. With direnv, `vercel` in the repo runs `scripts/bin/vercel`, which keeps credentials in `.vercel/cli` (gitignored). Your global login is not touched, so production resources go to the account you log in with here, not to a shared global account.

```bash
direnv allow     # once per clone
vercel login     # first time on a machine: stores the login in .vercel/cli
vercel whoami    # in the repo: the project account
```

Agents without the direnv shell hook run `direnv exec . vercel …`.

Vercel Hobby allows only non-commercial use. A commercial site needs the Pro plan.

## 1. Create the project and database

```bash
vercel link --yes --project <project> --scope <team>             # also connects the GitHub repo
vercel integration add neon --plan free_v3 -m region=fra1 -m auth=false --name <project>-db
vercel env ls                                                     # Neon adds DATABASE_URL (and related) variables
```

`vercel.json` pins functions to `fra1`. Pick the Neon region next to it.

The app reads these variables:

| Variable                                                                                  | Value                                                                                                                    | Environments        |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| `DATABASE_URI`                                                                            | not set on Vercel: `src/env.ts` falls back to Neon's pooled `DATABASE_URL`                                               | —                   |
| `PAYLOAD_SECRET`                                                                          | `openssl rand -hex 32`                                                                                                   | all                 |
| `NEXT_REVALIDATE_TAGS_SECRET`                                                             | `openssl rand -hex 24`                                                                                                   | all                 |
| `NEXT_PUBLIC_FRONTEND_URL`                                                                | not set on Vercel: falls back to `https://` + `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` (the custom domain once added) | —                   |
| `NEXT_PUBLIC_APP_NAME`                                                                    | the site name                                                                                                            | all                 |
| `NO_INDEX`                                                                                | `true` on Preview; `true` on Production until launch                                                                     | Production, Preview |
| `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET`, `NEXT_PUBLIC_MEDIA_BASE_URL` | written by `bun run infra:deploy` ([R2 media](./r2-media.md))                                                            | Production, Preview |

Preview and Production share one database. So:

- `NEXT_PUBLIC_FRONTEND_URL` resolves to the production URL on Preview too. A content edit made in a Preview admin revalidates production, which shows the same rows.
- `PAYLOAD_SECRET` and `NEXT_REVALIDATE_TAGS_SECRET` hold the same value in Production and Preview.

Some Vercel CLI versions (seen on 50.25.1) loop on `vercel env add <key> preview` without a branch. If that happens, create each variable once for both targets with the REST API: `POST /v10/projects/<id>/env`, body `[{key, value, type, target: ["production", "preview"]}]`.

Without the S3 variables, Payload disables the S3 storage and uploads go to the local disk, which does not persist on Vercel. Deploy the media stack before editors upload media.

## 2. Build order

`bun run build` runs `sh scripts/migrate-unless-preview.sh && next build`:

1. `payload migrate` applies the committed migrations in `src/server/cms/migrations/` to the database. Payload `push` is off everywhere. **Vercel Preview builds skip this step**: they share the production database, so a Preview of an unmerged schema change would change production before merge. Instead, that Preview build fails when its code needs a migration that production does not have yet.
2. `next build` prerenders the static shells. It reads Payload, so the database must be reachable at build time.

A schema change always ships with a new migration: `bun run payload:migration:create <name>`, then commit it. Production applies it on the next deploy.

To give Previews their own schema, use a Neon branch per Preview deployment and remove the skip.

## 3. First admin

After the first production deploy, open `/admin` on the production URL and create the first admin user.

## 4. Launch checklist

- [ ] Domain added in Vercel; redeploy (the frontend URL follows the production domain).
- [ ] `NO_INDEX` removed from Production; redeploy.
- [ ] Media on a custom domain (`MEDIA_DOMAIN`, see [R2 media](./r2-media.md)); Vercel redeployed.
- [ ] Search console property verified; `sitemap.xml` submitted.
