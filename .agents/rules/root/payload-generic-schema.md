# root.payload-generic-schema

- id: `root.payload-generic-schema`
- authority: code evidence `src/payload.config.ts`, `src/server/cms/collections/`, `src/server/cms/globals/registry/`, `src/server/cms/fields/blocks.ts`, `src/server/cms/migrations/`

## Requirement

Payload holds the content model: collections `pages` (blocks `hero`, `content`), `users`, `media`; globals `header`, `footer`. Schema changes ship as committed migrations (`bun run payload:migration:create`), applied by `payload migrate`; `push` stays off. New collections, globals, or blocks enter only through an accepted requirement or spec, and a collection served at a slug joins the tag scheme in `src/server/revalidation/tags.ts`.

## Activation

- Paths: `src/server/cms/**`, `src/payload.config.ts`
- Tasks: add or change a collection, global, block, field, or migration

## Verification

Every schema change in a diff has a matching new file under `src/server/cms/migrations/`, and the registries list only the set above or link the accepted requirement for an addition.

## Exceptions

None.
