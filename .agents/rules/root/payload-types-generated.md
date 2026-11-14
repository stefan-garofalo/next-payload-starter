# root.payload-types-generated

- id: `root.payload-types-generated`
- authority: code evidence `package.json` script `payload:typegen`, generated `src/payload-types.ts`

## Requirement

After a Payload schema change, run `bun run payload:typegen` and commit the regenerated `src/payload-types.ts` with the schema change.

## Activation

- Paths: `src/server/cms/collections/**`, `src/server/cms/globals/**`, `src/server/cms/fields/**`, `src/server/cms/blocks/**`, `src/payload.config.ts`
- Tasks: change a Payload field, collection, or global

## Verification

`bun run payload:typegen` leaves `src/payload-types.ts` unchanged, then `bun run typecheck` passes.

## Exceptions

None.
