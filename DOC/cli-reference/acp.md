# ACP (Agent Client Protocol)

The Agent Client Protocol enables custom IDE integrations and tooling via stdin/stdout communication.

---

## Overview

ACP uses **nd-JSON** (newline-delimited JSON) over stdin/stdout for bidirectional communication between OpenCode and external clients.

---

## Starting ACP

```bash
opencode acp
opencode acp --port 4096
opencode acp --cwd /path/to/project
opencode acp --hostname 0.0.0.0
```

| Flag | Description |
|------|-------------|
| `--cwd` | Working directory |
| `--port` | Port to listen on (optional, defaults to stdin/stdout) |
| `--hostname` | Hostname to listen on |

---

## Protocol

ACP communicates via newline-delimited JSON:

```json
{"type": "request", "id": 1, "method": "initialize", "params": {...}}
{"type": "response", "id": 1, "result": {...}}
{"type": "notification", "method": "session.updated", "params": {...}}
```

---

## Use Cases

- **IDE Extensions**: Build custom editor integrations
- **Custom UIs**: Create alternative frontends
- **Tooling**: Integrate with build systems
- **Automation**: Script complex workflows

---

## Comparison with Other Interfaces

| Interface | Communication | Best For |
|-----------|--------------|----------|
| **TUI** | Terminal | Interactive development |
| **CLI** | Process exit | Scripts, one-shots |
| **Server** | HTTP API | Remote access, web clients |
| **ACP** | stdin/stdout | IDE integrations |
| **Web** | Browser | Mobile, remote access |
