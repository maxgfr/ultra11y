#!/usr/bin/env node
// Install-bundle gate: prove the repo is shaped so that `npx skills add
// maxgfr/<name>` installs a WORKING skill — engine + references included, not
// just a lone SKILL.md.
//
// The `skills` CLI (skills.sh) early-returns the moment it sees a SKILL.md at
// the repository ROOT and then installs that file ALONE — the sibling
// scripts/ and references/ are dropped. A skill is only bundled whole when its
// SKILL.md lives in a SUBDIRECTORY (skills/<name>/). This script asserts that
// shape and that the embedded engine is byte-identical to the tested bundle.
//
// Run by CI and by `pnpm run verify:bundle`. Pure Node, no deps, no network.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const name = pkg.name;
const skillDir = join(root, "skills", name);
const errors = [];
const ok = (m) => console.log(`  ok   ${m}`);
const bad = (m) => {
  errors.push(m);
  console.log(`  FAIL ${m}`);
};

// 1. No SKILL.md at the repo root (would make `skills add` install it alone).
existsSync(join(root, "SKILL.md"))
  ? bad("a SKILL.md exists at the repo ROOT — `skills add` would install it alone, dropping the engine. Move it to skills/" + name + "/SKILL.md")
  : ok("no root SKILL.md");

// 2. The packaged SKILL.md exists with valid, installable frontmatter.
const skillMd = join(skillDir, "SKILL.md");
if (!existsSync(skillMd)) {
  bad(`missing ${skillMd} — the skill package has no SKILL.md`);
} else {
  const raw = readFileSync(skillMd, "utf8");
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!fm) bad("skills/" + name + "/SKILL.md has no frontmatter block");
  else {
    ok("packaged SKILL.md present with frontmatter");
    const nameLine = fm[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    nameLine === name ? ok(`frontmatter name "${name}" matches package`) : bad(`frontmatter name "${nameLine}" != package name "${name}"`);
    const desc = fm[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (!desc) bad("frontmatter has no description");
    else {
      const len = desc.replace(/^["']|["']$/g, "").length;
      len <= 1024 ? ok(`description ${len} chars (<= 1024 matcher limit)`) : bad(`description ${len} chars exceeds the 1024-char matcher limit`);
    }
  }

  // 3. Every references/*.md mentioned exists, and every file is mentioned.
  const refsDir = join(skillDir, "references");
  if (existsSync(refsDir)) {
    const mentioned = new Set(raw.match(/references\/[a-z0-9-]+\.md/g) ?? []);
    for (const ref of mentioned) existsSync(join(skillDir, ref)) ? ok(`mentioned ${ref} exists`) : bad(`${ref} is mentioned in SKILL.md but missing from the package`);
    for (const f of readdirSync(refsDir).filter((f) => f.endsWith(".md"))) raw.includes(`references/${f}`) ? null : bad(`references/${f} exists but SKILL.md never mentions it`);
    ok(`references/ present (${readdirSync(refsDir).filter((f) => f.endsWith(".md")).length} playbooks)`);
  }
}

// 4. The embedded engine is byte-identical to the committed root bundle.
const engine = `scripts/${name}.mjs`;
const rootEngine = join(root, engine);
const pkgEngine = join(skillDir, engine);
if (!existsSync(rootEngine)) bad(`missing ${engine} at repo root — run \`pnpm run build\``);
else if (!existsSync(pkgEngine)) bad(`missing skills/${name}/${engine} — run \`node scripts/copy-bundle.mjs\``);
else readFileSync(rootEngine).equals(readFileSync(pkgEngine))
  ? ok(`embedded engine skills/${name}/${engine} is byte-identical to ${engine}`)
  : bad(`skills/${name}/${engine} differs from ${engine} — run \`node scripts/copy-bundle.mjs\` and commit`);

if (errors.length) {
  console.error(`\nverify-skill-bundle: ${errors.length} problem(s) — the published skill would not install correctly.`);
  process.exit(1);
}
console.log(`\nverify-skill-bundle: ok — skills/${name}/ installs as a complete skill.`);
