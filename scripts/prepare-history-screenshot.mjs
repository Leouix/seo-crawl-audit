import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createBaseline } from "../packages/core/dist/baseline.js";
import { writeHistorySnapshot, writeSnapshot } from "../packages/core/dist/node.js";

// Synthetic, reproducible local UI fixture. No page or search-engine requests.
const siteUrl = "https://demo.example/";
const directory = await mkdtemp(join(tmpdir(), "seo-audit-history-demo-"));
const historyDirectory = join(directory, ".seo-audit/history");
const paths = ["/", ...Array.from({ length: 24 }, (_, index) => `/guides/${index + 1}/`)];
const urls = paths.map((path) => new URL(path, siteUrl).href);
const errorsByRun = [4, 3, 3, 2, 1, 3, 2, 1];
const warningsByRun = [12, 10, 8, 7, 5, 9, 4, 3];

for (let run = 0; run < errorsByRun.length; run += 1) {
  const generatedAt = new Date(Date.UTC(2026, 6, 7 + run * 7, 12)).toISOString();
  const pages = urls.map((url, index) => {
    const title = index === 0 ? "Demo site" : `Guide ${index}`;
    return {
      url,
      finalUrl: url,
      status: index > 0 && index <= errorsByRun[run] ? 404 : 200,
      contentType: "text/html",
      title,
      description: index > 0 && index <= warningsByRun[run]
        ? null
        : `A useful description for ${title} in a synthetic SEO audit example.`,
      canonical: url,
      h1Count: 1,
      lang: "en",
      wordCount: 300,
      contentHash: `demo-content-${index}`,
      openGraph: { title, description: "Synthetic demo page", image: `${siteUrl}cover.png` },
      twitter: { card: "summary", title, description: "Synthetic demo page", image: `${siteUrl}cover.png` },
      internalLinks: index === 0 ? urls.slice(1) : [siteUrl],
      depth: index === 0 ? 0 : 1,
    };
  });
  const snapshot = createBaseline({
    startUrl: siteUrl,
    generatedAt,
    pages,
    options: { maxPages: 100, requestDelay: 100 },
    robots: { url: `${siteUrl}robots.txt`, status: 200, sha256: "synthetic-demo" },
    sitemap: { url: `${siteUrl}sitemap.xml`, urls, sitemapCount: 1, truncated: false },
  });
  await writeHistorySnapshot(historyDirectory, snapshot);
  if (run === errorsByRun.length - 1) await writeSnapshot(join(directory, ".seo-audit.json"), snapshot);
}

await writeFile(join(directory, "DEMO-DATA.txt"),
  "All snapshots in this directory are synthetic screenshot fixtures. No website was crawled.\n", "utf8");
console.log(directory);
