# Custom Tools

Define your own tools that the LLM can call, beyond the built-in set.

---

## Overview

Custom tools let you define arbitrary functions the AI can invoke. They're defined in your config file and can execute any code.

---

## Defining Custom Tools

### Via Plugin

The recommended way to add custom tools is through a plugin:

```typescript
import { type Plugin, tool } from "@opencode-ai/plugin";

export const CustomToolsPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      mytool: tool({
        description: "This is a custom tool that does something useful",
        args: {
          foo: tool.schema.string({ description: "Input string" }),
          count: tool.schema.number({ description: "Number of times" }),
        },
        async execute(args, context) {
          const { directory, worktree } = context;
          return `Result: ${args.foo} repeated ${args.count} times in ${directory}`;
        },
      }),
    },
  };
};
```

### Tool Schema Types

| Type | Method | Description |
|------|--------|-------------|
| String | `tool.schema.string()` | Text input |
| Number | `tool.schema.number()` | Numeric input |
| Boolean | `tool.schema.boolean()` | True/false |
| Array | `tool.schema.array()` | List of items |
| Object | `tool.schema.object()` | Nested object |
| Enum | `tool.schema.enum()` | Fixed set of values |

### With Descriptions
```typescript
args: {
  query: tool.schema.string({ description: "The search query" }),
  limit: tool.schema.number({ description: "Max results to return" }),
  verbose: tool.schema.boolean({ description: "Include detailed output" }),
}
```

---

## Tool Context

The `execute` function receives:

| Property | Description |
|----------|-------------|
| `args` | The arguments passed by the LLM |
| `context.directory` | Current working directory |
| `context.worktree` | Git worktree path |

---

## Tool Naming

- Plugin tool names take precedence over built-in tools with the same name
- MCP tools are prefixed with server name: `servername_toolname`
- Use descriptive names that clearly indicate the tool's purpose

---

## Example: Database Query Tool

```typescript
import { type Plugin, tool } from "@opencode-ai/plugin";
import { db } from "./database";

export const DatabasePlugin: Plugin = async (ctx) => {
  return {
    tool: {
      query: tool({
        description: "Execute a read-only database query",
        args: {
          sql: tool.schema.string({ description: "SQL query (SELECT only)" }),
        },
        async execute(args) {
          // Only allow SELECT queries for safety
          if (!args.sql.trim().toUpperCase().startsWith("SELECT")) {
            throw new Error("Only SELECT queries are allowed");
          }
          const results = await db.query(args.sql);
          return JSON.stringify(results, null, 2);
        },
      }),
    },
  };
};
```

---

## Example: API Integration Tool

```typescript
import { type Plugin, tool } from "@opencode-ai/plugin";

export const GitHubPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      list_prs: tool({
        description: "List open pull requests for a repository",
        args: {
          repo: tool.schema.string({ description: "Owner/repo name" }),
        },
        async execute(args) {
          const response = await fetch(
            `https://api.github.com/repos/${args.repo}/pulls?state=open`,
            {
              headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          const prs = await response.json();
          return prs.map((pr: any) => ({
            number: pr.number,
            title: pr.title,
            author: pr.user.login,
            url: pr.html_url,
          }));
        },
      }),
    },
  };
};
```

---

## Managing Custom Tools

### Enable/Disable
```json
{
  "tools": {
    "mytool": true,
    "other-tool": false
  }
}
```

### Permissions
```json
{
  "permission": {
    "mytool": "ask",
    "other-tool": "allow"
  }
}
```

---

## Best Practices

1. **Validate inputs** — Always validate and sanitize arguments
2. **Handle errors** — Throw descriptive errors
3. **Be safe** — Don't expose destructive operations without checks
4. **Describe well** — Write clear descriptions so the LLM knows when to use the tool
5. **Keep it focused** — One tool, one responsibility
6. **Return structured data** — Return JSON when possible for better LLM understanding
