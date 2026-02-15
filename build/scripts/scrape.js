import { webfetch } from "../tools/webfetch.js";
import { writeFileSync } from "fs";
import { join } from "path";
async function scrapeAndSave(url, name) {
    console.log(`Scraping: ${url}`);
    try {
        const content = await webfetch(url, "text");
        const dataDir = join(__dirname, "..", "..", "data");
        const filePath = join(dataDir, `${name}.md`);
        const markdown = `# ${name}\n\n**Source:** ${url}\n\n**Scraped:** ${new Date().toISOString()}\n\n---\n\n${content}`;
        writeFileSync(filePath, markdown);
        console.log(`✓ Saved to: ${filePath}`);
    }
    catch (error) {
        console.error(`✗ Failed to scrape ${url}:`, error);
    }
}
async function main() {
    // Add your URLs here
    const urlsToScrape = [
    // { url: "https://example.com", name: "example-docs" },
    // { url: "https://docs.example.com/api", name: "api-reference" },
    ];
    console.log("Starting to scrape URLs...\n");
    for (const { url, name } of urlsToScrape) {
        await scrapeAndSave(url, name);
    }
    console.log("\nDone!");
}
main().catch(console.error);
