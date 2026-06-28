#!/usr/bin/env node
// Mirror the source-of-truth bundle (scripts/ultra11y.mjs, produced by tsup)
// byte-for-byte into the skill directory. The skill ships standalone — `npx
// skills add` copies the skill dir — so it needs its own copy of the bundle
// next to its SKILL.md. A plain copy (no transform) keeps the two files
// identical, which is what `check:build` asserts.
//
// The repo ALSO commits a STANDALONE `.agents/skills/<name>/` mirror of the
// whole skill (some harnesses read skills straight from `.agents/`). It must
// stay byte-identical to the canonical `skills/<name>/` copy — it once didn't:
// commit d1df691 trimmed the canonical SKILL.md description (1043 -> 1009 chars,
// to clear Claude Code's 1024-char matcher cap) but left the mirror stale. To
// stop that drift we RE-SYNC the entire skill tree (SKILL.md + engine +
// references) into the mirror here, but only when the mirror already exists —
// repos without an `.agents` mirror are left untouched. verify-skill-bundle
// then asserts the byte-identity, and `check:build`'s git-diff fails if the
// committed mirror ever lags what this script regenerates.
import { copyFileSync, cpSync, existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const name = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).name;
const source = join(root, "scripts", `${name}.mjs`);
const skillDir = join(root, "skills", name);

// 1. Mirror the freshly-built engine into the canonical skill directory.
const engineTarget = join(skillDir, "scripts", `${name}.mjs`);
copyFileSync(source, engineTarget);
console.log(`copy-bundle: ${source} -> ${engineTarget}`);

// 2. Keep the standalone `.agents/skills/<name>/` mirror an exact copy of the
//    canonical skill dir. We wipe and recopy so that added/removed/edited files
//    (SKILL.md, engine, references) all propagate — no stale leftovers.
const mirrorDir = join(root, ".agents", "skills", name);
if (existsSync(mirrorDir)) {
  rmSync(mirrorDir, { recursive: true, force: true });
  cpSync(skillDir, mirrorDir, { recursive: true });
  console.log(`copy-bundle: ${skillDir} -> ${mirrorDir} (.agents mirror resynced)`);
}
