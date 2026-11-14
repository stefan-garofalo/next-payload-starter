## Root Guidance

Before working in a directory, read every `AGENTS.md` from the root down to each touched path. Before touching code, read [`.agents/rules/index.md`](.agents/rules/index.md) and apply every rule whose path or task trigger matches.

## Surface Map

| Surface | Owns | Stays elsewhere |
| --- | --- | --- |
| `src/` ([`src/AGENTS.md`](src/AGENTS.md)) | Next.js + Payload starter: frontend `src/app/(frontend)` (pages at `/` and `/<slug>`), Payload admin/API `src/app/(payload)`, schema `src/payload/`, migrations `src/migrations/`, shared modules `src/modules/` (content readers, Effect runtime, XState bridge, query, i18n, ui), features `src/features/`, generated `src/payload-types.ts` | Durable requirements, specs, decisions, runbooks |
| `wiki/` ([`wiki/AGENTS.md`](wiki/AGENTS.md)) | Fumadocs project wiki: requirements, specs, decisions, runbooks, backlog context, ingest bookkeeping | App runtime code |
| Root config: `alchemy.run.ts` (R2 bucket, Vercel env sync), `next.config.ts`, `vercel.json`, `scripts/` | Infra and deploy wiring | Runtime app code |
| `.agents/`, `.devpunks/` | Harness skills, rules, hooks, subagent manifest, `hi` installed record | Product code; `hi update` owns copied and built artifacts |

Route single-surface work to that surface's prompt. For cross-surface work, name the owning surfaces before editing.

## Workflow Routing

- Explicit human request for `business-finder` or `functional-finder` → that Finder.
- Unclear requirements or product decisions → `requirements-phase`. The backlog provider is GitHub; each project sets its board URL with `hi ensure` ([backlog provider](wiki/backlog-provider.md)).
- Product design with existing evidence → `design-phase`.
- Implementation from an accepted spec, issue, or plan → `delivery-phase`.
- Runtime failures, crashes, broken local flows → `debugging-phase`.
- Review requests, branch or PR reviews → `review-phase`: one fresh reviewer, at most five P0–P2 findings with `file:line` references; deeper redesign → `improve-codebase-architecture`.
- Docs or knowledge updates after proven changes → `docs-ingest-phase`.
- Readonly investigation across independent surfaces or hypotheses → `parallel-research`.

Hand implementation to scoped workers in plan-derived waves; launch every unblocked task with a disjoint write scope. Before relying on subagents, verify the active agent settings, then `.agents/subagents/manifest.mjs` and the specialist's owned paths, guidance files, and skills.

## Cross-Surface Contracts

- Payload schema, `src/payload-types.ts`, and their frontend consumers change together.
- Env and config changes (`src/env.ts`, `next.config.ts`, `alchemy.run.ts`, origins, callbacks, CORS, revalidation targets) land with the wiki runbook that documents them.
- Product logic stays in its owning surface.

## Validation Routing

- Run the narrowest proof first: `bun run typecheck`, `bun run lint`, `bun test`, then `bun run build` when routing or config changes.
- Schema change → `bun run payload:typegen` and `bun run payload:migration:create`; route change → `bun run next:typegen`.
- Infra change → `bun run infra:plan`.
- User-facing change → browser check of the affected route, plus `design-taste-frontend` inspect for page design.
- Content or cache change → production build, edit in Payload, confirm the next request shows it (tag freshness).
- Record every expected validation that cannot run as a blocker.

## Repository-Wide Rules

- Use Bun for repo commands.
- Every authored `AGENTS.md` is the source of truth; keep a sibling `CLAUDE.md` symlink pointing to it.
- Write local URLs portless-first: stable local subdomains over raw `localhost:<port>` in examples, callbacks, allowed origins, CORS, and app-to-app proxies.
- For external library behavior, use official docs first. When docs fall short, read `opensrc/<package>.md` if present, then `opensrc path --cwd . <package>`; core libraries are `next`, `react`, `@tanstack/react-query`, `payload`, `effect`, and `xstate`.

When work changes setup, workflow, contracts, architecture, deployment, or non-obvious behavior, update the relevant `wiki/content/docs/project/` page or runbook in the same task.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
