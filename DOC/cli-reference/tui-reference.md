# TUI Reference

Complete reference for the OpenCode Terminal User Interface.

---

## Starting the TUI

```bash
opencode                  # Start in current directory
opencode /path/to/project # Start for specific project
opencode --continue       # Continue last session
opencode -s <session-id>  # Continue specific session
```

---

## Prompt Features

### File References
Use `@` to fuzzy-search and include file content:
```
How is auth handled in @src/auth/index.ts?
```

### Bash Commands
Start with `!` to run a shell command:
```
!ls -la
!npm test
!git log --oneline -5
```

### Slash Commands
Type `/` to see available commands:
```
/help
/init
/undo
```

### Images
Drag and drop images into the terminal to attach them to prompts.

### Subagent Mentions
Use `@` to invoke subagents:
```
@general Help me search for this function
@explore Find all API endpoints
```

---

## Built-in Commands

| Command | Keybind | Description |
|---------|---------|-------------|
| `/connect` | — | Add LLM provider |
| `/compact` | `ctrl+x c` | Compact session |
| `/details` | `ctrl+x d` | Toggle tool details |
| `/editor` | `ctrl+x e` | External editor |
| `/exit` | `ctrl+x q` | Exit (aliases: `/quit`, `/q`) |
| `/export` | `ctrl+x x` | Export to Markdown |
| `/help` | `ctrl+x h` | Help dialog |
| `/init` | `ctrl+x i` | Create AGENTS.md |
| `/models` | `ctrl+x m` | List models |
| `/new` | `ctrl+x n` | New session (alias: `/clear`) |
| `/redo` | `ctrl+x r` | Redo undone message |
| `/sessions` | `ctrl+x l` | List/switch sessions |
| `/share` | `ctrl+x s` | Share conversation |
| `/themes` | `ctrl+x t` | List themes |
| `/thinking` | — | Toggle reasoning visibility |
| `/undo` | `ctrl+x u` | Undo last message |
| `/unshare` | — | Unshare session |

---

## Navigation

### Agent Switching
- **Tab** — Cycle through primary agents

### Session Navigation
| Action | Key | Description |
|--------|-----|-------------|
| Enter child session | `<Leader>+Down` | Enter first child session |
| Cycle child sessions | `Right` | Next child |
| Cycle child sessions | `Left` | Previous child |
| Return to parent | `Up` | Go back to parent |

### Model Variants
- **ctrl+t** — Cycle through model variants (for reasoning models)

---

## Modes

### Build Mode (Default)
- Full tool access
- Can make file changes
- Can run bash commands

### Plan Mode
- Restricted tools (read-only)
- No file modifications
- For analysis and planning
- Switch with **Tab**

---

## Undo / Redo

### Undo
```
/undo
```
- Removes last user message and AI response
- Reverts file changes
- Uses Git internally (requires Git repo)
- Can run multiple times

### Redo
```
/redo
```
- Restores previously undone changes
- Only available after `/undo`

---

## Sharing

### Share
```
/share
```
- Creates shareable link
- Copies to clipboard
- Conversations are NOT shared by default

### Unshare
```
/unshare
```
- Removes public access

---

## Editor Integration

### External Editor
```
/editor
```
Opens your `EDITOR` for composing messages. Useful for long prompts.

### Export
```
/export
```
Exports conversation to Markdown and opens in editor.

### Setup
```bash
export EDITOR="code --wait"    # VS Code
export EDITOR="nvim"           # Neovim
export EDITOR="vim"            # Vim
```

> GUI editors need `--wait` flag.

---

## Customization

### Themes
```
/themes
```
Set in `tui.json`:
```json
{ "theme": "tokyonight" }
```

### Scroll Speed
```json
{
  "scroll_speed": 3,
  "scroll_acceleration": { "enabled": true }
}
```

### Diff Style
```json
{ "diff_style": "auto" }
```
- `"auto"` — Adapts to terminal width
- `"stacked"` — Always single-column

### Username Display
Toggle via command palette (`/help` → search "username").

---

## Tips

1. **Use `@` for context** — Reference files to give the AI precise context
2. **Use `!` for command output** — Include test results, git logs, etc.
3. **Plan before building** — Switch to Plan mode for complex features
4. **Undo freely** — `/undo` reverts everything, use it often
5. **Share for help** — `/share` creates a link for collaboration
6. **Compact long sessions** — `/compact` when context gets too large
