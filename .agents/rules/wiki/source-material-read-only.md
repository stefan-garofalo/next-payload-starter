# wiki.source-material-read-only

- id: `wiki.source-material-read-only`
- authority: project decision in `wiki/AGENTS.md`; code evidence `wiki/raw/{assets,external,meetings}/`, `wiki/specs/`

## Requirement

Treat `wiki/raw/` and `wiki/specs/` as human-authored source material: read them, and write derived knowledge into routed pages under `wiki/content/docs/project/`.

## Activation

- Paths: `wiki/raw/**`, `wiki/specs/**`
- Tasks: ingest, summarize, or reconcile source material

## Verification

The diff has no edits under `wiki/raw/` and no requirement rewrites under `wiki/specs/` unless the human asked for them.

## Exceptions

A human explicitly asks to add or correct a source file.
