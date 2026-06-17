// A tiny, zero-dependency unified-diff renderer for `fix --dry-run` previews.
// LCS over lines with context collapsing; guarded against pathological inputs
// (minified bundles) so it never blows up memory on a giant single line.

interface Op {
  t: " " | "-" | "+";
  line: string;
}

export function unifiedDiff(file: string, before: string, after: string, ctx = 2): string {
  if (before === after) return "";
  const a = before.split("\n");
  const b = after.split("\n");
  const header = `--- a/${file}\n+++ b/${file}`;
  if (a.length > 4000 || b.length > 4000) return `${header}\n@@ diff omitted (large file): ${a.length} → ${b.length} lines @@`;

  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i]![j] = a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }

  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ t: " ", line: a[i]! });
      i++;
      j++;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      ops.push({ t: "-", line: a[i]! });
      i++;
    } else {
      ops.push({ t: "+", line: b[j]! });
      j++;
    }
  }
  while (i < n) ops.push({ t: "-", line: a[i++]! });
  while (j < m) ops.push({ t: "+", line: b[j++]! });

  const show = new Array<boolean>(ops.length).fill(false);
  for (let k = 0; k < ops.length; k++) {
    if (ops[k]!.t !== " ") for (let d = -ctx; d <= ctx; d++) if (k + d >= 0 && k + d < ops.length) show[k + d] = true;
  }

  const out = [header];
  let k = 0;
  while (k < ops.length) {
    if (!show[k]) {
      k++;
      continue;
    }
    let e = k;
    while (e < ops.length && show[e]) e++;
    out.push(`@@ ${k + 1},${e - k} @@`);
    for (let x = k; x < e; x++) out.push(`${ops[x]!.t}${ops[x]!.line}`);
    k = e;
  }
  return out.join("\n");
}
