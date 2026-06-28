import { describe, it, expect } from "vitest";
import { parseSitemapUrls, extractLinks, crawlUrls } from "../src/crawl.js";

describe("parseSitemapUrls", () => {
  it("extracts every <loc> from a urlset, trimming whitespace", () => {
    const xml = `<?xml version="1.0"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://exemple.fr/</loc></url>
        <url><loc>
          https://exemple.fr/contact
        </loc></url>
      </urlset>`;
    expect(parseSitemapUrls(xml)).toEqual(["https://exemple.fr/", "https://exemple.fr/contact"]);
  });
  it("returns an empty list for a document with no <loc>", () => {
    expect(parseSitemapUrls("<urlset></urlset>")).toEqual([]);
  });
});

describe("extractLinks", () => {
  const base = "https://exemple.fr/blog/";
  it("resolves relative links to absolute, same-origin only", () => {
    const html = `<a href="article">A</a> <a href="/about">B</a> <a href="https://exemple.fr/c">C</a>`;
    expect(extractLinks(html, base)).toEqual(["https://exemple.fr/blog/article", "https://exemple.fr/about", "https://exemple.fr/c"]);
  });
  it("drops cross-origin, mailto/tel, pure fragments, and strips hashes; de-duplicates", () => {
    const html = `
      <a href="https://autre.fr/x">ext</a>
      <a href="mailto:a@b.fr">mail</a>
      <a href="#section">frag</a>
      <a href="/page#top">hash</a>
      <a href="/page">dup</a>`;
    expect(extractLinks(html, base)).toEqual(["https://exemple.fr/page"]);
  });
});

describe("crawlUrls", () => {
  const pages: Record<string, string> = {
    "https://exemple.fr/": `<a href="/a">a</a><a href="/b">b</a>`,
    "https://exemple.fr/a": `<a href="/c">c</a><a href="/">home</a>`,
    "https://exemple.fr/b": `<a href="/a">a</a>`,
    "https://exemple.fr/c": `<a href="/a">a</a>`,
  };
  const fetchHtml = async (url: string): Promise<string> => pages[url] ?? "";

  it("BFS-discovers same-origin pages up to the depth limit, start first, de-duplicated", async () => {
    const urls = await crawlUrls("https://exemple.fr/", { fetchHtml, depth: 1, max: 50 });
    expect(urls).toEqual(["https://exemple.fr/", "https://exemple.fr/a", "https://exemple.fr/b"]);
  });
  it("goes one level deeper at depth 2 (reaches /c via /a)", async () => {
    const urls = await crawlUrls("https://exemple.fr/", { fetchHtml, depth: 2, max: 50 });
    expect(urls).toEqual(["https://exemple.fr/", "https://exemple.fr/a", "https://exemple.fr/b", "https://exemple.fr/c"]);
  });
  it("honours the max-pages cap regardless of depth", async () => {
    const urls = await crawlUrls("https://exemple.fr/", { fetchHtml, depth: 5, max: 2 });
    expect(urls).toEqual(["https://exemple.fr/", "https://exemple.fr/a"]);
  });
});
