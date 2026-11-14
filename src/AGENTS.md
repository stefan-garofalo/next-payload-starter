## App Guidance

`src/` owns the Next.js + Payload app:

- `app/(frontend)`: public pages from the `pages` collection at `/` (slug `home`) and `/<slug>`, `not-found`, sitemap. `app/(payload)`: Payload admin and REST/GraphQL API. `app/api/revalidate/tags`: the only place that calls `revalidateTag`.
- `payload/`: collections (`pages`, `users`, `media`), globals (`header`, `footer`), blocks (`hero`, `content`), fields, access, revalidation hooks. `migrations/`: committed schema migrations. `payload-types.ts`: generated.
- `modules/`: shared mechanics. `content` (tagged `"use cache"` readers, tags, routes), `effect` (browser services and the one `AppRuntime`), `machines` (`fromEffect`, the XState ↔ Effect bridge), `query` (TanStack provider and `effectQueryFn`), `i18n` (`en`/`it` dictionaries, `SITE_LANG`), `ui` (shadcn components, theme, primitives).
- `features/`: product slices. `content` renders pages, blocks, header and footer; `site-search` is the reference interactive island (machine + component).

Read every Payload resource on the server through the readers in `modules/content/readers.ts`; Payload hooks invalidate tags only through `/api/revalidate/tags` ([content caching](../wiki/content/docs/project/runbooks/content-caching.md)). Client logic follows the [frontend state architecture](../wiki/content/docs/project/decisions/frontend-state-architecture.md): Effect owns IO and typed failures, XState owns flows, TanStack Query owns cached client reads, and Server Components stay the default. Import Effect modules by path (`effect/Effect`, `effect/http/HttpClient`), never from the `effect` barrel. Read [`../.agents/rules/index.md`](../.agents/rules/index.md) and apply every matching rule. Read [`../opensrc/README.md`](../opensrc/README.md) when work depends on third-party library behavior.

When work here changes setup, contracts, env, or non-obvious behavior, update the relevant `wiki/content/docs/project/` page or runbook in the same task.

## Skills

| Skill | Exact trigger |
| --- | --- |
| [`next-best-practices`](../.agents/skills/next-best-practices/SKILL.md) | Editing routes, layouts, metadata, route handlers, or RSC boundaries under `src/app/` |
| [`next-cache-components`](../.agents/skills/next-cache-components/SKILL.md) | Adding or changing caching, `use cache`, `cacheTag`, or revalidation |
| [`payload`](../.agents/skills/payload/SKILL.md) | Editing `src/payload/**`, `src/payload.config.ts`, `src/migrations/**`, or Payload API usage |
| [`effect`](../.agents/skills/effect/SKILL.md) | Writing Effect programs, schemas, HTTP calls, or tests under `src/modules/effect/`, `src/modules/machines/`, `src/modules/query/effect.ts`, or a feature |
| [`effect-service-design`](../.agents/skills/effect-service-design/SKILL.md) | Adding or changing an Effect service, its `make`/`layer`, or `AppLayer` in `src/modules/effect/runtime.ts` |
| [`tanstack-query`](../.agents/skills/tanstack-query/SKILL.md) | Editing `src/modules/query/` or any `useQuery`/`useMutation` usage |
| [`vercel-react-best-practices`](../.agents/skills/vercel-react-best-practices/SKILL.md) | Writing or reviewing React components, data fetching, or bundle-affecting imports |
| [`vercel-composition-patterns`](../.agents/skills/vercel-composition-patterns/SKILL.md) | Designing component APIs, compound components, or context providers |
| [`async-react-patterns`](../.agents/skills/async-react-patterns/SKILL.md) | Adding Suspense, transitions, `use`, or async server/client data flow |
| [`frontend-domain-structure`](../.agents/skills/frontend-domain-structure/SKILL.md) | Creating or moving code in `src/features/` or `src/modules/` |
| [`design-taste-frontend`](../.agents/skills/design-taste-frontend/SKILL.md) | Designing or restyling a public page or section |
| [`animate`](../.agents/skills/animate/SKILL.md) | Adding motion or transitions |
| [`review-animations`](../.agents/skills/review-animations/SKILL.md) | Reviewing or fixing existing motion |
| [`mobile-native`](../.agents/skills/mobile-native/SKILL.md) | Touch, viewport, or safe-area behavior on phones |
| [`shadcn`](../.agents/skills/shadcn/SKILL.md) | Adding or changing components in `modules/ui/components` (`components.json`) |
| [`agent-browser`](../.agents/skills/agent-browser/SKILL.md) | Verifying user-facing behavior in a real browser |
| [`react-doctor`](../.agents/skills/react-doctor/SKILL.md) | Changing React runtime APIs, or on explicit request |
| [`quality-types`](../.agents/skills/quality-types/SKILL.md) | Adding or changing shared TypeScript types |
| [`tdd`](../.agents/skills/tdd/SKILL.md) | Changing behavior covered by or needing `*.test.ts` (machines, services, tags, routes) |
| [`simplify`](../.agents/skills/simplify/SKILL.md) | Finishing any code change in this scope |
