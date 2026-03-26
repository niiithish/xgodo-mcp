import { readdirSync, readFileSync, existsSync } from "fs";
import { join, resolve, relative } from "path";
const DATA_DIR = join(import.meta.dir, "..", "data");
function isPathSafe(requestedPath, baseDir) {
    const resolvedPath = resolve(baseDir, requestedPath);
    const relativePath = relative(baseDir, resolvedPath);
    return !relativePath.startsWith("..") && !relativePath.startsWith("/");
}
export function validateDocumentPath(name) {
    const sanitizedName = name.replace(/\.md$/, "");
    const fullPath = join(DATA_DIR, `${sanitizedName}.md`);
    if (!isPathSafe(fullPath, DATA_DIR)) {
        return { valid: false, error: `Invalid document path: "${name}". Path traversal detected.` };
    }
    if (!existsSync(fullPath)) {
        return { valid: false, error: `Document "${name}" not found. Use xgodo_list_documents to see available documents.` };
    }
    return { valid: true, fullPath };
}
export function getAllMarkdownFiles(basePath = DATA_DIR) {
    function scanDir(dir, basePath = "") {
        const items = readdirSync(dir, { withFileTypes: true });
        let files = [];
        for (const item of items) {
            const fullPath = join(dir, item.name);
            const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
            if (item.isDirectory()) {
                files = files.concat(scanDir(fullPath, relativePath));
            }
            else if (item.name.endsWith(".md")) {
                files.push({
                    path: relativePath.replace(".md", ""),
                    fullPath,
                });
            }
        }
        return files;
    }
    return scanDir(basePath);
}
export function readDocumentContent(fullPath) {
    return readFileSync(fullPath, "utf-8");
}
export function getDataDir() {
    return DATA_DIR;
}
