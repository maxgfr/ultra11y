import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runFix } from "../src/fix.js";
import { runAudit } from "../src/audit.js";

const tmps: string[] = [];
function tmp(): string {
  const d = mkdtempSync(join(tmpdir(), "u11y-fix-"));
  tmps.push(d);
  return d;
}
afterEach(() => {
  for (const d of tmps.splice(0)) rmSync(d, { recursive: true, force: true });
});

describe("fix — dry-run vs write", () => {
  it("dry-run reports fixes and a diff but never touches disk", () => {
    const d = tmp();
    const f = join(d, "p.html");
    const before = `<button role="button" tabindex="5">go</button>`;
    writeFileSync(f, before);
    const r = runFix({ inputs: [f] });
    expect(readFileSync(f, "utf8")).toBe(before); // untouched
    const ff = r.files[0]!;
    expect(ff.written).toBe(false);
    expect(ff.diff).toContain("tabindex");
    expect(ff.items.some((i) => i.ruleId === "redundant-aria" && i.fixability === "auto")).toBe(true);
  });

  it("--write applies auto codemods and the re-audit comes back cleaner", () => {
    const d = tmp();
    const f = join(d, "p.html");
    writeFileSync(f, `<button role="button" tabindex="5">go</button>`);
    const before = runAudit({ inputs: [f], dedup: "off" }).findings.length;
    const r = runFix({ inputs: [f], write: true });
    expect(r.files[0]!.written).toBe(true);
    const out = readFileSync(f, "utf8");
    expect(out).not.toContain('role="button"'); // redundant role removed
    expect(out).toContain('tabindex="0"'); // positive tabindex normalised
    const after = runAudit({ inputs: [f], dedup: "off" }).findings.length;
    expect(after).toBeLessThan(before);
  });

  it("inserts fill-in placeholders for missing names (alt/lang/iframe title)", () => {
    const d = tmp();
    const f = join(d, "page.html");
    writeFileSync(f, `<html><head></head><body><img src="x"><iframe src="y"></iframe></body></html>`);
    runFix({ inputs: [f], write: true });
    const out = readFileSync(f, "utf8");
    expect(out).toContain('lang="und"'); // html-lang-missing (valid BCP47 placeholder)
    expect(out).toMatch(/<img src="x" alt="TODO">/); // img-alt-missing
    expect(out).toContain('title="TODO"'); // iframe-title-missing
  });

  it("applies jsxSafe codemods to a real-AST JSX/TSX file and writes it", () => {
    const d = tmp();
    const f = join(d, "C.tsx");
    const before = `export const C = () => <button role="button"><img src="x" /></button>;`;
    writeFileSync(f, before);
    const r = runFix({ inputs: [f], write: true });
    const ff = r.files[0]!;
    expect(ff.lossy).toBe(false);
    expect(ff.written).toBe(true);
    const out = readFileSync(f, "utf8");
    expect(out).not.toContain('role="button"'); // redundant role removed (jsxSafe)
    expect(out).toContain('alt="TODO"'); // img alt placeholder inserted (jsxSafe)
  });

  it("does NOT rewrite name-spelling-sensitive attributes on JSX (tabindex stays put)", () => {
    const d = tmp();
    const f = join(d, "C.tsx");
    const before = `export const C = () => <button tabindex="5">go</button>;`;
    writeFileSync(f, before);
    const r = runFix({ inputs: [f], write: true });
    // positive-tabindex is flagged but its codemod is not jsxSafe → left for the human.
    expect(r.files[0]!.items.some((i) => i.ruleId === "positive-tabindex")).toBe(true);
    expect(readFileSync(f, "utf8")).toBe(before); // untouched
    expect(r.files[0]!.written).toBe(false);
  });

  it("keeps fixes proposal-only when JSX cannot be AST-parsed (lossy fallback)", () => {
    const d = tmp();
    const f = join(d, "C.tsx");
    // adjacent top-level JSX after a comment is not a valid module → AST parse fails
    // → lossy fallback (offsets index the transformed string, so no range edits).
    const before = `{/* x */}<button role="button">go</button><span />`;
    writeFileSync(f, before);
    const warns: string[] = [];
    const r = runFix({ inputs: [f], write: true, onWarn: (m) => warns.push(m) });
    expect(readFileSync(f, "utf8")).toBe(before); // untouched
    expect(r.files[0]!.lossy).toBe(true);
    expect(r.files[0]!.written).toBe(false);
    expect(r.files[0]!.diff).toBe("");
    expect(warns.some((w) => /JSX\/TSX/.test(w))).toBe(true);
  });

  it("uses a valid BCP47 lang placeholder so the fix never introduces lang-invalid", () => {
    const d = tmp();
    const f = join(d, "p.html");
    writeFileSync(f, `<html><head><title>t</title></head><body><p>x</p></body></html>`);
    runFix({ inputs: [f], write: true });
    const out = readFileSync(f, "utf8");
    expect(out).toContain('lang="und"'); // valid (undetermined), not "TODO"
    const ids = new Set(runAudit({ inputs: [f], dedup: "off" }).findings.map((x) => x.ruleId));
    expect(ids.has("html-lang-missing")).toBe(false); // fixed
    expect(ids.has("lang-invalid")).toBe(false); // and no NEW non-conformity swapped in
  });

  it("never rewrites a rendered capture file (generated output)", () => {
    const d = tmp();
    const f = join(d, "Button__x.html");
    const before = `<!-- ultra11y:capture v="1" source="src/Button.tsx" component="Button" -->\n<button role="button" tabindex="5">go</button>`;
    writeFileSync(f, before);
    const r = runFix({ inputs: [f], write: true });
    expect(readFileSync(f, "utf8")).toBe(before); // untouched despite auto-fixable findings
    expect(r.files[0]?.written).toBe(false);
    expect(r.files[0]?.items).toHaveLength(0); // capture skipped entirely — no fix items
  });

  it("--only limits which rules are auto-applied", () => {
    const d = tmp();
    const f = join(d, "p.html");
    writeFileSync(f, `<button role="button" tabindex="5">go</button>`);
    runFix({ inputs: [f], write: true, only: ["positive-tabindex"] });
    const out = readFileSync(f, "utf8");
    expect(out).toContain('tabindex="0"');
    expect(out).toContain('role="button"'); // role NOT removed (not in --only)
  });
});
