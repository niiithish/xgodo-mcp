import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  validateDocumentPath,
  getAllMarkdownFiles,
  readDocumentContent,
  getDataDir,
} from "./utils.js";
import { ResponseFormat, type DocumentListOutput, type DocumentContentOutput, type SearchDocumentsOutput, type AgentActionsOutput, type AgentUtilsOutput } from "./types.js";

const ACTION_DESCRIPTIONS: Record<string, string> = {
  "automation-reference-agent-actions-apps": "App management (launchApp, launchIntent, listApps, browse)",
  "automation-reference-agent-actions-files": "File operations (saveFile)",
  "automation-reference-agent-actions-navigation": "Navigation (goHome, goBack, recents, dpad)",
  "automation-reference-agent-actions-network": "Network operations (airplane mode toggle)",
  "automation-reference-agent-actions-screen": "Screen operations (screenContent, screenshot, nodeAction)",
  "automation-reference-agent-actions-text": "Text input (writeText, copyText, paste, hideKeyboard, inputKey)",
  "automation-reference-agent-actions-touch": "Touch gestures (tap, swipe, hold, doubleTap, multiTap)",
};

const UTIL_DESCRIPTIONS: Record<string, string> = {
  "automation-reference-agent-utils": "AgentUtils overview - utility functions, job management, file operations",
  "automation-reference-agent-utils-callbacks": "Event callbacks (setNetworkCallback, toastCallback)",
  "automation-reference-agent-utils-control": "Automation control (stopCurrentAutomation)",
  "automation-reference-agent-utils-display": "Display HTML overlays (displayHTMLCode, hideHTMLCode)",
  "automation-reference-agent-utils-files": "File operations (exists, readFullFile, list, getHashes, uploadTempFile)",
  "automation-reference-agent-utils-helpers": "Helper utilities (randomClick, randomSwipe, isServerReachable, waitForNode)",
  "automation-reference-agent-utils-info": "Device & automation info (getAutomationInfo, getDeviceInfo)",
  "automation-reference-agent-utils-job": "Job task management (submitTask, useAnotherTask, getCurrentTask)",
  "automation-reference-agent-utils-out-of-steps": "Step tracking & debugging (storeScreen, submit)",
};

const server = new McpServer({
  name: "xgodo-mcp-server",
  version: "1.0.0",
});

const BaseOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});

server.registerTool(
  "xgodo_list_documents",
  {
    title: "List Documents",
    description: `List all available stored documents in the Xgodo documentation.

Returns a list of document names that can be used with xgodo_read_document.
Documents are organized by category (e.g., agent-actions/touch, agent-utils/helpers).

Returns:
  JSON format: { "total": number, "documents": string[] }`,
    inputSchema: {
      response_format: z.nativeEnum(ResponseFormat)
        .default(ResponseFormat.MARKDOWN)
        .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable"),
    },
    outputSchema: BaseOutputSchema.extend({
      total: z.number().optional(),
      documents: z.array(z.string()).optional(),
    }),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ response_format = ResponseFormat.MARKDOWN }) => {
    try {
      const files = getAllMarkdownFiles();
      const documents = files.map((f) => f.path).sort();

      if (documents.length === 0) {
        const output: DocumentListOutput = { total: 0, documents: [] };
        return {
          content: [
            {
              type: "text",
              text: response_format === ResponseFormat.JSON
                ? JSON.stringify(output, null, 2)
                : "No documents stored yet. Add URLs to src/scripts/scrape.ts and run `bun run scrape`",
            },
          ],
          structuredContent: { success: true, ...output },
        };
      }

      const output: DocumentListOutput = { total: documents.length, documents };

      if (response_format === ResponseFormat.JSON) {
        return {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          structuredContent: { success: true, ...output },
        };
      }

      const text = `Available documents (${documents.length}):\n${documents.map((d) => `- ${d}`).join("\n")}`;
      return {
        content: [{ type: "text", text }],
        structuredContent: { success: true, ...output },
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error listing documents: ${errorMsg}` }],
        isError: true,
        structuredContent: { success: false, error: errorMsg },
      };
    }
  }
);

server.registerTool(
  "xgodo_read_document",
  {
    title: "Read Document",
    description: `Read the full content of a specific stored document.

Args:
  name: Document name without .md extension. Use path for subdirectories (e.g., 'agent-actions/touch')
  response_format: Output format ('markdown' or 'json')

Returns:
  JSON format: { "name": string, "content": string, "size": number }

Use xgodo_list_documents to see available document names.`,
    inputSchema: {
      name: z
        .string()
        .min(1)
        .describe("Document name without .md extension (e.g., 'agent-actions/touch')"),
      response_format: z
        .nativeEnum(ResponseFormat)
        .default(ResponseFormat.MARKDOWN)
        .describe("Output format"),
    },
    outputSchema: BaseOutputSchema.extend({
      name: z.string().optional(),
      content: z.string().optional(),
      size: z.number().optional(),
    }),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ name, response_format = ResponseFormat.MARKDOWN }) => {
    const validation = validateDocumentPath(name);

    if (!validation.valid) {
      return {
        content: [{ type: "text", text: `Error: ${validation.error}` }],
        isError: true,
        structuredContent: { success: false, error: validation.error },
      };
    }

    try {
      const content = readDocumentContent(validation.fullPath);
      const sanitizedName = name.replace(/\.md$/, "");
      const output: DocumentContentOutput = {
        name: sanitizedName,
        content,
        size: content.length,
      };

      if (response_format === ResponseFormat.JSON) {
        return {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          structuredContent: { success: true, ...output },
        };
      }

      return {
        content: [{ type: "text", text: content }],
        structuredContent: { success: true, ...output },
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error reading document "${name}": ${errorMsg}` }],
        isError: true,
        structuredContent: { success: false, error: errorMsg },
      };
    }
  }
);

