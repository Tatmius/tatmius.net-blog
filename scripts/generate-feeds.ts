/**
 * Generates static Atom 1.0 feed files for static export (output: "export").
 * Run after next build: npm run build
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import articlesData from "../src/data/articles.json";
import { buildAtomFeed } from "../src/lib/atom";
import type { AtomEntry, AtomFeedMeta } from "../src/lib/atom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "out");

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.tatmius.net";

interface ArticleRecord {
  slug: string;
  date: string;
  ja?: { title: string; excerpt: string };
  en?: { title: string; excerpt: string };
}

const data = articlesData as Record<string, ArticleRecord>;

function toRfc3339(dateStr: string): string {
  return `${dateStr}T00:00:00Z`;
}

function buildAllFeed(): string {
  const entries: AtomEntry[] = [];
  let latestUpdated = "1970-01-01";
  const sorted = Object.entries(data).sort(([, a], [, b]) => (b.date < a.date ? -1 : 1));

  for (const [slug, article] of sorted) {
    const locales = (["ja", "en"] as const).filter((loc) => article[loc]);
    if (locales.length === 0) continue;
    const preferredLocale = article.ja ? "ja" : "en";
    const meta = article[preferredLocale]!;
    const entryId = `${BASE_URL}/${preferredLocale}/articles/${slug}`;
    const articleUrl = `${BASE_URL}/${preferredLocale}/articles/${slug}`;
    const linkText = preferredLocale === "ja" ? "記事を読む" : "Read more";
    const updated = toRfc3339(article.date);
    if (article.date > latestUpdated) latestUpdated = article.date;
    entries.push({
      id: entryId,
      title: meta.title,
      updated,
      published: updated,
      summary: `${meta.excerpt} <a href="${articleUrl}">${linkText}</a>`,
      summaryType: "html",
      links: locales.map((loc) => ({
        href: `${BASE_URL}/${loc}/articles/${slug}`,
        hreflang: loc,
      })),
    });
  }

  const feedUpdated =
    entries.length > 0 ? toRfc3339(latestUpdated) : new Date().toISOString();
  const selfUrl = `${BASE_URL}/feed.xml`;
  const feedMeta: AtomFeedMeta = {
    title: "tatmius.net Blog",
    id: selfUrl,
    selfUrl,
    updated: feedUpdated,
    author: { name: "tatmius", uri: BASE_URL },
  };
  return buildAtomFeed(feedMeta, entries);
}

function buildLocaleFeed(locale: "ja" | "en"): string {
  const entries: AtomEntry[] = [];
  let latestUpdated = "1970-01-01";
  const sorted = Object.entries(data)
    .filter(([, article]) => article[locale])
    .sort(([, a], [, b]) => (b.date < a.date ? -1 : 1));

  for (const [slug, article] of sorted) {
    const meta = article[locale]!;
    const articleUrl = `${BASE_URL}/${locale}/articles/${slug}`;
    const linkText = locale === "ja" ? "記事を読む" : "Read more";
    const entryId = articleUrl;
    const updated = toRfc3339(article.date);
    if (article.date > latestUpdated) latestUpdated = article.date;
    entries.push({
      id: entryId,
      title: meta.title,
      updated,
      published: updated,
      summary: `${meta.excerpt} <a href="${articleUrl}">${linkText}</a>`,
      summaryType: "html",
      links: [{ href: articleUrl, hreflang: locale }],
    });
  }

  const feedUpdated =
    entries.length > 0 ? toRfc3339(latestUpdated) : new Date().toISOString();
  const selfUrl = `${BASE_URL}/${locale}/feed.xml`;
  const feedMeta: AtomFeedMeta = {
    title: locale === "ja" ? "tatmius.net ブログ" : "tatmius.net Blog",
    id: selfUrl,
    selfUrl,
    updated: feedUpdated,
    author: { name: "tatmius", uri: BASE_URL },
  };
  return buildAtomFeed(feedMeta, entries);
}

function main() {
  if (!fs.existsSync(outDir)) {
    console.error("out/ not found. Run 'npm run build' first (next build).");
    process.exit(1);
  }

  fs.writeFileSync(path.join(outDir, "feed.xml"), buildAllFeed(), "utf-8");
  console.log("Wrote out/feed.xml");

  for (const locale of ["ja", "en"] as const) {
    const dir = path.join(outDir, locale);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "feed.xml"), buildLocaleFeed(locale), "utf-8");
    console.log(`Wrote out/${locale}/feed.xml`);
  }

  // Cloudflare Pages: set Content-Type so browser/readers recognize Atom feeds
  const headersContent = [
    "/feed.xml",
    "  Content-Type: application/atom+xml; charset=utf-8",
    "",
    "/ja/feed.xml",
    "  Content-Type: application/atom+xml; charset=utf-8",
    "",
    "/en/feed.xml",
    "  Content-Type: application/atom+xml; charset=utf-8",
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "_headers"), headersContent, "utf-8");
  console.log("Wrote out/_headers");
}

main();
