import { readdirSync, readFileSync, existsSync } from "fs";
import { join, resolve, relative } from "path";
import type { FileInfo } from "./types.js";

const DATA_DIR = join(import.meta.dir, "..", "data");

function isPathSafe(requestedPath: string, baseDir: string): boolean {
  const resolvedPath = resolve(baseDir, requestedPath);
  const relativePath = relative(baseDir, resolvedPath);
  return !relativePath.startsWith("..") && !relativePath.startsWith("/");
}

export function validateDocumentPath(name: string): { valid: true; fullPath: string } | { valid: false; error: string } {
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

export function getAllMarkdownFiles(basePath: string = DATA_DIR): FileInfo[] {
  function scanDir(dir: string, basePath: string = ""): FileInfo[] {
    const items = readdirSync(dir, { withFileTypes: true });
    let files: FileInfo[] = [];
    
    for (const item of items) {
      const fullPath = join(dir, item.name);
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
      
      if (item.isDirectory()) {
        files = files.concat(scanDir(fullPath, relativePath));
      } else if (item.name.endsWith(".md")) {
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

export function readDocumentContent(fullPath: string): string {
  return readFileSync(fullPath, "utf-8");
}

export function getDataDir(): string {
  return DATA_DIR;
}