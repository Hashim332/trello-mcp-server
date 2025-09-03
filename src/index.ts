import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

/**
 * TODO:
 * - add filebased generation based on tasks.json
 * - add github connection (maybe)
 */

// api keys
const apiKey = process.env.TRELLO_API_KEY;
const token = process.env.TRELLO_TOKEN;
const toDoListId = process.env.TRELLO_LIST_ID;

// Create server instance
const server = new McpServer({
  name: "venue-visualiser-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function addTrelloTasksToBoard(
  name: string,
  description?: string,
  dueDate?: string,
  start?: string,
  labels?: string[]
) {
  try {
    if (!apiKey || !token || !toDoListId) {
      return {
        ok: false,
        status: 400,
        statusText: "Missing Trello credentials",
        data: {
          message:
            "One or more required env vars are missing: TRELLO_API_KEY, TRELLO_TOKEN, TRELLO_LIST_ID",
        },
      };
    }

    const params = new URLSearchParams();
    params.set("idList", toDoListId);
    params.set("key", apiKey);
    params.set("token", token);
    params.set("name", name);
    if (description) params.set("desc", description);
    if (dueDate) params.set("due", dueDate);
    if (start) params.set("start", start);
    if (labels && labels.length > 0) params.set("labels", labels.join(","));

    const response = await fetch("https://api.trello.com/1/cards", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await response.json() : await response.text();

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: body,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      status: 0,
      statusText: "Network/Error",
      data: { message: String(error) },
    };
  }
}

server.tool(
  "add-trello-tasks",
  "Add a new card to a specified list on a specific board",
  {
    name: z.string().describe("Name of the card"),
    description: z.string().optional().describe("Description of the card"),
    dueDate: z
      .string()
      .optional()
      .describe("Due date for the card (ISO 8601 format)"),
    start: z
      .string()
      .optional()
      .describe("Start date for the card (YYYY-MM-DD format, date only)"),
    labels: z
      .array(z.string())
      .optional()
      .describe("Array of label IDs to apply to the card"),
  },
  async ({ name, description, dueDate, start, labels }) => {
    try {
      const apiResponse = await addTrelloTasksToBoard(
        name,
        description,
        dueDate,
        start,
        labels
      );

      const asText = JSON.stringify(apiResponse, null, 2);
      return {
        content: [
          {
            type: "text",
            text: asText && asText.length > 0 ? asText : "<empty response>",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error adding card: ${error}`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Venue Visualiser MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
