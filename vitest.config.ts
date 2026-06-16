import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Fixtures are sample HTML/JSX audited by the engine, and audits/ holds
    // generated reports — never collect tests from those trees.
    exclude: [...configDefaults.exclude, "tests/fixtures/**", "audits/**"],
  },
});
