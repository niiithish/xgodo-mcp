import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new McpServer({
  name: "xgodo-mcp-server",
  version: "1.0.0",
});

// Tool to list all stored documents
server.tool(
  "list_documents",
  "List all available stored documents",
  {},
  async () => {
    try {
      const dataDir = join(__dirname, "..", "data");
      
      function getAllFiles(dir: string, basePath: string = ""): string[] {
        const items = readdirSync(dir, { withFileTypes: true });
        let files: string[] = [];
        
        for (const item of items) {
          const fullPath = join(dir, item.name);
          const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
          
          if (item.isDirectory()) {
            files = files.concat(getAllFiles(fullPath, relativePath));
          } else if (item.name.endsWith(".md")) {
            files.push(relativePath.replace(".md", ""));
          }
        }
        
        return files;
      }
      
      const files = getAllFiles(dataDir);
      
      if (files.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No documents stored yet. Add URLs to src/scripts/scrape.ts and run `bun run scrape`",
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: `Available documents:\n${files.map(f => `- ${f}`).join("\n")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error listing documents: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool to read a specific stored document
server.tool(
  "read_document",
  "Read content from a stored document",
  {
    name: z.string().describe("Name of the document (without .md extension, use path for subdirectories like 'agent-actions/touch')"),
  },
  async ({ name }) => {
    try {
      const dataDir = join(__dirname, "..", "data");
      const filePath = join(dataDir, `${name}.md`);
      const content = readFileSync(filePath, "utf-8");
      
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading document "${name}": ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool to search within stored documents
server.tool(
  "search_documents",
  "Search for text within all stored documents",
  {
    query: z.string().describe("Text to search for"),
  },
  async ({ query }) => {
    try {
      const dataDir = join(__dirname, "..", "data");
      
      function getAllFiles(dir: string, basePath: string = ""): { path: string; fullPath: string }[] {
        const items = readdirSync(dir, { withFileTypes: true });
        let files: { path: string; fullPath: string }[] = [];
        
        for (const item of items) {
          const fullPath = join(dir, item.name);
          const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
          
          if (item.isDirectory()) {
            files = files.concat(getAllFiles(fullPath, relativePath));
          } else if (item.name.endsWith(".md")) {
            files.push({ path: relativePath.replace(".md", ""), fullPath });
          }
        }
        
        return files;
      }
      
      const files = getAllFiles(dataDir);
      const results: string[] = [];
      
      for (const file of files) {
        const content = readFileSync(file.fullPath, "utf-8");
        if (content.toLowerCase().includes(query.toLowerCase())) {
          const lines = content.split("\n");
          const matchingLines = lines.filter(line => 
            line.toLowerCase().includes(query.toLowerCase())
          );
          if (matchingLines.length > 0) {
            results.push(`\n## ${file.path}\n${matchingLines.join("\n")}`);
          }
        }
      }
      
      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No matches found for "${query}"`,
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: `Found matches for "${query}":${results.join("\n")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching documents: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool to list all available agent.actions
server.tool(
  "list_agent_actions",
  "List all available agent.actions methods with their descriptions",
  {},
  async () => {
    try {
      const agentActionsDir = join(__dirname, "..", "data", "agent-actions");
      const files = readdirSync(agentActionsDir)
        .filter(file => file.endsWith(".md"))
        .map(file => file.replace(".md", ""))
        .sort();
      
      if (files.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No agent actions documentation found.",
            },
          ],
        };
      }
      
      // Build action descriptions
      const actionDescriptions: Record<string, string> = {
        "automation-reference-agent-actions-apps": "App management (launchApp, launchIntent, listApps, browse)",
        "automation-reference-agent-actions-files": "File operations (saveFile)",
        "automation-reference-agent-actions-navigation": "Navigation (goHome, goBack, recents, dpad)",
        "automation-reference-agent-actions-network": "Network operations (airplane mode toggle)",
        "automation-reference-agent-actions-screen": "Screen operations (screenContent, screenshot, nodeAction)",
        "automation-reference-agent-actions-text": "Text input (writeText, copyText, paste, hideKeyboard, inputKey)",
        "automation-reference-agent-actions-touch": "Touch gestures (tap, swipe, hold, doubleTap, multiTap)",
      };
      
      const actionList = files.map(file => {
        const shortName = file.replace("automation-reference-agent-actions-", "");
        const description = actionDescriptions[file] || "Agent actions";
        return `- ${shortName}: ${description}`;
      }).join("\n");
      
      return {
        content: [
          {
            type: "text",
            text: `Available agent.actions categories:\n\n${actionList}\n\nUse read_document with name "agent-actions/<category>" to see full documentation for a specific category.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error listing agent actions: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool to list all available agent.utils
server.tool(
  "list_agent_utils",
  "List all available agent.utils methods with their descriptions",
  {},
  async () => {
    try {
      const agentUtilsDir = join(__dirname, "..", "data", "agent-utils");
      const files = readdirSync(agentUtilsDir)
        .filter(file => file.endsWith(".md"))
        .map(file => file.replace(".md", ""))
        .sort();
      
      if (files.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No agent utils documentation found.",
            },
          ],
        };
      }
      
      // Build util descriptions
      const utilDescriptions: Record<string, string> = {
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
      
      const utilList = files.map(file => {
        const shortName = file.replace("automation-reference-agent-utils-", "");
        const description = utilDescriptions[file] || "Agent utils";
        return `- ${shortName}: ${description}`;
      }).join("\n");
      
      return {
        content: [
          {
            type: "text",
            text: `Available agent.utils categories:\n\n${utilList}\n\nUse read_document with name "agent-utils/<category>" to see full documentation for a specific category.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error listing agent utils: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool to get all TypeScript type definitions
server.tool(
  "get_types",
  "Get all TypeScript type definitions for the Xgodo Automation API",
  {},
  async () => {
    try {
      const typesPath = join(__dirname, "..", "data", "agent-types.md");
      const content = readFileSync(typesPath, "utf-8");
      
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading types: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "hello",
  "Say hello to someone",
  {
    name: z.string().describe("Name of the person to greet"),
  },
  async ({ name }) => {
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${name}! Welcome to the MCP server.`,
        },
      ],
    };
  }
);

server.tool(
  "get_time",
  "Get the current server time",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: `Current time: ${new Date().toISOString()}`,
        },
      ],
    };
  }
);

server.tool(
  "echo",
  "Echo back a message",
  {
    message: z.string().describe("Message to echo back"),
  },
  async ({ message }) => {
    return {
      content: [
        {
          type: "text",
          text: `Echo: ${message}`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
