# Config Files

OpenCode uses **JSON/JSONC config files** to control behavior. Config files are **merged**, not replaced — settings from all sources are combined.

---

## Config Locations & Precedence

Config is loaded in this order (later sources override earlier ones for conflicting keys):

| Priority | Source | Purpose |
|----------|--------|---------|
| 1 | Remote config (`.well-known/opencode`) | Organizational defaults |
| 2 | Global config (`~/.config/opencode/opencode.json`) | User preferences |
| 3 | Custom config (`OPENCODE_CONFIG` env var) | Custom overrides |
| 4 | Project config (`opencode.json` in project root) | Project-specific settings |
| 5 | `.opencode` directories | Agents, commands, plugins, skills |
| 6 | Inline config (`OPENCODE_CONFIG_CONTENT` env var) | Runtime overrides |

> **Key concept:** Config files are **merged together**. If global sets `autoupdate: true` and project sets `model: "anthropic/claude-sonnet-4-5"`, the final config includes **both** settings.

---

## Config Formats

OpenCode supports both **JSON** and **JSONC** (JSON with Comments):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "autoupdate": true,
  // Server settings
  "server": {
    "port": 4096,
  },
}
```

---

## Config Schema

The schema is available at [opencode.ai/config.json](https://opencode.ai/config.json) for editor autocomplete and validation.

---

## Complete Config Reference

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // === Core ===
  "model": "anthropic/claude-sonnet-4-5",           // Default model
  "small_model": "anthropic/claude-haiku-4-5",      // For lightweight tasks
  "default_agent": "build",                          // Default agent
  "autoupdate": true,                                // Auto-update on startup
  "share": "manual",                                 // "manual" | "auto" | "disabled"
  "snapshot": true,                                  // Enable file snapshots
  "instructions": ["CONTRIBUTING.md"],               // Instruction files

  // === Providers ===
  "provider": {},                                    // Provider configuration
  "disabled_providers": [],                          // Providers to disable
  "enabled_providers": [],                           // Allowlist of providers

  // === Agents ===
  "agent": {},                                       // Agent definitions

  // === Tools ===
  "tools": {},                                       // Tool enable/disable
  "permission": {},                                  // Permission rules

  // === Commands ===
  "command": {},                                     // Custom commands

  // === MCP ===
  "mcp": {},                                         // MCP server definitions

  // === Plugins ===
  "plugin": [],                                      // Plugin list

  // === Formatters ===
  "formatter": {},                                   // Code formatters

  // === Compaction ===
  "compaction": {
    "auto": true,                                    // Auto-compact context
    "prune": true,                                   // Remove old tool outputs
    "reserved": 10000                                // Token buffer
  },

  // === Watcher ===
  "watcher": {
    "ignore": ["node_modules/**", "dist/**"]         // Ignore patterns
  },

  // === Server ===
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "mdnsDomain": "myproject.local",
    "cors": ["http://localhost:5173"]
  },

  // === Experimental ===
  "experimental": {}
}
```

---

## Variable Substitution

### Environment Variables
```json
{
  "model": "{env:OPENCODE_MODEL}",
  "provider": {
    "openai": {
      "options": { "apiKey": "{env:OPENAI_API_KEY}" }
    }
  }
}
```

### File Contents
```json
{
  "provider": {
    "openai": {
      "options": { "apiKey": "{file:~/.secrets/openai-key}" }
    }
  },
  "instructions": ["./custom-instructions.md"]
}
```

File paths can be:
- Relative to the config file directory
- Absolute paths starting with `/` or `~`

---

## TUI Configuration

