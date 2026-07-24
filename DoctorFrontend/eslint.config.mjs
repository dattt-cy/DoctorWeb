import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      // Data-loading effects intentionally enter a loading state before the async request.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    ".next-build-check/**",
    ".next-deploy-check/**",
    "dist/**",
    "out/**",
    "next-env.d.ts",
  ]),
]);
