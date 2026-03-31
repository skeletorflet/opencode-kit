# Themes & Keybinds

Customize the look and feel of the OpenCode TUI.

---

## Themes

### Setting a Theme

In `tui.json`:
```json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "tokyonight"
}
```

### Listing Themes
```
/themes
```

### Creating Custom Themes

Place theme files in:
- `.opencode/themes/` (project)
- `~/.config/opencode/themes/` (global)

---

## Keybinds

### Setting Keybinds

In `tui.json`:
```json
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    "leader": "ctrl+x"
  }
}
```

### Default Keybinds

| Action | Keybind | Command |
|--------|---------|---------|
| Leader key | `ctrl+x` | Prefix for all shortcuts |
| Compact | `ctrl+x c` | `/compact` |
| Details | `ctrl+x d` | `/details` |
| Editor | `ctrl+x e` | `/editor` |
| Exit | `ctrl+x q` | `/exit` |
| Export | `ctrl+x x` | `/export` |
| Help | `ctrl+x h` | `/help` |
| Init | `ctrl+x i` | `/init` |
| Models | `ctrl+x m` | `/models` |
| New session | `ctrl+x n` | `/new` |
| Redo | `ctrl+x r` | `/redo` |
| Sessions | `ctrl+x l` | `/sessions` |
| Share | `ctrl+x s` | `/share` |
| Themes | `ctrl+x t` | `/themes` |
| Undo | `ctrl+x u` | `/undo` |
| Switch agent | `Tab` | Cycle primary agents |
| Toggle reasoning | `ctrl+t` | Cycle model variants |

### Session Navigation

| Action | Key |
|--------|-----|
| Enter child session | `<Leader>+Down` |
| Cycle child sessions | `Right` / `Left` |
| Return to parent | `Up` |

### Custom Keybind Locations

- `.opencode/keybinds/` (project)
- `~/.config/opencode/keybinds/` (global)

---

## Scroll Configuration

```json
{
  "scroll_speed": 3,
  "scroll_acceleration": {
    "enabled": true
  }
}
```

| Option | Description |
|--------|-------------|
| `scroll_speed` | Controls scroll speed (min: 0.001, default: 3) |
| `scroll_acceleration.enabled` | macOS-style smooth scrolling |

> **Note:** `scroll_acceleration.enabled` takes precedence over `scroll_speed`.

---

## Diff Style

```json
{
  "diff_style": "auto"
}
```

| Value | Behavior |
|-------|----------|
| `"auto"` | Adapts to terminal width |
| `"stacked"` | Always single-column layout |

---

## Username Display

Toggle whether your username appears in chat messages:
- Open command palette: `ctrl+x h` or `/help`
- Search for "username" or "hide username"
- Setting persists across sessions

---

## Editor Setup

Set your `EDITOR` environment variable for `/editor` and `/export` commands:

### Linux/macOS
```bash
export EDITOR="code --wait"    # VS Code
export EDITOR="nvim"           # Neovim
export EDITOR="vim"            # Vim
```

### Windows (PowerShell)
```powershell
$env:EDITOR = "code --wait"
```

### Windows (CMD)
```cmd
set EDITOR=code --wait
```

> **Note:** GUI editors like VS Code need the `--wait` flag to block until closed.