TUI settings use a separate file: `tui.json` (or `tui.jsonc`).

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "opencode",
  "keybinds": { "leader": "ctrl+x" },
  "scroll_speed": 3,
  "scroll_acceleration": { "enabled": true },
  "diff_style": "auto"
}
```

### TUI Options

| Option | Type | Description |
|--------|------|-------------|
| `theme` | String | UI theme name |
| `keybinds` | Object | Custom keyboard shortcuts |
| `scroll_speed` | Number | Scroll speed (min: 0.001, default: 3) |
| `scroll_acceleration.enabled` | Boolean | macOS-style scroll acceleration |
| `diff_style` | String | `"auto"` or `"stacked"` |

> **Note:** `scroll_acceleration.enabled` takes precedence over `scroll_speed` when enabled.

### TUI Config Locations

| Location | Scope |
|----------|-------|
| `~/.config/opencode/tui.json` | Global TUI settings |
| `tui.json` (project root) | Project-specific TUI settings |

---

## Custom Config Paths

### Custom Config File
```bash
export OPENCODE_CONFIG=/path/to/custom-config.json
```

### Custom Config Directory
```bash
export OPENCODE_CONFIG_DIR=/path/to/config-directory
```

This directory is searched for agents, commands, modes, plugins, skills, and themes — same structure as `.opencode`.

### Inline Config
```bash
export OPENCODE_CONFIG_CONTENT='{"model":"anthropic/claude-sonnet-4-5"}'
```

---

## Directory Structure

The `.opencode` and `~/.config/opencode` directories use **plural names**:

```
.opencode/
├── agents/          # Agent definitions (.md files)
├── commands/        # Custom commands (.md files)
├── plugins/         # Plugin files (.js/.ts)
├── skills/          # Skill definitions (SKILL.md)
├── tools/           # Custom tool definitions
├── themes/          # Custom themes
└── modes/           # Mode definitions
```

> Singular names (e.g., `agent/`) are also supported for backwards compatibility.

---

## Provider Configuration

```json
{
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000,
        "chunkTimeout": 30000,
        "setCacheKey": true,
        "baseURL": "https://api.anthropic.com/v1"
      }
    }
  }
}
```

### Provider Options

| Option | Type | Description |
|--------|------|-------------|
| `timeout` | Number/Boolean | Request timeout in ms (default: 300000) |
| `chunkTimeout` | Number | Timeout between streamed chunks in ms |
| `setCacheKey` | Boolean | Always set cache key for provider |
| `baseURL` | String | Custom API endpoint |

---

## Sharing Configuration

```json
{
  "share": "manual"
}
```

| Value | Behavior |
|-------|----------|
| `"manual"` | Share via `/share` command (default) |
| `"auto"` | Automatically share new conversations |
| `"disabled"` | Disable sharing entirely |

---

## Snapshot Configuration

```json
{
  "snapshot": false
}
```

Snapshots track file changes for undo/redo. Disable for large repos to avoid slow indexing and disk usage.

---

## Autoupdate Configuration

```json
{
  "autoupdate": true
}
```

| Value | Behavior |
|-------|----------|
| `true` | Auto-download updates on startup |
| `false` | Disable updates |
| `"notify"` | Show update notification only |

---

## Compaction Configuration

```json
{
  "compaction": {
    "auto": true,
    "prune": true,
    "reserved": 10000
  }
}
```

| Option | Description |
|--------|-------------|
| `auto` | Auto-compact when context is full |
| `prune` | Remove old tool outputs to save tokens |
| `reserved` | Token buffer reserved for compaction |

---

## Watcher Configuration

```json
{
  "watcher": {
    "ignore": ["node_modules/**", "dist/**", ".git/**"]
  }
}
```

Exclude noisy directories from file watching.

---

## Disabled / Enabled Providers

```json
{
  "disabled_providers": ["openai", "gemini"],
  "enabled_providers": ["anthropic", "openai"]
}
```

> **Important:** `disabled_providers` takes priority over `enabled_providers`.

---

## Remote Config (Organizations)

Organizations can provide default config via `.well-known/opencode` endpoint:

```json
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.example.com/mcp",
      "enabled": false
    }
  }
}
```

Users can opt-in locally:
```json
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.example.com/mcp",
      "enabled": true
    }
  }
}
```
