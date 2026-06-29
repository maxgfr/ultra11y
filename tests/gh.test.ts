import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }));
import { execFileSync } from "node:child_process";
import { ghAvailable, existingIssueTitles, createIssue, issueTitle, issueBody, pushIssues } from "../src/gh.js";
import type { PrdUnit } from "../src/prd.js";

const mock = execFileSync as unknown as ReturnType<typeof vi.fn>;
const argv = (call: unknown[]): string[] => (call[1] as string[]) ?? [];

beforeEach(() => mock.mockReset());

function unit(criteriaId: string, title: string): PrdUnit {
  return {
    criteriaId,
    title,
    label: `${criteriaId} — ${title}`,
    wcag: ["1.1.1 Non-text Content (A)"],
    severity: "bloquant",
    findings: [
      {
        ruleId: "cross-icon-only-unnamed",
        criteriaId,
        file: "src/page.tsx",
        line: 5,
        col: 7,
        selectorHint: "IconButton",
        severity: "bloquant",
        message: "icône seule sans nom",
        remediation: "Passez aria-label",
        snippet: "<IconButton/>",
        related: { file: "src/IconButton.tsx", line: 2, col: 1, selectorHint: "IconButton", note: "définition" },
      },
    ],
  };
}

describe("gh helpers", () => {
  it("builds a stable, criterion-keyed issue title", () => {
    expect(issueTitle(unit("7.1", "Intitulé pertinent"))).toBe("[a11y] RGAA 7.1 — Intitulé pertinent");
  });

  it("issueBody includes occurrences, remediation, and the related definition site", () => {
    const body = issueBody(unit("7.1", "X"), "fr");
    expect(body).toContain("`src/page.tsx:5`");
    expect(body).toContain("Passez aria-label");
    expect(body).toContain("`src/IconButton.tsx:2`");
  });

  it("ghAvailable reflects whether `gh auth status` succeeds", () => {
    mock.mockReturnValueOnce("");
    expect(ghAvailable()).toBe(true);
    mock.mockImplementationOnce(() => {
      throw new Error("not authenticated");
    });
    expect(ghAvailable()).toBe(false);
  });

  it("existingIssueTitles parses gh JSON and is empty on failure", () => {
    mock.mockReturnValueOnce(JSON.stringify([{ title: "[a11y] RGAA 7.1 — X" }, { title: "other" }]));
    expect(existingIssueTitles().has("[a11y] RGAA 7.1 — X")).toBe(true);
    mock.mockImplementationOnce(() => {
      throw new Error("no repo");
    });
    expect(existingIssueTitles().size).toBe(0);
  });

  it("createIssue passes labels, and retries without them if the labelled call fails", () => {
    mock.mockReturnValueOnce(""); // labelled call succeeds
    expect(createIssue("t", "b", ["accessibility", "rgaa", "bloquant"])).toBe(true);
    expect(argv(mock.mock.calls[0]!)).toContain("--label");

    mock.mockReset();
    mock.mockImplementationOnce(() => {
      throw new Error("label not found");
    });
    mock.mockReturnValueOnce(""); // retry without labels succeeds
    expect(createIssue("t", "b", ["accessibility"])).toBe(true);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(argv(mock.mock.calls[1]!)).not.toContain("--label");
  });

  it("pushIssues skips titles that already exist and creates the rest", () => {
    mock.mockImplementation((...callArgs: unknown[]) => {
      const args = (callArgs[1] as string[] | undefined) ?? [];
      if (args.includes("list")) return JSON.stringify([{ title: "[a11y] RGAA 7.1 — Already" }]);
      return ""; // create
    });
    const r = pushIssues([unit("7.1", "Already"), unit("1.1", "New")], "fr");
    expect(r.skipped).toBe(1);
    expect(r.created).toBe(1);
    expect(r.createdTitles).toEqual(["[a11y] RGAA 1.1 — New"]);
  });
});
