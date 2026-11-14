# Next Payload Starter

A Next.js 16 + Payload 3 starter: Postgres, media on Cloudflare R2, deployed on Vercel. The UI uses shadcn/ui on Base UI and Tailwind 4. Client logic runs on Effect v4, XState v5 and TanStack Query.

## What is inside

- **CMS**: Payload with `pages` (blocks `hero`, `content`), `users` (admin, editor and contributor roles), `media` and the `header` and `footer` globals. Drafts, the SEO plugin and committed migrations are set up. The admin is in English and Italian.
- **Rendering**: Cache Components. Every Payload read goes through tagged `"use cache"` readers. Payload hooks invalidate exactly the touched tags, so pages stay static and refresh on the next request after an edit.
- **Media**: the Payload S3 adapter writes to an R2 bucket that `alchemy.run.ts` creates. Admin uploads go from the browser straight to R2. Without the S3 variables, media stays on local disk.
- **Client logic**: every async read goes through the TanStack Query cache. Entities expose `queryOptions` whose `queryFn` runs an Effect program (typed errors, Schema decoding) through `effectQueryFn`. XState machines own the flows and read only through `fromQuery`, so leaving a state cancels the query, its Effect and its request. Lint rejects `fetch`, ad-hoc promise actors and Effect runs outside that path. The reference island is `src/features/site-search` (Cmd/Ctrl+K).
- **Structure and lint**: the fixed frontend layer model (`app` → `composition` → `features` → `entities` → `modules` → `integrations` → `ui`, plus `server`), enforced by managed oxlint with every `hi` asset and type-aware rules on tsrs. Oxfmt formats; the lefthook commit gate runs both on staged files.
- **i18n**: `en` and `it` UI dictionaries. `SITE_LANG` in `src/modules/i18n/config.ts` picks the site language.
- **Harness**: `hi` baseline with skills, rules, hooks and subagents in `.agents/` and `.devpunks/`, plus a Fumadocs project wiki in `wiki/`.

## Start

```bash
bun install
cp .env.example .env    # set DATABASE_URI and PAYLOAD_SECRET
bun run payload migrate
bun run dev             # then create the first admin at /admin
```

The runbooks in `wiki/content/docs/project/runbooks/` cover each step: local setup, deploying to Vercel with Neon, R2 media and content caching.

## Commands

| Command                                               | Does                                            |
| ----------------------------------------------------- | ----------------------------------------------- |
| `bun run dev`                                         | Dev server (HTTPS)                              |
| `bun run typecheck` / `bun run lint` / `bun run test` | Types, managed oxlint (tsrs type-aware), vitest |
| `bun run format`                                      | Format with oxfmt                               |
| `bun run build`                                       | Migrate (except Vercel Preview) and build       |
| `bun run payload:typegen`                             | Regenerate `src/payload-types.ts`               |
| `bun run payload:migration:create`                    | New migration after a schema change             |
| `bun run infra:plan` / `bun run infra:deploy`         | Plan or apply the R2 bucket and Vercel env      |

## Make it yours

1. Rename `name` in `package.json`, `ALCHEMY_PROFILE` in `.envrc`, and the stack and bucket names in `alchemy.run.ts`.
2. Set `NEXT_PUBLIC_APP_NAME`, and `SITE_LANG` if the site is Italian.
3. Restyle through the theme variables in `src/app/(frontend)/globals.css`.
4. Run `hi ensure` to set the backlog project URL, then `hi check`.
