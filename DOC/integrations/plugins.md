# Plugins

Plugins extend OpenCode with custom tools, hooks, and integrations.

---

## Using Plugins

### From npm
```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "opencode-helicone-session",
    "opencode-wakatime",
    "@my-org/custom-plugin"
  ]
}
```

### From Local Files
Place `.js` or `.ts` files in:
- `.opencode/plugins/` (project)
- `~/.config/opencode/plugins/` (global)

### Load Order
1. Global config (`~/.config/opencode/opencode.json`)
2. Project config (`opencode.json`)
3. Global plugin directory (`~/.config/opencode/plugins/`)
4. Project plugin directory (`.opencode/plugins/`)

> Duplicate npm packages with same name/version are loaded once. Local and npm plugins with same name are both loaded.

---

## Creating Plugins

### Basic Structure
```javascript
// .opencode/plugins/example.js
export const MyPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Plugin initialized!");
  return {
    // Hook implementations
  };
};
```

### Plugin Context

| Property | Description |
|----------|-------------|
| `project` | Current project information |
| `directory` | Current working directory |
| `worktree` | Git worktree path |
| `client` | OpenCode SDK client for AI interaction |
| `$` | Bun's shell API for executing commands |

### TypeScript Support
```typescript
import type { Plugin } from "@opencode-ai/plugin";

export const MyPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  return {
    // Type-safe hooks
  };
};
```

### Dependencies

Add a `package.json` in your config directory:
```json
{
  "dependencies": {
    "shescape": "^2.1.0"
  }
}
```

OpenCode runs `bun install` at startup.

---

## Plugin Events

### Message Events
- `message.updated` — Message was modified
- `message.removed` — Message was deleted
- `message.part.updated` — Message part changed
- `message.part.removed` — Message part deleted

### Session Events
- `session.created` — New session started
- `session.updated` — Session changed
- `session.compacted` — Session was compacted
- `session.idle` — Session completed/idle
- `session.error` — Session error occurred
- `session.deleted` — Session deleted
- `session.diff` — Session diff available
- `session.status` — Session status changed

### Tool Events
- `tool.execute.before` — Before tool execution
- `tool.execute.after` — After tool execution

### File Events
- `file.edited` — File was modified
- `file.watcher.updated` — File watcher detected change

### Permission Events
- `permission.asked` — Permission request shown
- `permission.replied` — User responded to permission

### Command Events
- `command.executed` — Command was executed

### Server Events
- `server.connected` — Client connected to server

### LSP Events
- `lsp.updated` — LSP server state changed
- `lsp.client.diagnostics` — LSP diagnostics received

### Shell Events
- `shell.env` — Shell environment setup

### TUI Events
- `tui.prompt.append` — Text appended to prompt
- `tui.command.execute` — Command executed
- `tui.toast.show` — Toast notification shown

### Todo Events
- `todo.updated` — Todo list changed

### Installation Events
- `installation.updated` — OpenCode updated

### Experimental
- `experimental.session.compacting` — Before context compaction

---

## Plugin Examples

### Send Notifications
```javascript
export const NotificationPlugin = async ({ project, client, $, directory, worktree }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "Session completed!" with title "opencode"'`;
      }
    },
  };
};
```

### Protect .env Files
```javascript
export const EnvProtection = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read" && output.args.filePath.includes(".env")) {
        throw new Error("Do not read .env files");
      }
    },
  };
};
```

### Inject Environment Variables
```javascript
export const InjectEnvPlugin = async () => {
  return {
    "shell.env": async (input, output) => {
      output.env.MY_API_KEY = "secret";
      output.env.PROJECT_ROOT = input.cwd;
    },
  };
};
```

### Custom Tools
```typescript
import { type Plugin, tool } from "@opencode-ai/plugin";

export const CustomToolsPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      mytool: tool({
        description: "This is a custom tool",
        args: {
          foo: tool.schema.string(),
        },
        async execute(args, context) {
          const { directory, worktree } = context;
          return `Hello ${args.foo} from ${directory} (worktree: ${worktree})`;
        },
      }),
    },
  };
};
```

### Structured Logging
```typescript
export const MyPlugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "my-plugin",
      level: "info",
      message: "Plugin initialized",
      extra: { foo: "bar" },
    },
  });
};
```
Levels: `debug`, `info`, `warn`, `error`.

### Compaction Hooks
```typescript
import type { Plugin } from "@opencode-ai/plugin";

export const CompactionPlugin: Plugin = async (ctx) => {
  return {
    "experimental.session.compacting": async (input, output) => {
      output.context.push(`## Custom Context
Include any state that should persist:
- Current task status
- Important decisions made
- Files being actively worked on`);
    },
  };
};
```

Replace compaction prompt entirely:
```typescript
output.prompt = `Custom compaction prompt...`;
```

---

## Popular Community Plugins

| Plugin | Purpose |
|--------|---------|
| `opencode-helicone-session` | Helicone session tracking |
| `opencode-wakatime` | Wakatime usage tracking |
| `opencode-daytona` | Isolated sandboxes |
| `opencode-vibeguard` | Secret/PII redaction |
| `opencode-supermemory` | Persistent cross-session memory |
| `opencode-notificator` | Desktop notifications |
| `opencode-scheduler` | Cron-based recurring jobs |
| `opencode-worktree` | Git worktree integration |
| `opencode-firecrawl` | Web scraping & crawling |
| `opencode-sentry-monitor` | Sentry AI Monitoring |
| `oh-my-opencode` | Background agents + tools |
| `opencode-workspace` | Multi-agent orchestration |

See the [full ecosystem](../ecosystem/plugins.md) for more.
