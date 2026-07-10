import { describe, it, expect, vi } from "vitest";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { groundFinding } from "../src/grounding.js";
import { runAudit } from "../src/audit.js";
import { renderReport } from "../src/report.js";
import { buildWorklist } from "../src/verify.js";
import { checkSemantic } from "../src/check.js";
import { main } from "../src/cli.js";

const NO_CAP = Number.POSITIVE_INFINITY;

// HTML TAG names are case-INSENSITIVE per the HTML spec: `<IMG>` and `<img>` are the
// same element. The audit lowercases the selectorHint it cites (`img`) but the SOURCE
// keeps its original case (`<IMG …>`), so a selector-only citation (no snippet) must
// still ground against an uppercase-tag page. Ids/classes are CSS-case-sensitive and
// must NOT be loosened.
describe("grounding: HTML tag/attr names match case-insensitively (ids/classes do not)", () => {
  const dir = mkdtempSync(join(tmpdir(), "u11y-ground-case-"));
  const upper = join(dir, "UP.html");
  const filler = Array.from({ length: 30 }, (_, i) => `<P>filler ${i}</P>`).join("\n");
  writeFileSync(
    upper,
    `<!DOCTYPE html>
<HTML>
<HEAD><TITLE>Up</TITLE></HEAD>
<BODY>
<IMG SRC="hero.png">
<SELECT><OPTION>a</OPTION></SELECT>
<TABLE><TR><TD>x</TD></TR></TABLE>
<A HREF="/x"></A>
${filler}
</BODY>
</HTML>
`,
  );

  it("grounds a lowercased tag selector against an UPPERCASE-tag source (no snippet)", () => {
    // The engine cites `img`/`select`/`table`; the source is `<IMG>`/`<SELECT>`/`<TABLE>`.
    expect(groundFinding({ file: upper, line: 5, selector: "img" }).ok).toBe(true);
    expect(groundFinding({ file: upper, line: 6, selector: "select" }).ok).toBe(true);
    expect(groundFinding({ file: upper, line: 7, selector: "table" }).ok).toBe(true);
    expect(groundFinding({ file: upper, line: 2, selector: "html" }).ok).toBe(true);
  });

  it("grounds an ATTRIBUTE-name selector case-insensitively (a[href] vs `<A HREF>`)", () => {
    expect(groundFinding({ file: upper, line: 8, selector: "a[href=/x]" }).ok).toBe(true);
  });

  it("GUARD: a wrong-CASE id/class still FAILS (case-sensitivity of ids/classes is preserved)", () => {
    const idFile = join(dir, "id.html");
    writeFileSync(idFile, `<!DOCTYPE html>\n<html lang="en"><body>\n<div id="foo" class="bar">x</div>\n${filler}\n</body></html>\n`);
    // Source id is `foo`/class `bar`; a citation of `#Foo` / `.Bar` must NOT ground.
    expect(groundFinding({ file: idFile, line: 3, selector: "#Foo" }).ok).toBe(false);
    expect(groundFinding({ file: idFile, line: 3, selector: ".Bar" }).ok).toBe(false);
    // …but the correct-case ids/classes DO ground (sanity).
    expect(groundFinding({ file: idFile, line: 3, selector: "#foo" }).ok).toBe(true);
    expect(groundFinding({ file: idFile, line: 3, selector: ".bar" }).ok).toBe(true);
  });
});

// End-to-end: a correct report over an uppercase-tag page must go GREEN through BOTH
// gates that re-ground selector citations (check --semantic and verify --report --apply).
describe("grounding gates green on an uppercase-tag page (check --semantic + verify --apply)", () => {
  const dir = mkdtempSync(join(tmpdir(), "u11y-ground-e2e-"));
  const page = join(dir, "UP.html");
  writeFileSync(
    page,
    `<!DOCTYPE html>
<HTML>
<HEAD><TITLE>Up</TITLE></HEAD>
<BODY>
<IMG SRC="hero.png">
<SELECT><OPTION>a</OPTION></SELECT>
<TABLE><TR><TD>x</TD></TR></TABLE>
<A HREF="/x"></A>
</BODY>
</HTML>
`,
  );
  const audit = runAudit({ inputs: [page] });
  const md = renderReport(audit, "en");
  const reportPath = join(dir, "wcag-report.md");
  writeFileSync(reportPath, md);
  // A faithful, fully-adjudicated verdicts artifact: every NC the report presents, all
  // supported. Nothing here is wrong EXCEPT the source's uppercase tags — the only thing
  // that can still fail the gate is the (buggy) case-sensitive selector grounding.
  const verdicts = buildWorklist(md, "wcag", NO_CAP).map((it) => ({ ...it, verdict: "supported" as const }));
  const verdictsPath = join(dir, "VERIFY.todo.json");
  writeFileSync(verdictsPath, JSON.stringify(verdicts, null, 2));

  it("check --semantic grounds every citation (no false selector-not-found)", () => {
    const sem = checkSemantic(md, { reportPath, verdictsPath, standard: "wcag", lang: "en" });
    expect(sem.issues).toEqual([]);
    expect(sem.ok).toBe(true);
    expect(sem.failed).toBe(0);
  });

  it("verify --report --apply exits 0 (all supported + grounded)", async () => {
    const lo = vi.spyOn(console, "log").mockImplementation(() => {});
    const le = vi.spyOn(console, "error").mockImplementation(() => {});
    const code = await main(["verify", "--apply", verdictsPath, "--report", reportPath]);
    lo.mockRestore();
    le.mockRestore();
    expect(code).toBe(0);
  });
});
