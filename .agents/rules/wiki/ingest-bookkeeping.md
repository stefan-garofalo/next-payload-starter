# wiki.ingest-bookkeeping

- id: `wiki.ingest-bookkeeping`
- authority: project decision in `wiki/AGENTS.md`; code evidence `wiki/log.md` header, route `meta.json` files under `wiki/content/docs/`

## Requirement

An ingest updates routed flow and concept pages first, flags contradictions inline, updates each touched route `meta.json`, appends one entry to `wiki/log.md` (most recent 50 kept), and sets `ingested` / `last_ingested` frontmatter in the same ingest.

## Activation

- Paths: `wiki/content/docs/**`, `wiki/log.md`
- Tasks: ingest source material into the wiki

## Verification

The ingest diff touches the routed pages, matching `meta.json`, one new `wiki/log.md` entry, and the ingest frontmatter fields together.

## Exceptions

Edits outside an ingest leave `ingested` / `last_ingested` unchanged.
