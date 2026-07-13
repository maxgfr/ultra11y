import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }));
import { execFileSync } from "node:child_process";
import {
  ghAvailable,
  existingIssueTitles,
  createIssue,
  issueTitle,
  issueBody,
  pushIssues,
  singleIssueTitle,
  singleIssueBody,
  pushSingleIssue,
} from "../src/gh.js";
import type { PrdUnit } from "../src/prd.js";
import type { Severity } from "../src/types.js";

const mock = execFileSync as unknown as ReturnType<typeof vi.fn>;
const argv = (call: unknown[]): string[] => (call[1] as string[]) ?? [];

beforeEach(() => mock.mockReset());

function unit(criteriaId: string, title: string, severity: Severity = "bloquant"): PrdUnit {
  return {
    criteriaId,
    title,
    label: `${criteriaId} — ${title}`,
    refs: ["1.1.1"],
    severity,
    findings: [
      {
        ruleId: "cross-icon-only-unnamed",
        criteriaId,
        file: "src/page.tsx",
        line: 5,
        col: 7,
        selectorHint: "IconButton",
        severity,
        message: "icône seule sans nom",
        remediation: "Passez aria-label",
        snippet: "<IconButton/>",
        related: { file: "src/IconButton.tsx", line: 2, col: 1, selectorHint: "IconButton", note: "définition" },
      },
    ],
  };
}

describe("gh helpers", () => {
  it("builds a stable, criterion-keyed issue title (WCAG core by default)", () => {
    expect(issueTitle(unit("4.1.2", "Name, Role, Value"))).toBe("[a11y] WCAG 4.1.2 — Name, Role, Value");
    expect(issueTitle(unit("8.3", "Langue de page"), "RGAA")).toBe("[a11y] RGAA 8.3 — Langue de page");
  });

  it("suffixes an advisory unit's title and issueBody renders it as a recommendation, not an NC", () => {
    const u = { ...unit("1.3.1", "Info and Relationships"), advisory: true };
    expect(issueTitle(u)).toBe("[a11y] WCAG 1.3.1 — Info and Relationships (recommendation)");
    const body = issueBody(u, "en", "wcag");
    expect(body).toContain("Recommendation (non-normative)");
    expect(body).not.toContain("**Success criterion** : 1.3.1");
  });

  it("pushIssues adds the `recommendation` label for an advisory unit", () => {
    const seen: string[][] = [];
    mock.mockImplementation((...callArgs: unknown[]) => {
      const args = (callArgs[1] as string[] | undefined) ?? [];
      if (args.includes("list")) return JSON.stringify([]);
      seen.push(args);
      return "";
    });
    const advisory = { ...unit("1.3.1", "Info and Relationships"), advisory: true };
    pushIssues([advisory], "en");
    const labelArg = seen[0]![seen[0]!.indexOf("--label") + 1]!;
    expect(labelArg).toContain("recommendation");
  });

  it("issueBody renders the auditor block by default (finding, expected, occurrences, related site)", () => {
    const body = issueBody(unit("4.1.2", "X"), "fr", "wcag");
    expect(body).toContain("Constat"); // finding label (fr), not the dev "Correction"
    expect(body).toContain("`src/page.tsx:5`");
    expect(body).toContain("Passez aria-label"); // the remediation surfaces as "Attendu"
    expect(body).toContain("`src/IconButton.tsx:2`");
  });

  it("issueBody --format remediation keeps the legacy dev body with WCAG refs", () => {
    const body = issueBody(unit("4.1.2", "X"), "fr", "wcag", "remediation");
    expect(body).toContain("**WCAG** : 1.1.1");
    expect(body).toContain("Passez aria-label");
    expect(body).toContain("`src/IconButton.tsx:2`");
  });

  it("issueBody inherits the full ticket template (Priorité + Partie technique + Complexité)", () => {
    const body = issueBody(unit("4.1.2", "Name, Role, Value"), "fr", "wcag");
    expect(body).toContain("**Priorité** : 🔴 Bloquant");
    expect(body).toContain("Partie technique");
    expect(body).toContain("**Critères d'acceptation**");
    expect(body).toContain("**Complexité** :");
  });

  it("issueBody renders the origin-attribution line for a capture-originated finding", () => {
    const u = unit("4.1.2", "X");
    u.findings[0]!.origin = { capture: "captures/icon-button.html", sourceFile: "src/IconButton.tsx", component: "IconButton" };
    const body = issueBody(u, "en", "wcag");
    expect(body).toContain("- _rendered capture of `IconButton` — source `src/IconButton.tsx`_");
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
    mock.mockReturnValueOnce(JSON.stringify([{ title: "[a11y] WCAG 4.1.2 — X" }, { title: "other" }]));
    expect(existingIssueTitles().has("[a11y] WCAG 4.1.2 — X")).toBe(true);
    mock.mockImplementationOnce(() => {
      throw new Error("no repo");
    });
    expect(existingIssueTitles().size).toBe(0);
  });

  it("createIssue passes labels, and retries without them if the labelled call fails", () => {
    mock.mockReturnValueOnce(""); // labelled call succeeds
    expect(createIssue("t", "b", ["accessibility", "wcag", "bloquant"]).ok).toBe(true);
    expect(argv(mock.mock.calls[0]!)).toContain("--label");

    mock.mockReset();
    mock.mockImplementationOnce(() => {
      throw new Error("label not found");
    });
    mock.mockReturnValueOnce(""); // retry without labels succeeds
    expect(createIssue("t", "b", ["accessibility"]).ok).toBe(true);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(argv(mock.mock.calls[1]!)).not.toContain("--label");
  });

  it("pushIssues skips titles that already exist and creates the rest (WCAG labels)", () => {
    mock.mockImplementation((...callArgs: unknown[]) => {
      const args = (callArgs[1] as string[] | undefined) ?? [];
      if (args.includes("list")) return JSON.stringify([{ title: "[a11y] WCAG 4.1.2 — Already" }]);
      return ""; // create
    });
    const r = pushIssues([unit("4.1.2", "Already"), unit("1.1.1", "New")], "en");
    expect(r.skipped).toBe(1);
    expect(r.created).toBe(1);
    expect(r.createdTitles).toEqual(["[a11y] WCAG 1.1.1 — New"]);
  });

  it("pushIssues labels by the active pack when --standard is a pack", () => {
    const seen: string[][] = [];
    mock.mockImplementation((...callArgs: unknown[]) => {
      const args = (callArgs[1] as string[] | undefined) ?? [];
      if (args.includes("list")) return JSON.stringify([]);
      seen.push(args);
      return "";
    });
    const r = pushIssues([unit("8.3", "Langue")], "fr", "rgaa");
    expect(r.createdTitles).toEqual(["[a11y] RGAA 8.3 — Langue"]);
    const labelArg = seen.find((a) => a.includes("--label"));
    expect(labelArg?.join(",")).toContain("rgaa");
  });
});

