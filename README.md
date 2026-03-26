# xgodo-mcp-server

MCP server for Xgodo Automation API documentation access. Provides tools to search, list, and read documentation for the Xgodo Android automation framework.

## Installation

```bash
bun install
```

## Usage

### Development

```bash
bun run dev
```

### Build & Run

```bash
bun run build
bun run start
```

## Available Tools

| Tool | Description |
|------|-------------|
| `xgodo_list_documents` | List all available stored documents |
| `xgodo_read_document` | Read content from a specific document |
| `xgodo_search_documents` | Search for text within all documents |
| `xgodo_list_agent_actions` | List agent.actions method categories |
| `xgodo_list_agent_utils` | List agent.utils method categories |
| `xgodo_get_types` | Get TypeScript type definitions |

### Tool Details

#### `xgodo_list_documents`

Lists all available documentation files.

**Parameters:**
- `response_format`: Output format (`"markdown"` | `"json"`, default: `"markdown"`)

**Returns:**
- `total`: Number of documents
- `documents`: Array of document names

#### `xgodo_read_document`

Reads the full content of a specific document.

**Parameters:**
- `name`: Document name without `.md` extension (e.g., `"agent-actions/touch"`)
- `response_format`: Output format (`"markdown"` | `"json"`, default: `"markdown"`)

**Returns:**
- `name`: Document name
- `content`: Full document content
- `size`: Content size in characters

#### `xgodo_search_documents`

Searches for text across all documents.

**Parameters:**
- `query`: Search text (case-insensitive)
- `response_format`: Output format (`"markdown"` | `"json"`, default: `"markdown"`)

**Returns:**
- `query`: Search query
- `totalMatches`: Total matching lines found
- `results`: Array of `{ filePath, matchingLines }`

#### `xgodo_list_agent_actions`

Lists available `agent.actions` method categories.

**Parameters:**
- `response_format`: Output format (`"markdown"` | `"json"`, default: `"markdown"`)

**Returns:**
- `categories`: Array of `{ name, description }`

Categories include: `apps`, `files`, `navigation`, `network`, `screen`, `text`, `touch`

#### `xgodo_list_agent_utils`

Lists available `agent.utils` method categories.

**Parameters:**
- `response_format`: Output format (`"markdown"` | `"json"`, default: `"markdown"`)

**Returns:**
- `categories`: Array of `{ name, description }`

Categories include: `callbacks`, `control`, `display`, `files`, `helpers`, `info`, `job`, `out-of-steps`

#### `xgodo_get_types`

Returns TypeScript type definitions for the Xgodo API.

**Parameters:**
- `response_format`: Output format (`"markdown"` | `"json"`, default: `"markdown"`)

**Returns:**
- `content`: TypeScript type definitions
- `size`: Content size in characters

## Scraping Documentation

To fetch new documentation from URLs:

```bash
bun run scrape
```

Edit `src/scripts/scrape.ts` to add new URLs to scrape.

## MCP Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "xgodo": {
      "command": "bun",
      "args": ["run", "/path/to/xgodo-mcp-server/build/index.js"]
    }
  }
}
```

## License

ISC