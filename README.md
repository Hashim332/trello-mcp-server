## Venue Visualiser MCP Server

A minimal Model Context Protocol (MCP) server that exposes a single tool to add Trello cards to a specified list. Runs over stdio for use with MCP-compatible clients.

### Features

- **add-trello-tasks**: Create a new Trello card with optional description, due/start dates, and labels.

### Requirements

- Node.js 18+
- Trello credentials and target list ID

### Environment Variables

Set these before running:

- `TRELLO_API_KEY`: Your Trello API key
- `TRELLO_TOKEN`: Your Trello API token
- `TRELLO_LIST_ID`: The Trello list ID to receive new cards

### Install & Build

```bash
pnpm install
pnpm build
```

### Run (local)

```bash
export TRELLO_API_KEY=...
export TRELLO_TOKEN=...
export TRELLO_LIST_ID=...
node build/index.js
```

Alternatively, after building you can run the bin directly if linked/installed:

```bash
venue-visualiser-mcp-server
```

### MCP Client Configuration (example)

Works best with Claude Desktop:

On macOS (Claude Desktop), edit `~/Library/Application Support/Claude/claude_desktop_config.json` and add:

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": [
        "/Users/hashim/Documents/MyProjects/venue-visualiser-mcp-server/build/index.js"
      ],
      "env": {
        "TRELLO_API_KEY": "key",
        "TRELLO_TOKEN": "token",
        "TRELLO_LIST_ID": "id"
      }
    }
  }
}
```

On Windows (Claude Desktop), edit `%AppData%/Claude/claude_desktop_config.json`.

PowerShell (open in VS Code):

```powershell
code $env:AppData\Claude\claude_desktop_config.json
```

Example JSON entry on Windows:

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": ["C:\\path\\to\\venue-visualiser-mcp-server\\build\\index.js"],
      "env": {
        "TRELLO_API_KEY": "key",
        "TRELLO_TOKEN": "token",
        "TRELLO_LIST_ID": "id"
      }
    }
  }
}
```

### Tool Reference

- **name**: `add-trello-tasks`
- **description**: Add a new card to a specified list on a specific board
- **params**:
  - `name` (string, required): Card title
  - `description` (string, optional): Card description
  - `dueDate` (string, optional): ISO 8601 datetime
  - `start` (string, optional): `YYYY-MM-DD`
  - `labels` (string[], optional): Trello label IDs

Returns the Trello API response (JSON) or an error description if credentials are missing.

### Development

- Source: `src/index.ts`
- Build output: `build/`
- Scripts: `pnpm build`

Additional examples and notes: see `examples.md` and `zod.md`.

### License

ISC