describe("gh single consolidated issue", () => {
  it("singleIssueTitle is stable and standard-keyed (no counts or date, so re-runs de-dupe)", () => {
    expect(singleIssueTitle("WCAG")).toBe("[a11y] WCAG — Accessibility audit");
    expect(singleIssueTitle("RGAA")).toBe("[a11y] RGAA — Accessibility audit");
  });

  it("singleIssueBody sections by severity and includes every criterion with its occurrences and fix", () => {
    const body = singleIssueBody([unit("4.1.2", "Name", "bloquant"), unit("1.4.3", "Contrast", "majeur"), unit("2.4.4", "Link", "mineur")], "en");
    expect(body).toContain("Blocking (1)");
    expect(body).toContain("Major (1)");
    expect(body).toContain("Minor (1)");
    expect(body).toContain("4.1.2 — Name");
    expect(body).toContain("1.4.3 — Contrast");
    expect(body).toContain("2.4.4 — Link");
    expect(body).toContain("`src/page.tsx:5`");
    expect(body).toContain("Passez aria-label");
  });

  it("singleIssueBody localizes the severity headings in French", () => {
    const body = singleIssueBody([unit("4.1.2", "Name", "bloquant")], "fr");
    expect(body).toContain("Bloquant (1)");
  });

  it("pushSingleIssue creates exactly one consolidated issue labelled by the most-severe criterion", () => {
    const seen: string[][] = [];
    mock.mockImplementation((...callArgs: unknown[]) => {
      const args = (callArgs[1] as string[] | undefined) ?? [];
      if (args.includes("list")) return JSON.stringify([]);
      seen.push(args);
      return "";
    });
    const r = pushSingleIssue([unit("1.4.3", "Contrast", "majeur"), unit("4.1.2", "Name", "bloquant")], "en");
    expect(r.created).toBe(1);
    expect(r.createdTitles).toEqual(["[a11y] WCAG — Accessibility audit"]);
    expect(seen.filter((a) => a.includes("create")).length).toBe(1);
    const labelArg = seen.find((a) => a.includes("--label"));
    expect(labelArg?.join(",")).toContain("bloquant");
  });

  it("pushSingleIssue skips when the consolidated issue already exists", () => {
    mock.mockImplementation((...callArgs: unknown[]) => {
      const args = (callArgs[1] as string[] | undefined) ?? [];
      if (args.includes("list")) return JSON.stringify([{ title: "[a11y] WCAG — Accessibility audit" }]);
      return "";
    });
    const r = pushSingleIssue([unit("4.1.2", "Name")], "en");
    expect(r.skipped).toBe(1);
    expect(r.created).toBe(0);
  });

  it("pushSingleIssue keys the title and label by the active pack under --standard", () => {
    const seen: string[][] = [];
    mock.mockImplementation((...callArgs: unknown[]) => {
      const args = (callArgs[1] as string[] | undefined) ?? [];
      if (args.includes("list")) return JSON.stringify([]);
      seen.push(args);
      return "";
    });
    const r = pushSingleIssue([unit("8.3", "Langue")], "fr", "rgaa");
    expect(r.createdTitles).toEqual(["[a11y] RGAA — Accessibility audit"]);
    const labelArg = seen.find((a) => a.includes("--label"));
    expect(labelArg?.join(",")).toContain("rgaa");
  });
});