server.registerTool(
  "xgodo_search_documents",
  {
    title: "Search Documents",
    description: `Search for text within all stored documents.

Args:
  query: Text to search for (case-insensitive)
  response_format: Output format ('markdown' or 'json')

Returns:
  JSON format: { "query": string, "totalMatches": number, "results": [{ "filePath": string, "matchingLines": string[] }] }

Finds all documents containing the query and returns matching lines.`,
    inputSchema: {
      query: z.string().min(1).describe("Text to search for (case-insensitive)"),
      response_format: z
        .nativeEnum(ResponseFormat)
        .default(ResponseFormat.MARKDOWN)
        .describe("Output format"),
    },
    outputSchema: BaseOutputSchema.extend({
      query: z.string().optional(),
      totalMatches: z.number().optional(),
      results: z
        .array(
          z.object({
            filePath: z.string(),
            matchingLines: z.array(z.string()),
          })
        )
        .optional(),
    }),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ query, response_format = ResponseFormat.MARKDOWN }) => {
    try {
      const files = getAllMarkdownFiles();
      const results: SearchDocumentsOutput["results"] = [];
      const queryLower = query.toLowerCase();

      for (const file of files) {
        const content = readDocumentContent(file.fullPath);
        const lines = content.split("\n");
        const matchingLines = lines.filter((line) => line.toLowerCase().includes(queryLower));

        if (matchingLines.length > 0) {
          results.push({ filePath: file.path, matchingLines });
        }
      }

      if (results.length === 0) {
        const output: SearchDocumentsOutput = { query, totalMatches: 0, results: [] };
        const text = `No matches found for "${query}"`;
        return {
          content: [{ type: "text", text: response_format === ResponseFormat.JSON ? JSON.stringify(output, null, 2) : text }],
          structuredContent: { success: true, ...output },
        };
      }

      const totalMatches = results.reduce((sum, r) => sum + r.matchingLines.length, 0);
      const output: SearchDocumentsOutput = { query, totalMatches, results };

      if (response_format === ResponseFormat.JSON) {
        return {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          structuredContent: { success: true, ...output },
        };
      }

      const textParts = [`Found ${totalMatches} matches for "${query}" in ${results.length} documents:`];
      for (const result of results) {
        textParts.push(`\n## ${result.filePath}`);
        textParts.push(result.matchingLines.join("\n"));
      }

      return {
        content: [{ type: "text", text: textParts.join("\n") }],
        structuredContent: { success: true, ...output },
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error searching documents: ${errorMsg}` }],
        isError: true,
        structuredContent: { success: false, error: errorMsg },
      };
    }
  }
);

server.registerTool(
  "xgodo_list_agent_actions",
  {
    title: "List Agent Actions",
    description: `List all available agent.actions method categories with descriptions.

Returns a list of action categories available in the Xgodo Automation API.
Use xgodo_read_document with name 'agent-actions/<category>' for full documentation.

Returns:
  JSON format: { "categories": [{ "name": string, "description": string }] }`,
    inputSchema: {
      response_format: z
        .nativeEnum(ResponseFormat)
        .default(ResponseFormat.MARKDOWN)
        .describe("Output format"),
    },
    outputSchema: BaseOutputSchema.extend({
      categories: z.array(z.object({ name: z.string(), description: z.string() })).optional(),
    }),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ response_format = ResponseFormat.MARKDOWN }) => {
    try {
      const actionsDir = join(getDataDir(), "agent-actions");
      const files = getAllMarkdownFiles(actionsDir);

      const categories = files
        .map((f) => ({
          name: f.path.replace("agent-actions/", ""),
          description: ACTION_DESCRIPTIONS[f.path] || "Agent actions",
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      if (categories.length === 0) {
        const output: AgentActionsOutput = { categories: [] };
        return {
          content: [{ type: "text", text: "No agent actions documentation found." }],
          structuredContent: { success: true, ...output },
        };
      }

      const output: AgentActionsOutput = { categories };

      if (response_format === ResponseFormat.JSON) {
        return {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          structuredContent: { success: true, ...output },
        };
      }

      const lines = [
        `Available agent.actions categories (${categories.length}):`,
        "",
        ...categories.map((c) => `- ${c.name}: ${c.description}`),
        "",
        "Use xgodo_read_document with name 'agent-actions/<category>' to see full documentation.",
      ];

      return {
        content: [{ type: "text", text: lines.join("\n") }],
        structuredContent: { success: true, ...output },
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error listing agent actions: ${errorMsg}` }],
        isError: true,
        structuredContent: { success: false, error: errorMsg },
      };
    }
  }
);

