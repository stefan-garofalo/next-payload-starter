import { defineConfig } from "oxlint";

// Every asynchronous read in the browser goes through the TanStack Query cache
// (wiki decision frontend-state-architecture). These rules keep the other doors shut.
const QUERY_CACHE =
  "Browser data goes through TanStack Query: read with useQuery or a machine's fromQuery actor.";

export default defineConfig({
  rules: {
    "no-restricted-globals": [
      "error",
      {
        name: "fetch",
        message: `${QUERY_CACHE} fetch belongs in an entity's remote/ Data Source, run by a queryFn.`,
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "xstate",
            importNames: ["fromPromise", "fromCallback", "fromObservable", "fromEventObservable"],
            message: `${QUERY_CACHE} Machines invoke async work only through fromQuery (@/modules/machines).`,
          },
          {
            name: "effect/ManagedRuntime",
            message: "Browser Effects run on AppRuntime (@/modules/effect), inside effectQueryFn.",
          },
        ],
        patterns: [
          {
            group: ["@/modules/effect", "@/modules/effect/*"],
            message: `${QUERY_CACHE} Run Effect programs with effectQueryFn (@/modules/query).`,
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["src/entities/*/remote/**", "src/server/**", "scripts/**"],
      rules: { "no-restricted-globals": "off" },
    },
    { files: ["src/modules/machines/**"], rules: { "no-restricted-imports": "off" } },
    {
      files: ["src/modules/query/**", "src/modules/effect/**"],
      rules: { "no-restricted-imports": "off" },
    },
  ],
});
