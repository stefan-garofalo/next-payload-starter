# DP scaffold monorepo wiki

`dp scaffold init` creates `wiki/package.json`, so the later `dp scaffold setup` detects this repo as monorepo-shaped even though the product app is a single root Next/Payload project. That is expected: reconcile root and `wiki/` prompt files manually, keep `wiki/CLAUDE.md` and root `CLAUDE.md` as symlink mirrors, and do not treat the scaffolded wiki Oxlint config as approval to replace the root ESLint/Biome policy.
