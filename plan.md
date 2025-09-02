# Cursor Prompt — Minimal Procedural MCP Server for Trello (JSON-only)

---

### task1 — Verify initial setup

- Check that `package.json` exists and project structure is in place.
- Ensure a `src/` directory exists.
- Report back what’s missing (if anything).

---

### task2 — Dependencies

- Verify `package.json` dependencies.
- Required: `@modelcontextprotocol/sdk`, `undici`, `dotenv`.
- Remove unnecessary deps (e.g. `yaml`, `zod`).
- If modification is possible, update `package.json` directly; otherwise, output the exact `pnpm` commands for me to run.
- Run `pnpm install` and confirm.

---

### task3 — Create project layout

Create the following files:

```
.env.example
src/server.js
src/trello.js
tasks.sample.json
README.md
```

---

### task4 — Implement `src/server.js`

- ESM module with shebang `#!/usr/bin/env node`.
- Setup MCP server with stdio transport using `@modelcontextprotocol/sdk`.
- Register tool: `create_trello_tasks_from_file`.
- Validate required env vars (`TRELLO_API_KEY`, `TRELLO_TOKEN`, `TRELLO_LIST_ID`).
- Default tasks file: `./tasks.json` (or `TASKS_FILE` env if provided, restricted to allowlist).
- Handle tool inputs:

  ```ts
  {
    dryRun?: boolean;            // default false
    skipIfNameExists?: boolean;  // default true
    limit?: number;
  }
  ```

- Implement per-task try/catch.
- Return structured summary:

  ```json
  {
    "totalTasks": ...,
    "processed": ...,
    "created": ...,
    "skipped": ...,
    "dryRun": ...,
    "errors": [...],
    "createdCards": [...]
  }
  ```

---

### task5 — Implement `src/trello.js`

Procedural functions only:

- `createCard({ key, token, idList, name, desc, due, idLabels, idMembers })`
- `getCardsInList({ key, token, idList })`
- Optional: `resolveLabelIds(...)`, `resolveMemberIds(...)` (best-effort only, skip gracefully if fails).
- Use `undici` for HTTP.
- Respect Trello API endpoints:

  - GET list cards → `GET https://api.trello.com/1/lists/{idList}/cards`
  - Create card → `POST https://api.trello.com/1/cards`

---

### task6 — Implement `tasks.sample.json`

- Create 3–4 sample tasks with fields `name`, `desc`, `due`, `labels`, `members`.

---

### task7 — Create `.env.example`

Include required env vars:

```
TRELLO_API_KEY=yourKeyHere
TRELLO_TOKEN=yourTokenHere
TRELLO_LIST_ID=yourListIdHere
TASKS_FILE=./tasks.json   # optional
```

---

### task8 — Write `README.md`

- 2–3 sentence overview of tool.
- Setup instructions (env, install deps).
- Show `tasks.sample.json` example.
- Usage guide with example payloads:

  ```json
  { "dryRun": true }
  { "dryRun": false, "skipIfNameExists": true, "limit": 10 }
  ```

- Show expected summary output.
- Show how to register MCP server in a client (generic stdio config example).
- List common failure modes (missing env, invalid file, Trello 401/403).
- Include a small test plan: dryRun, duplicate-skip, limit.

---

### task9 — Local check

- Run `node src/server.js` with dummy `.env`.
- Confirm it starts and registers the tool.
- Run tool in `dryRun` mode and output summary.
- Verify errors are aggregated per-task, not crashing whole batch.

---

### task10 — Ambiguity handling

- If any step requires a decision not covered here, stop and **ask me**. Do not guess.
