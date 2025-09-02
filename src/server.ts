#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import { createTrelloTasksFromFile } from "./trello.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the project root
config({ path: join(__dirname, "..", ".env") });

const mcp = new McpServer(
  {
    name: "trello-mcp-server",
    version: "1.0.0",
  },
  {
    instructions: "Create Trello cards from a JSON tasks file.",
  }
);

// Register tool using high-level API so clients can list and call it
mcp.tool(
  "create_trello_tasks_from_file",
  "Create Trello cards from a JSON file containing task data",
  {
    tasksFile: z
      .string()
      .describe(
        "Path to tasks JSON file; defaults to ./tasks.json or TASKS_FILE env"
      )
      .optional(),
  },
  async ({ tasksFile }) => {
    const apiKey = process.env["TRELLO_API_KEY"];
    const token = process.env["TRELLO_TOKEN"];
    const listId = process.env["TRELLO_LIST_ID"];

    if (!apiKey || !token || !listId) {
      return {
        content: [
          {
            type: "text",
            text: "Missing required env vars: TRELLO_API_KEY, TRELLO_TOKEN, TRELLO_LIST_ID",
          },
        ],
        isError: true,
      };
    }

    const resolvedTasksFile =
      tasksFile || process.env["TASKS_FILE"] || "./tasks.json";

    try {
      const result = await createTrelloTasksFromFile(
        resolvedTasksFile,
        apiKey,
        token,
        listId
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : String(error),
          },
        ],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
mcp.connect(transport);

console.error("Trello MCP Server started");
