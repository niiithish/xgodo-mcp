import { writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface UrlToScrape {
  url: string;
  name: string;
}

async function webfetch(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; XgodoMCP/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    return JSON.stringify(data, null, 2);
  }

  const text = await response.text();
  return text
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function scrapeAndSave(url: string, name: string) {
  console.log(`Scraping: ${url}`);

  try {
    const content = await webfetch(url);
    const dataDir = join(__dirname, "..", "..", "data");
    const filePath = join(dataDir, `${name}.md`);

    const markdown = `# ${name}\n\n**Source:** ${url}\n\n**Scraped:** ${new Date().toISOString()}\n\n---\n\n${content}`;

    writeFileSync(filePath, markdown);
    console.log(`✓ Saved to: ${filePath}`);
  } catch (error) {
    console.error(`✗ Failed to scrape ${url}:`, error);
  }
}

async function main() {
  const urlsToScrape: UrlToScrape[] = [];

  console.log("Starting to scrape URLs...\n");

  for (const { url, name } of urlsToScrape) {
    await scrapeAndSave(url, name);
  }

  console.log("\nDone!");
}

main().catch(console.error);