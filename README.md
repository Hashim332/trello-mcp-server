# Trello MCP Server

A minimal Model Context Protocol (MCP) server that creates Trello cards from JSON task files. This server provides a single tool `create_trello_tasks_from_file` that can batch create cards in a specified Trello list.

## Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Trello credentials:

   - `TRELLO_API_KEY`: Your Trello API key
   - `TRELLO_TOKEN`: Your Trello API token
   - `TRELLO_LIST_ID`: The ID of the list where cards will be created
   - `TASKS_FILE`: Path to your tasks JSON file (optional, defaults to `./tasks.json`)

## Task File Format

Create a JSON file with an array of task objects. See `tasks.sample.json` for examples:

```json
[
  {
    "name": "Task title",
    "desc": "Task description",
    "due": "2024-02-15",
    "labels": ["label1", "label2"],
    "members": ["member1", "member2"]
  }
]
```

## Usage

### Tool Parameters

The `create_trello_tasks_from_file` tool accepts these parameters:

```json
{
  "dryRun": true
}
```

```json
{
  "dryRun": false,
  "skipIfNameExists": true,
  "limit": 10
}
```

- `dryRun` (boolean, default: false): Simulate the operation without creating actual cards
- `skipIfNameExists` (boolean, default: true): Skip creating cards with names that already exist
- `limit` (number, optional): Maximum number of tasks to process

### Expected Output

The tool returns a structured summary:

```json
{
  "totalTasks": 4,
  "processed": 4,
  "created": 3,
  "skipped": 1,
  "dryRun": false,
  "errors": [],
  "createdCards": [...]
}
```

## MCP Client Configuration

Register this server in your MCP client with stdio transport:

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": ["dist/server.js"],
      "env": {
        "TRELLO_API_KEY": "your_key",
        "TRELLO_TOKEN": "your_token",
        "TRELLO_LIST_ID": "your_list_id"
      }
    }
  }
}
```

## Common Issues

- **Missing environment variables**: Ensure all required env vars are set
- **Invalid tasks file**: Check that your JSON file contains a valid array
- **Trello API errors**: Verify your API key, token, and list ID are correct
- **Permission errors**: Ensure your Trello token has write access to the specified list

## Testing

1. **Dry run test:**

   ```bash
   echo '{"dryRun": true}' | node dist/server.js
   ```

2. **Duplicate skip test:**

   ```bash
   echo '{"skipIfNameExists": true}' | node dist/server.js
   ```

3. **Limit test:**
   ```bash
   echo '{"limit": 2}' | node dist/server.js
   ```

## Build

```bash
pnpm run build
```
