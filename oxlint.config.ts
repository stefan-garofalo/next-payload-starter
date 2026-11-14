// Built by hi update from the selected lint assets; local edits are overwritten.
// Project lint rules belong in oxlint.local.ts, which applies last and is never overwritten.
import { recommended as effectTsgoRecommended } from "@effect/tsgo/oxlint-presets";
import type { OxlintConfig } from "oxlint";
import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import ultraciteNext from "ultracite/oxlint/next";
import ultraciteReact from "ultracite/oxlint/react";
import ultraciteTanstack from "ultracite/oxlint/tanstack";
import ultraciteVitest from "ultracite/oxlint/vitest";

import projectConfig from "./oxlint.local.ts";

const managed = {
  categories: {
    correctness: "error",
  },
  jsPlugins: [
    {
      name: "punks-effect",
      specifier: "@punks/lints/effect",
    },
    {
      name: "effect-js",
      specifier: "@effect/eslint-plugin",
    },
    {
      name: "punks-next",
      specifier: "@punks/lints/next",
    },
    {
      name: "frontend-layers",
      specifier: "./tools/oxlint/frontend-layers/index.mjs",
    },
    {
      name: "react-you-might-not-need-an-effect-js",
      specifier: "eslint-plugin-react-you-might-not-need-an-effect",
    },
    {
      name: "anti-slop",
      specifier: "./tools/oxlint/anti-slop/index.mjs",
    },
  ],
  plugins: ["react"],
  rules: {
    "anti-slop/no-chained-type-assertions": "error",
    "anti-slop/no-conditional-empty-object-spread": "error",
    "anti-slop/no-known-value-widening": "error",
    "anti-slop/no-module-mocking": "error",
    "anti-slop/no-object-parameters": "error",
    "anti-slop/no-reflect-apply": "error",
    "anti-slop/no-reflect-get": "error",
    "anti-slop/no-runtime-typeof": "error",
    "anti-slop/no-shape-in-symbol-names": "error",
    "anti-slop/no-unknown-parameters": "error",
    "anti-slop/no-unknown-returns": "error",
    "anti-slop/no-unknown-type-aliases": "error",
    "anti-slop/no-unsafe-dictionary-type": "error",
    "anti-slop/no-widen-then-assert": "error",
    "anti-slop/require-safety-comment-for-type-assertion": "error",
    "effect-js/no-import-from-barrel-package": [
      "error",
      {
        packageNames: ["effect"],
      },
    ],
    "frontend-layers/composition-shape": "error",
    "frontend-layers/data-source-imports": "error",
    "frontend-layers/index-reexports-only": "error",
    "frontend-layers/known-top-level": "error",
    "frontend-layers/layer-order": "error",
    "frontend-layers/layout-placement": "error",
    "frontend-layers/no-peer-entity": "error",
    "frontend-layers/no-peer-feature": "error",
    "frontend-layers/no-prefix-siblings": "error",
    "frontend-layers/no-prototype-folder": "error",
    "frontend-layers/no-self-index-import": "error",
    "frontend-layers/public-entrypoint": "error",
    "frontend-layers/route-imports": "error",
    "frontend-layers/server-contract-purity": "error",
    "frontend-layers/ui-placement": "error",
    "punks-effect/no-empty-context-run": "error",
    "punks-effect/no-promise-round-trip": "error",
    "punks-effect/no-unowned-fork": "error",
    "punks-effect/run-only-at-edges": "error",
    "punks-effect/suppression-reason": "error",
    "punks-next/leafmost-suspense": "error",
    "react-you-might-not-need-an-effect-js/no-adjust-state-on-prop-change":
      "error",
    "react-you-might-not-need-an-effect-js/no-chain-state-updates": "error",
    "react-you-might-not-need-an-effect-js/no-derived-state": "error",
    "react-you-might-not-need-an-effect-js/no-event-handler": "error",
    "react-you-might-not-need-an-effect-js/no-initialize-state": "error",
    "react-you-might-not-need-an-effect-js/no-pass-data-to-parent": "error",
    "react-you-might-not-need-an-effect-js/no-pass-live-state-to-parent":
      "error",
    "react-you-might-not-need-an-effect-js/no-reset-all-state-on-prop-change":
      "error",
    "typescript/promise-function-async": "off",
  },
} satisfies OxlintConfig;

const project: OxlintConfig = projectConfig;

export default defineConfig({
  ...project,
  categories: { ...managed.categories, ...project.categories },
  extends: [
    core,
    ultraciteNext,
    ultraciteReact,
    ultraciteTanstack,
    ultraciteVitest,
    effectTsgoRecommended,
    ...(project.extends ?? []),
  ],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    ".agents/**",
    ".claude/**",
    ".codex/**",
    ".cursor/**",
    ".devpunks-cache/**",
    ".devpunks/**",
    ".opencode/**",
    "opensrc/**",
    "tools/oxlint/anti-slop/**",
    "tools/oxlint/frontend-layers/**",
    ...(project.ignorePatterns ?? []),
  ],
  jsPlugins: [...managed.jsPlugins, ...(project.jsPlugins ?? [])],
  plugins: [...managed.plugins, ...(project.plugins ?? [])],
  rules: { ...managed.rules, ...project.rules },
});
