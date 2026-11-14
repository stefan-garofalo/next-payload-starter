# root.payload-generic-schema

- id: `root.payload-generic-schema`
- authority: code evidence `src/payload.config.ts`, `src/payload/collections/`, `src/payload/globals/registry/`, `src/payload/fields/blocks.ts`, `src/migrations/`

## Requirement

Payload holds the content model: collections `pages` (blocks `hero`, `content`), `users`, `media`; globals `header`, `footer`. Schema changes ship as committed migrations (`bun run payload:migration:create`), applied by `payload migrate`; `push` stays off. New collections, globals, or blocks enter only through an accepted requirement or spec, and a collection served at a slug joins the tag scheme in `src/modules/content/tags.ts`.

## Activation

- Paths: `src/payload/**`, `src/payload.config.ts`, `src/migrations/**`
- Tasks: add or change a collection, global, block, field, or migration

## Verification

Every schema change in a diff has a matching new file under `src/migrations/`, and the registries list only the set above or link the accepted requirement for an addition.

## Exceptions

None.
