# Zod Usage in This Project

## What is Zod?

Zod is a TypeScript-first schema validation library that provides runtime type checking and automatic TypeScript type inference.

## How We Use It

In `src/index.ts`, we use Zod to validate tool parameters in our MCP server:

```typescript
server.tool(
  "get_alerts",
  "Get weather alerts for a state",
  {
    state: z.string().length(2).describe("Two-letter state code (e.g. CA, NY)"),
  },
  async ({ state }) => {
    // Function body
  }
);
```

## Benefits

- **Input Validation**: Ensures parameters meet requirements (e.g., state must be exactly 2 characters)
- **Type Safety**: Automatic TypeScript type inference
- **Error Handling**: Invalid inputs are caught before function execution
- **Documentation**: `.describe()` provides clear parameter descriptions for MCP clients

## Documentation

- [Zod Official Documentation](https://zod.dev/)
- [Zod GitHub Repository](https://github.com/colinhacks/zod)
