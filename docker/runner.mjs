import { chromium } from "playwright";
import axe from "axe-core";
const target = process.argv[2];
const isFile = target.startsWith("/work/");
const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const page = await browser.newPage();
  await page.goto(isFile ? "file://" + target : target, { waitUntil: "load", timeout: 45000 });
  await page.addScriptTag({ content: axe.source });
  const axeRes = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ["violations"] }));
  await page.setViewportSize({ width: 320, height: 800 });
  const reflow = await page.evaluate(() => {
    const el = document.scrollingElement || document.documentElement;
    return { horizontalScroll: el.scrollWidth > el.clientWidth + 2 };
  });
  const violations = axeRes.violations.map((v) => ({
    id: v.id, impact: v.impact, help: v.help, tags: v.tags,
    nodes: v.nodes.slice(0, 10).map((n) => ({ target: n.target, html: (n.html || "").slice(0, 200) })),
  }));
  console.log(JSON.stringify({ url: target, violations, reflow }));
} finally {
  await browser.close();
}
