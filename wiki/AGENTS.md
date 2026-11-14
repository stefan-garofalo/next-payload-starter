## Wiki Guidance

## Skills

| Skill                                                                                   | Exact trigger                                                        |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [`next-best-practices`](../.agents/skills/next-best-practices/SKILL.md)                 | Editing wiki routes, layouts, or `next.config.mjs`                   |
| [`vercel-react-best-practices`](../.agents/skills/vercel-react-best-practices/SKILL.md) | Writing or reviewing React components under `wiki/src/`              |
| [`vercel-composition-patterns`](../.agents/skills/vercel-composition-patterns/SKILL.md) | Designing wiki component APIs                                        |
| [`design-taste-frontend`](../.agents/skills/design-taste-frontend/SKILL.md)             | Restyling wiki pages or layout                                       |
| [`agent-browser`](../.agents/skills/agent-browser/SKILL.md)                             | Verifying rendered wiki routes in a browser                          |
| [`domain-modeling`](../.agents/skills/domain-modeling/SKILL.md)                         | Editing a glossary or recording an ADR under `content/docs/project/` |
| [`writing-for-agents`](../.agents/skills/writing-for-agents/SKILL.md)                   | Editing `repo-guidance/` pages or any doc an agent reads             |
| [`simplify`](../.agents/skills/simplify/SKILL.md)                                       | Finishing any code change in `wiki/src/` or `wiki/scripts/`          |

`wiki/` owns the Next.js/Fumadocs project wiki: specs, raw inputs, routed project docs, decisions, runbooks, maintenance notes, and ingest bookkeeping. App implementation belongs in `src/` unless a wiki route, docs build, or content sync script (`scripts/sync-content.mjs`) requires it.

Canonical project operations live in `content/docs/project/`. The backlog provider is pinned in `backlog-provider.md`; the wiki framework in `wiki-framework.md`. Read [`../.agents/rules/index.md`](../.agents/rules/index.md) and apply every matching rule.

For Fumadocs, Next.js, React, or MDX behavior, use official docs first; when source behavior matters, run `opensrc path --cwd . <package>`.

When work here changes setup, workflow, contracts, decisions, or non-obvious behavior, update the relevant `content/docs/project/` page or runbook in the same task.
