import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored third-party build artifact (Paged.js UMD bundle), not our
    // source — see PagePreviewModal.tsx's header comment for why it's
    // loaded as a plain <script> tag instead of an npm import.
    "public/vendor/**",
  ]),
]);

export default eslintConfig;
