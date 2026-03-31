# Tools

Tools are the **actions the LLM can perform** in your codebase. OpenCode comes with a set of built-in tools, and you can extend them with custom tools and MCP servers.

---

## Built-in Tools

### File Operations

| Tool | Description | Permission Key |
|------|-------------|----------------|
| **read** | Read file contents (supports line ranges) | `read` |
| **edit** | Modify existing files via exact string replacement | `edit` |
| **write** | Create new files or overwrite existing ones | `edit` |
| **apply_patch** | Apply patches/diffs to files | `edit` |

> **Note:** The `write`, `apply_patch`, and `multiedit` tools are all controlled by the `edit` permission.

### Search & Discovery

| Tool | Description | Permission Key |
|------|-------------|----------------|
| **grep** | Regex search across codebase | `grep` |
| **glob** | Find files by glob pattern (e.g., `**/*.ts`) | `glob` |
| **list** | List directory contents (supports glob filtering) | `list` |

### System

| Tool | Description | Permission Key |
|------|-------------|----------------|
| **bash** | Execute shell commands in project environment | `bash` |
| **lsp** | Code intelligence (definitions, references, hover info) — *experimental* | `lsp` |

### Knowledge

| Tool | Description | Permission Key |
|------|-------------|----------------|
| **skill** | Load agent skills (SKILL.md files) on demand | `skill` |
| **webfetch** | Fetch and read web content | `webfetch` |
| **websearch** | Search the web using Exa AI | `websearch` |

### Interaction

| Tool | Description | Permission Key |
|------|-------------|----------------|
| **question** | Ask the user questions during execution | `question` |
| **todowrite** | Manage todo lists during sessions | `todowrite` |

---

## Tool Details

### bash
Execute any shell command in your project environment.
```
The LLM can run: npm install, git status, npm test, etc.
```

### edit
Performs exact string replacements in files. The primary way the LLM modifies code.
- Requires exact match of the text to replace
- Shows diff preview before applying

### write
Creates new files or overwrites existing ones entirely.
- Used for generating new files from scratch
- Can also completely replace existing files

### read
Reads file contents. Supports reading specific line ranges for large files.
- Respects `.gitignore` patterns by default
- Can be overridden with `.ignore` file

### grep
Fast content search using regular expressions.
- Full regex syntax support
- File pattern filtering
- Uses ripgrep under the hood

### glob
Find files by pattern matching.
- Patterns: `**/*.js`, `src/**/*.ts`, etc.
- Returns paths sorted by modification time

### list
Lists directory contents.
- Accepts glob patterns to filter results
- Shows files and subdirectories

### lsp (Experimental)
Language Server Protocol integration for code intelligence.
- `goToDefinition`, `findReferences`, `hover`
- `documentSymbol`, `workspaceSymbol`
- `goToImplementation`, `prepareCallHierarchy`
- `incomingCalls`, `outgoingCalls`

Enable with: `OPENCODE_EXPERIMENTAL_LSP_TOOL=true`

### apply_patch
Applies patch files to your codebase.
- Paths embedded in marker lines within patch text
- Supports: Add, Update, Move, Delete operations

### skill
Loads a SKILL.md file and returns its content in the conversation.
- Agents see available skills in the tool description
- Skills are loaded on-demand when needed

### todowrite
Creates and updates task lists to track progress.
- Disabled for subagents by default
- Useful for organizing multi-step tasks

### webfetch
Fetches web content and converts to markdown.
- Useful for looking up documentation
- Supports URL input

### websearch
Searches the web using Exa AI.
- Only available with OpenCode provider or `OPENCODE_ENABLE_EXA=1`
- No API key required — connects to Exa's hosted MCP service
- Use for discovery; use `webfetch` for retrieval from specific URLs

### question
Allows the LLM to ask you questions during a task.
- Multiple choice options
- Custom text answers
- Useful for gathering requirements mid-task

---

## Configuring Tools

### Global Tool Configuration

Enable/disable tools globally in `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    "write": false,
    "bash": false
  }
}
```

### Permission Configuration

Control tool behavior with permissions:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "deny",
    "bash": "ask",
    "webfetch": "allow",
    "mymcp_*": "ask"
  }
}
```

Permission levels:
| Level | Behavior |
|-------|----------|
| `"allow"` | Execute without approval |
| `"ask"` | Prompt for user approval |
| `"deny"` | Completely disabled |

### Per-Agent Tool Configuration

```json
{
  "agent": {
    "plan": {
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    },
    "build": {
      "permission": {
        "edit": "ask",
        "bash": {
          "*": "ask",
          "git status *": "allow"
        }
      }
    }
  }
}
```

---

## Ignore Patterns

Tools like `grep`, `glob`, and `list` use ripgrep internally, which respects `.gitignore` by default.

To include normally-ignored files, create a `.ignore` file:

```
!node_modules/
!dist/
!build/
```

---

## MCP Server Tools

MCP (Model Context Protocol) servers add external tools. See [MCP Servers](../integrations/mcp-servers.md) for details.

```json
{
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

## Custom Tools

Define your own tools in config. See [Custom Tools](../integrations/custom-tools.md) for details.
