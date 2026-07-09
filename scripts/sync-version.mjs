#!/usr/bin/env node
// Sync the release version across every place it lives, then let the caller
// rebuild the bundle. Invoked by @semantic-release/exec (prepareCmd):
//   node scripts/sync-version.mjs <version>
//
// The version is duplicated in package.json, src/types.ts (the value the bundle
// embeds) and the skill's SKILL.md frontmatter; semantic-release computes it
// from the Conventional Commits, so this keeps them all in lockstep. CHANGELOG.md
// is owned by @semantic-release/changelog and is NOT touched here.
import { readFileSync, writeFileSync } from "node:fs";

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(version)) {
  console.error(`sync-version: expected a semver version, got "${version ?? ""}"`);
  process.exit(1);
}

function edit(path, transform) {
  const before = readFileSync(path, "utf8");
  const after = transform(before);
  if (after === before) {
    console.error(`sync-version: WARNING — no change applied to ${path}`);
  }
  writeFileSync(path, after);
}

const setVersionField = (s) => s.replace(/(\n[ \t]+version:[ \t]*)[^\n]+/, `$1${version}`);

// package.json — the top-level "version" field.
edit("package.json", (s) => s.replace(/("version":\s*")[^"]+(")/, `$1${version}$2`));

// src/types.ts — the VERSION constant the CLI/bundle reports.
edit("src/types.ts", (s) => s.replace(/(export const VERSION = ")[^"]+(";)/, `$1${version}$2`));

// Each skill's SKILL.md — the indented `version:` under the `metadata:` block.
// BOTH skills ship from this repo; forgetting one leaves its published
// frontmatter (and, without the matching .releaserc asset, its bundle) stale.
edit("skills/ultra11y/SKILL.md", setVersionField);
edit("skills/review-a11y/SKILL.md", setVersionField);

console.log(
  `sync-version: set ${version} in package.json, src/types.ts, skills/ultra11y/SKILL.md, skills/review-a11y/SKILL.md`,
);
