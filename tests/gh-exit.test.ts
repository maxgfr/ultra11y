import { describe, it, expect, vi, beforeEach } from "vitest";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Mock the gh runner: `gh auth status` + `gh issue list` succeed (so creation is
// attempted), but every `gh issue create` FAILS with a real stderr message.
vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }));
import { execFileSync } from "node:child_process";
import { runAudit } from "../src/audit.js";
import { pushIssues, createIssue } from "../src/gh.js";
import { main } from "../src/cli.js";
import type { PrdUnit } from "../src/prd.js";

const mock = execFileSync as unknown as ReturnType<typeof vi.fn>;
const REASON = "GraphQL: Could not resolve to a Repository with the name 'owner/repo' (createIssue)";
const FIX = new URL("./fixtures/", import.meta.url).pathname;

function failingGh() {
  mock.mockImplementation((...callArgs: unknown[]) => {
    const args = (callArgs[1] as string[] | undefined) ?? [];
    if (args.includes("create")) {
      const e = new Error("gh: process exited with code 1") as Error & { stderr?: string };
      e.stderr = REASON;
      throw e;
    }
    return ""; // `auth status`, `issue list`
  });
}

beforeEach(() => mock.mockReset());

function unit(criteriaId: string, title: string): PrdUnit {
  return {
    criteriaId,
    title,
    label: `${criteriaId} — ${title}`,
    refs: ["1.1.1"],
    severity: "bloquant",
    findings: [{ ruleId: "r", criteriaId, file: "a.html", line: 1, col: 1, selectorHint: "img", severity: "bloquant", message: "m", remediation: "fix", snippet: "<img>" }],
  };
}

describe("gh failure surfacing (BUG-GH-EXIT)", () => {
  it("createIssue reports the gh stderr reason on failure instead of swallowing it", () => {
    failingGh();
    const r = createIssue("t", "b", ["accessibility"]);
    expect(r.ok).toBe(false);
    expect(r.reason).toContain("Could not resolve to a Repository");
  });

  it("pushIssues surfaces the failure reason(s) in the result", () => {
    failingGh();
    const r = pushIssues([unit("4.1.2", "Name")], "en");
    expect(r.failed).toBe(1);
    expect(r.created).toBe(0);
    expect(r.errors.join("\n")).toContain("Could not resolve to a Repository");
  });

  it("prd --gh-issues exits NON-ZERO and surfaces the reason when every issue creation fails", async () => {
    const dir = mkdtempSync(join(tmpdir(), "u11y-gh-exit-"));
    const audit = runAudit({ inputs: [`${FIX}non-conforming/bad.html`] });
    const auditPath = join(dir, "audit.json");
    writeFileSync(auditPath, JSON.stringify(audit));

    failingGh();
    const out: string[] = [];
    const err: string[] = [];
    const lo = vi.spyOn(console, "log").mockImplementation((...a: unknown[]) => void out.push(a.join(" ")));
    const le = vi.spyOn(console, "error").mockImplementation((...a: unknown[]) => void err.push(a.join(" ")));
    const code = await main(["prd", "--in", auditPath, "--out", dir, "--gh-issues"]);
    lo.mockRestore();
    le.mockRestore();

    expect(code).not.toBe(0); // today: returns 0 unconditionally (the bug)
    expect(err.join("\n")).toContain("Could not resolve to a Repository"); // today: stderr swallowed
    // The markdown is still written regardless of gh failures.
    expect(out.some((l) => l.includes("prd-"))).toBe(true);
  });
});
