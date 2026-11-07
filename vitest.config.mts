import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    // Next.js 16 subpath entrypoints are extensionless; Vite's ESM resolver
    // needs the explicit `.js` files when running unit tests.
    alias: {
      "next/link": "next/link.js",
      "next/navigation": "next/navigation.js",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Unit tests use `*.test.*`; Playwright specs live in `tests/` and run separately.
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "tests/**"],
    server: {
      deps: {
        // Let Vite resolve next-intl's `next/*` imports (and the aliases above).
        inline: ["next-intl"],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.d.ts"],
    },
  },
});
