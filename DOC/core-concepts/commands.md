# Commands

Commands are **slash commands** you can run in the TUI to quickly perform actions. OpenCode includes built-in commands and supports custom commands for repetitive tasks.

---

## Built-in Commands

| Command | Keybind | Description |
|---------|---------|-------------|
| `/connect` | — | Add an LLM provider and configure API keys |
| `/compact` | `ctrl+x c` | Compact the current session (alias: `/summarize`) |
| `/details` | `ctrl+x d` | Toggle tool execution details visibility |
| `/editor` | `ctrl+x e` | Open external editor for composing messages |
| `/exit` | `ctrl+x q` | Exit OpenCode (aliases: `/quit`, `/q`) |
| `/export` | `ctrl+x x` | Export current conversation to Markdown |
| `/help` | `ctrl+x h` | Show the help dialog |
| `/init` | `ctrl+x i` | Create or update AGENTS.md file |
| `/models` | `ctrl+x m` | List available models |
| `/new` | `ctrl+x n` | Start a new session (alias: `/clear`) |
| `/redo` | `ctrl+x r` | Redo a previously undone message |
| `/sessions` | `ctrl+x l` | List and switch between sessions |
| `/share` | `ctrl+x s` | Share current conversation |
| `/themes` | `ctrl+x t` | List available themes |
| `/thinking` | — | Toggle visibility of thinking/reasoning blocks |
| `/undo` | `ctrl+x u` | Undo last message and revert file changes |
| `/unshare` | — | Unshare current session |

---

## Command Details

### /connect
Add a provider to OpenCode. Prompts you to select from available providers and enter API keys.

### /compact
Compacts the current session summary. Useful when context gets too long. Alias: `/summarize`.

### /details
Toggles visibility of tool execution details in the conversation.

### /editor
Opens your external editor (configured via `EDITOR` env var) for composing messages. Useful for long prompts.

### /exit
Exits OpenCode gracefully.

### /export
Exports the current conversation as Markdown and opens it in your editor.

### /help
Shows the help dialog with all available commands and keybinds.

### /init
Analyzes your project and creates/updates `AGENTS.md`. This file helps OpenCode understand your project structure.

### /models
Lists all available models from configured providers in `provider/model` format.

### /new
Starts a fresh session, clearing the current conversation.

### /redo
Redo a previously undone message. Restores file changes too. Requires a Git repository.

### /sessions
Lists all sessions and lets you switch between them.

### /share
Creates a shareable link for the current conversation and copies it to clipboard.

### /themes
Lists available UI themes.

### /thinking
Toggles display of reasoning/thinking blocks. Only controls visibility, not the model's actual reasoning capability.

### /undo
Undoes the last message, removing the user message, AI response, and any file changes. Uses Git internally.

### /unshare
Removes a previously shared conversation from public access.

---

## Custom Commands

Create reusable commands for repetitive tasks.

### Creating Commands

#### Method 1: Markdown Files (Recommended)

Create `.opencode/commands/test.md`:

```markdown
---
description: Run tests with coverage
agent: build
model: anthropic/claude-sonnet-4-20250514
---
Run the full test suite with coverage report and show any failures.
Focus on the failing tests and suggest fixes.
```

Run with:
```
/test
```

#### Method 2: JSON Config

```json
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report.\nFocus on failing tests and suggest fixes.",
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-sonnet-4-20250514"
    }
  }
}
```

### Command Locations

| Location | Scope |
|----------|-------|
| `~/.config/opencode/commands/` | Global commands |
| `.opencode/commands/` | Project-specific commands |

---

## Command Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `template` | String | ✅ Yes | The prompt sent to the LLM |
| `description` | String | | Shown in TUI when typing `/` |
| `agent` | String | | Which agent executes (defaults to current) |
| `model` | String | | Override model for this command |
| `subtask` | Boolean | | Force subagent invocation |

---

## Prompt Placeholders

### Arguments

Use `$ARGUMENTS` for all arguments:

```markdown
---
description: Create a new component
---
Create a new React component named $ARGUMENTS with TypeScript support.
```

Usage:
```
/component Button
```

Or use positional parameters:
```markdown
---
description: Create a file
---
Create a file named $1 in directory $2 with content: $3
```

Usage:
```
/create-file config.json src "{ \"key\": \"value\" }"
```

### Shell Output

Inject shell command output with `` !`command` ``:

```markdown
---
description: Review recent changes
---
Recent git commits:
!`git log --oneline -10`

Review these changes and suggest improvements.
```

### File References

Include file content with `@filename`:

```markdown
---
description: Review component
---
Review the component in @src/components/Button.tsx.
Check for performance issues and suggest improvements.
```

---

## Example Commands

### Code Review Command
```markdown
---
description: Review code quality
agent: plan
---
Review the code in @src/ for:
- Security vulnerabilities
- Performance issues
- Code style consistency
- Best practices
```

### Deploy Command
```markdown
---
description: Deploy to production
agent: build
---
Run the deployment pipeline:
!`npm run build`
!`npm run test`
!`npm run deploy`
Report any failures and suggest fixes.
```

### Component Generator
```markdown
---
description: Generate a component
---
Create a new component named $1:
- TypeScript with proper typing
- Unit test file
- Storybook story
- Follow patterns from @src/components/
```

---

## Overriding Built-in Commands

Custom commands can override built-in commands. If you create a custom command named `undo`, it will replace the built-in `/undo`.

```json
{
  "command": {
    "undo": {
      "template": "Custom undo behavior...",
      "description": "My custom undo"
    }
  }
}
```
