import { defineConfig } from "tsup";

// Bundles the TypeScript engine into a single, dependency-free ESM script
// (scripts/ultra11y.mjs) that any agent sandbox can run with `node` — no
// `npm install` required at skill-use time. `scripts/copy-bundle.mjs` then
// mirrors the byte-exact bundle into the skill dir so it installs standalone.
// The committed bundles are verified reproducible in CI via `pnpm run check:build`.
export default defineConfig({
  entry: { ultra11y: "src/cli.ts" },
  outDir: "scripts",
  format: ["esm"],
  outExtension: () => ({ js: ".mjs" }),
  target: "node22",
  platform: "node",
  bundle: true,
  // tsup externalises packages listed in `dependencies` by default; force them
  // into the bundle so the shipped .mjs is truly standalone (no node_modules at
  // skill-use time). domhandler is type-only but listed for safety.
  noExternal: ["htmlparser2", "domhandler", "@babel/parser"],
  clean: false,
  minify: false,
  splitting: false,
  sourcemap: false,
  banner: { js: "#!/usr/bin/env node" },
});
