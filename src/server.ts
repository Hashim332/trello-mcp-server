#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { config } from "dotenv";
import { createTrelloTasksFromFile } from "./trello.js";

// Load environment variables
config();

const createTrelloTasksTool: Tool = {
  name: "create_trello_tasks_from_file",
  description: "Create Trello cards from a JSON file containing task data",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const server = new Server(
  {
    name: "trello-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {
        create_trello_tasks_from_file: createTrelloTasksTool,
      },
    },
  }
);

// Validate required environment variables
const requiredEnvVars = ["TRELLO_API_KEY", "TRELLO_TOKEN", "TRELLO_LIST_ID"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
  process.exit(1);
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "create_trello_tasks_from_file") {
    // Use environment variable or fallback to default path
    const tasksFile = process.env["TASKS_FILE"] || "./tasks.json";

    try {
      const result = await createTrelloTasksFromFile(
        tasksFile,
        process.env["TRELLO_API_KEY"]!,
        process.env["TRELLO_TOKEN"]!,
        process.env["TRELLO_LIST_ID"]!
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
            text: JSON.stringify(
              {
                error:
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

const transport = new StdioServerTransport();
server.connect(transport);

console.error("Trello MCP Server started");
