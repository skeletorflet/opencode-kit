# Common Issues

Frequently encountered problems and their solutions.

---

## Installation Issues

### Command Not Found
```bash
# Verify installation
opencode --version

# If not found, check your PATH
echo $PATH

# Reinstall if needed
npm install -g opencode-ai
```

### Permission Denied (npm global install)
```bash
# Fix npm global permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### Homebrew Formula Outdated
```bash
# Use the OpenCode tap instead of Homebrew's formula
brew install anomalyco/tap/opencode
```

---

## Provider Issues

### No Models Available
```bash
# Refresh model cache
opencode models --refresh

# Verify provider is connected
opencode auth list
```

### API Key Not Working
1. Verify the key is correct
2. Check `~/.local/share/opencode/auth.json`
3. Re-add with `/connect`
4. Check provider's dashboard for key status

### Models Not Showing
- Run `/models` in TUI or `opencode models` in CLI
- Some providers need manual model configuration in `opencode.json`
- Check if the provider is disabled in config

---

## Tool & Permission Issues

### Tools Not Working
```json
{
  "permission": {
    "edit": "allow",
    "bash": "allow"
  }
}
```

### Bash Commands Hanging
- Check for interactive commands (vim, top, etc.)
- Use the `opencode-shell-strategy` plugin for TTY issues
- Set timeout: `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS=30000`

### File Changes Not Undoing
- `/undo` requires a Git repository
- Initialize Git: `git init`
- Check that snapshots are enabled: `"snapshot": true`

---

## Performance Issues

### Slow Startup
- Disable auto-update: `"autoupdate": false`
- Disable model fetching: `OPENCODE_DISABLE_MODELS_FETCH=true`
- Disable LSP downloads: `OPENCODE_DISABLE_LSP_DOWNLOAD=true`

### High Memory Usage
- Compact sessions: `/compact`
- Disable file watcher for large dirs:
```json
{
  "watcher": { "ignore": ["node_modules/**", "dist/**"] }
}
```
- Disable snapshots for large repos: `"snapshot": false`

### Context Window Exceeded
- Use `/compact` to summarize
- Enable auto-compaction: `"compaction": { "auto": true }`
- Use a model with larger context window
- Prune old tool outputs: `"compaction": { "prune": true }`

---

## MCP Issues

### MCP Server Not Connecting
```bash
# Check server status
opencode mcp list

# Debug OAuth issues
opencode mcp debug <server-name>

# Check timeout
# Increase timeout in config
```

### MCP Tools Not Appearing
- Verify `enabled: true` in config
- Check that the server command is correct
- Look for errors in logs: `opencode --print-logs`

---

## TUI Issues

### Rendering Problems
- Use a modern terminal (WezTerm, Alacritty, Ghostty, Kitty)
- Ensure true color support
- Set `TERM=xterm-256color`

### Scroll Issues
- Enable scroll acceleration:
```json
{ "scroll_acceleration": { "enabled": true } }
```

---

## Plugin Issues

### Plugin Not Loading
- Check file is in `.opencode/plugins/` or `~/.config/opencode/plugins/`
- Verify it exports a named function
- Check for syntax errors
- Run with `--print-logs` to see errors

### npm Plugin Not Installing
- Verify package name is correct
- Check npm registry availability
- Clear plugin cache: remove `~/.cache/opencode/node_modules/`

---

## Getting Help

1. Check logs: `opencode --print-logs`
2. Check version: `opencode --version`
3. Search [GitHub Issues](https://github.com/anomalyco/opencode/issues)
4. Ask on [Discord](https://opencode.ai/discord)
