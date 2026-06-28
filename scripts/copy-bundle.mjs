#!/usr/bin/env node
// Mirror the source-of-truth bundle (scripts/ultra11y.mjs, produced by tsup)
// byte-for-byte into the skill package. The skill ships standalone — `npx
// skills add` copies the skill directory (skills/ultra11y/), so the engine
// has to live next to its SKILL.md, not just at the repo root. A plain copy
// (no transform) keeps the two files identical, which is what `check:build`
// asserts so the published skill can never drift from the tested bundle.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "scripts", "ultra11y.mjs");
const targets = [join(root, "skills", "ultra11y", "scripts", "ultra11y.mjs")];

for (const target of targets) {
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
  console.log(`copy-bundle: ${source} -> ${target}`);
}
