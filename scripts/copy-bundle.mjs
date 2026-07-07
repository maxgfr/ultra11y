#!/usr/bin/env node
// Normalise the source-of-truth bundle (scripts/ultra11y.mjs, produced by
// tsup) and mirror it byte-for-byte into every skill package. Skills ship
// standalone — `npx skills add` copies one skill directory (skills/<name>/),
// so the engine has to live next to each SKILL.md, not just at the repo root.
// Keeping the copies identical is what `check:build` asserts so a published
// skill can never drift from the tested bundle.
//
// REPRODUCIBILITY: esbuild annotates each bundled module with a `// <path>`
// comment derived from where the dependency physically resides in node_modules.
// pnpm may place a transitive dep either hoisted at node_modules/<pkg>/ or in
// its virtual store at node_modules/.pnpm/<pkg>@<version>/node_modules/<pkg>/,
// and the layout differs between a developer's incremental install and CI's
// frozen one. That made the committed bundle non-reproducible and broke
// `check:build`'s `git diff --exit-code`. We canonicalise those store paths to
// the hoisted form so the emitted bundle is byte-identical everywhere.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "scripts", "ultra11y.mjs");
const targets = [
  join(root, "skills", "ultra11y", "scripts", "ultra11y.mjs"),
  join(root, "skills", "review-a11y", "scripts", "ultra11y.mjs"),
];

// node_modules/.pnpm/<pkg>@<version>[_<peerhash>]/node_modules/  ->  node_modules/
const normalizePnpmPaths = (src) =>
  src.replace(/node_modules\/\.pnpm\/[^/]+\/node_modules\//g, "node_modules/");

const normalized = normalizePnpmPaths(readFileSync(source, "utf8"));
writeFileSync(source, normalized);

for (const target of targets) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, normalized);
  console.log(`copy-bundle: ${source} -> ${target}`);
}
