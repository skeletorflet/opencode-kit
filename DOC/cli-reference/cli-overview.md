# CLI Overview

Complete reference for all OpenCode CLI commands.

---

## Starting OpenCode

```bash
opencode                          # Start TUI (default)
opencode /path/to/project         # Start TUI for specific directory
```

---

## Core Commands

### tui
Start the terminal user interface.
```bash
opencode [project]
```

| Flag | Short | Description |
|------|-------|-------------|
| `--continue` | `-c` | Continue the last session |
| `--session` | `-s` | Session ID to continue |
| `--fork` | | Fork the session when continuing |
| `--prompt` | | Prompt to use |
| `--model` | `-m` | Model to use (provider/model) |
| `--agent` | | Agent to use |
| `--port` | | Port to listen on |
| `--hostname` | | Hostname to listen on |

---

### run
Non-interactive mode for scripting and automation.
```bash
opencode run "Explain how closures work in JavaScript"
```

| Flag | Short | Description |
|------|-------|-------------|
| `--command` | | The command to run |
| `--continue` | `-c` | Continue the last session |
| `--session` | `-s` | Session ID to continue |
| `--fork` | | Fork the session |
| `--share` | | Share the session |
| `--model` | `-m` | Model to use |
| `--agent` | | Agent to use |
| `--file` | `-f` | File(s) to attach |
| `--format` | | Output: `default` or `json` |
| `--title` | | Session title |
| `--attach` | | Attach to running server |
| `--port` | | Local server port |

**Examples:**
```bash
opencode run "Explain the use of context in Go"
opencode run -m openai/gpt-4 "Review this code"
opencode run -f src/main.go -f src/utils.go "Find issues"
opencode run --format json "Explain closures"
opencode run --attach http://localhost:4096 "Quick question"
opencode run --share "Implement feature X"
opencode run -c "Continue from before"
```

---

### serve
Headless HTTP server for API access.
```bash
opencode serve
```

| Flag | Description |
|------|-------------|
| `--port` | Port to listen on |
| `--hostname` | Hostname to listen on |
| `--mdns` | Enable mDNS discovery |
| `--cors` | Additional CORS origins |

Set `OPENCODE_SERVER_PASSWORD` for HTTP basic auth.

---

### web
Web interface + server.
```bash
opencode web
```

| Flag | Description |
|------|-------------|
| `--port` | Port to listen on |
| `--hostname` | Hostname to listen on |
| `--mdns` | Enable mDNS discovery |
| `--cors` | Additional CORS origins |

---

### attach
Attach TUI to a running server.
```bash
opencode attach http://10.20.30.40:4096
```

| Flag | Short | Description |
|------|-------|-------------|
| `--dir` | | Working directory |
| `--session` | `-s` | Session ID |

---

## Agent Commands

```bash
opencode agent create    # Interactive agent creation
opencode agent list      # List all agents
```

---

## Auth Commands

```bash
opencode auth login      # Add provider credentials
opencode auth list       # List authenticated providers
opencode auth ls         # Short version
opencode auth logout     # Remove provider credentials
```

---

## Model Commands

```bash
opencode models                  # List all models
opencode models anthropic        # Filter by provider
opencode models --refresh        # Refresh model cache
opencode models --verbose        # Show costs and metadata
```

---

## Session Commands

```bash
opencode session list            # List all sessions
opencode session list -n 10      # Last 10 sessions
opencode session list --format json
```

---

## Stats

```bash
opencode stats                   # Token usage and cost stats
opencode stats --days 7          # Last 7 days
opencode stats --tools 10        # Top 10 tools
opencode stats --models 5        # Top 5 models
opencode stats --project ""      # Current project only
```

---

## Export / Import

```bash
opencode export [sessionID]                     # Export session as JSON
opencode import session.json                    # Import from file
opencode import https://opncd.ai/s/abc123       # Import from share URL
```

---

## MCP Commands

```bash
opencode mcp add              # Add MCP server (interactive)
opencode mcp list             # List MCP servers + status
opencode mcp ls               # Short version
opencode mcp auth <name>      # Authenticate with OAuth server
opencode mcp auth list        # List OAuth-capable servers
opencode mcp logout <name>    # Remove OAuth credentials
opencode mcp debug <name>     # Debug connection issues
```

---

## GitHub Commands

```bash
opencode github install       # Install GitHub Actions workflow
opencode github run           # Run GitHub agent
```

| Flag | Description |
|------|-------------|
| `--event` | GitHub mock event |
| `--token` | GitHub personal access token |

---

## ACP Command

```bash
opencode acp                  # Start ACP server (stdin/stdout)
opencode acp --port 4096      # With specific port
opencode acp --cwd /path      # Working directory
opencode acp --hostname 0.0.0.0
```

---

## Upgrade / Uninstall

```bash
opencode upgrade              # Update to latest version
opencode upgrade v1.3.3       # Update to specific version
opencode uninstall            # Remove OpenCode
opencode uninstall --keep-config
opencode uninstall --keep-data
opencode uninstall --dry-run
opencode uninstall --force
```

---

## Global Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--help` | `-h` | Display help |
| `--version` | `-v` | Print version |
| `--print-logs` | | Print logs to stderr |
| `--log-level` | | DEBUG, INFO, WARN, ERROR |
