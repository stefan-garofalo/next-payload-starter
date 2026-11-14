import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect"

const eslintConfig = [
  {
    ignores: [
      ".agents/**",
      ".claude/**",
      ".codex/**",
      ".cursor/**",
      ".devpunks/**",
      ".opencode/**",
      "wiki/**",
      "src/migrations/**",
      ".alchemy/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  reactYouMightNotNeedAnEffect.configs.recommended,
]

export default eslintConfig