server.registerTool(
  "xgodo_list_agent_utils",
  {
    title: "List Agent Utils",
    description: `List all available agent.utils method categories with descriptions.

Returns a list of utility categories available in the Xgodo Automation API.
Use xgodo_read_document with name 'agent-utils/<category>' for full documentation.

Returns:
  JSON format: { "categories": [{ "name": string, "description": string }] }`,
    inputSchema: {
      response_format: z
        .nativeEnum(ResponseFormat)
        .default(ResponseFormat.MARKDOWN)
        .describe("Output format"),
    },
    outputSchema: BaseOutputSchema.extend({
      categories: z.array(z.object({ name: z.string(), description: z.string() })).optional(),
    }),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ response_format = ResponseFormat.MARKDOWN }) => {
    try {
      const utilsDir = join(getDataDir(), "agent-utils");
      const files = getAllMarkdownFiles(utilsDir);

      const categories = files
        .map((f) => ({
          name: f.path.replace("agent-utils/", ""),
          description: UTIL_DESCRIPTIONS[f.path] || "Agent utils",
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      if (categories.length === 0) {
        const output: AgentUtilsOutput = { categories: [] };
        return {
          content: [{ type: "text", text: "No agent utils documentation found." }],
          structuredContent: { success: true, ...output },
        };
      }

      const output: AgentUtilsOutput = { categories };

      if (response_format === ResponseFormat.JSON) {
        return {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          structuredContent: { success: true, ...output },
        };
      }

      const lines = [
        `Available agent.utils categories (${categories.length}):`,
        "",
        ...categories.map((c) => `- ${c.name}: ${c.description}`),
        "",
        "Use xgodo_read_document with name 'agent-utils/<category>' to see full documentation.",
      ];

      return {
        content: [{ type: "text", text: lines.join("\n") }],
        structuredContent: { success: true, ...output },
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error listing agent utils: ${errorMsg}` }],
        isError: true,
        structuredContent: { success: false, error: errorMsg },
      };
    }
  }
);

server.registerTool(
  "xgodo_get_types",
  {
    title: "Get TypeScript Types",
    description: `Get all TypeScript type definitions for the Xgodo Automation API.

Returns the complete TypeScript type definitions that can be used for type-safe development.

Returns:
  JSON format: { "content": string, "size": number }`,
    inputSchema: {
      response_format: z
        .nativeEnum(ResponseFormat)
        .default(ResponseFormat.MARKDOWN)
        .describe("Output format"),
    },
    outputSchema: BaseOutputSchema.extend({
      content: z.string().optional(),
      size: z.number().optional(),
    }),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ response_format = ResponseFormat.MARKDOWN }) => {
    try {
      const content = readDocumentContent(join(getDataDir(), "agent-types.md"));

      if (response_format === ResponseFormat.JSON) {
        const output = { content, size: content.length };
        return {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          structuredContent: { success: true, ...output },
        };
      }

      return {
        content: [{ type: "text", text: content }],
        structuredContent: { success: true, content, size: content.length },
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error reading types: ${errorMsg}` }],
        isError: true,
        structuredContent: { success: false, error: errorMsg },
      };
    }
  }
);

import { join } from "path";

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Xgodo MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});