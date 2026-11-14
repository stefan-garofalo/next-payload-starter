# Rule Registry

Read every rule whose path or task trigger matches the work. Record each activated rule as `pass`, `fail`, or `not-applicable` with evidence in the handoff or work log.

| Id | Scope | Path trigger | Task trigger | Tags | File |
| --- | --- | --- | --- | --- | --- |
| `root.payload-generic-schema` | root | `src/payload/**`, `src/payload.config.ts`, `src/migrations/**` | add or change a collection, global, block, field, or migration | payload, schema, migrations | [root/payload-generic-schema.md](root/payload-generic-schema.md) |
| `root.payload-types-generated` | root | `src/payload/{collections,globals,fields}/**`, `src/payload.config.ts` | change a Payload field, collection, or global | payload, typegen | [root/payload-types-generated.md](root/payload-types-generated.md) |
| `wiki.source-material-read-only` | wiki | `wiki/raw/**`, `wiki/specs/**` | ingest, summarize, or reconcile source material | wiki, sources | [wiki/source-material-read-only.md](wiki/source-material-read-only.md) |
| `wiki.ingest-bookkeeping` | wiki | `wiki/content/docs/**`, `wiki/log.md` | ingest source material into the wiki | wiki, ingest | [wiki/ingest-bookkeeping.md](wiki/ingest-bookkeeping.md) |
