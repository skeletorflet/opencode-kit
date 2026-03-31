# Interfaces

OpenCode is available in **6 different interfaces**, each suited for different workflows.

## 1. TUI (Terminal User Interface) — Default

The primary way to use OpenCode. An interactive terminal interface with full features.

```bash
opencode                  # Start TUI in current directory
opencode /path/to/project # Start TUI for specific project
opencode --continue       # Continue last session
opencode -s <session-id>  # Continue specific session
```

**Best for:** Daily development work, interactive coding sessions.

**Features:**
- Interactive chat with the AI
- File references with `@`
- Bash commands with `!`
- Slash commands (`/help`, `/init`, `/undo`, etc.)
- Agent switching with `Tab`
- Image support (drag & drop)
- Session management

---

## 2. CLI (Command Line Interface)

Non-interactive mode for scripting, automation, or quick answers.

```bash
opencode run "Explain how closures work in JavaScript"
opencode run -m openai/gpt-4 "Review @src/main.go"
opencode run -f src/main.go "Find bugs in this code"
opencode run --format json  # Raw JSON output for parsing
opencode run --share        # Auto-share the session
opencode run -c             # Continue last session
opencode run --attach http://localhost:4096 "prompt"  # Attach to server
```

**Best for:** CI/CD pipelines, scripts, quick questions, automation.

**Flags:**
| Flag | Short | Description |
|------|-------|-------------|
| `--model` | `-m` | Model to use (provider/model) |
| `--agent` | | Agent to use |
| `--file` | `-f` | File(s) to attach |
| `--format` | | Output: `default` or `json` |
| `--continue` | `-c` | Continue last session |
| `--session` | `-s` | Session ID |
| `--fork` | | Fork session when continuing |
| `--share` | | Auto-share session |
| `--attach` | | Attach to running server |
| `--title` | | Session title |
| `--port` | | Local server port |

---

## 3. Server Mode

Headless HTTP server for API access.

```bash
opencode serve
opencode serve --port 4096 --hostname 0.0.0.0
opencode serve --mdns              # Enable mDNS discovery
opencode serve --cors "http://localhost:5173"  # CORS origins
```

Set `OPENCODE_SERVER_PASSWORD` for HTTP basic auth (username: `opencode`).

**Best for:** Remote access, API integration, multi-user setups.

---

## 4. Web UI

Browser-based interface — great for remote access or mobile.

```bash
opencode web
opencode web --port 4096 --hostname 0.0.0.0
```

Same auth as server mode (`OPENCODE_SERVER_PASSWORD`).

**Best for:** Remote development, mobile access, sharing with team.

---

## 5. Desktop App

Standalone desktop application with system notifications.

Download from [GitHub Releases](https://github.com/anomalyco/opencode/releases).

**Best for:** Developers who prefer a dedicated app over terminal.

**Features:**
- System notifications when responses are ready
- Native window management
- No terminal emulator required

---

## 6. IDE Extension

Editor integration for VS Code and compatible editors.

Install from your editor's marketplace.

**Best for:** Developers who want AI assistance directly in their editor.

---

## 7. ACP (Agent Client Protocol)

stdin/stdout communication via nd-JSON for custom IDE integrations.

```bash
opencode acp
opencode acp --port 4096
```

**Best for:** Building custom IDE integrations or tooling.

---

## Combining Interfaces

You can mix interfaces for powerful workflows:

### Remote Development
```bash
# Terminal 1: Start the backend server
opencode web --port 4096 --hostname 0.0.0.0

# Terminal 2 (or another machine): Attach TUI to remote backend
opencode attach http://10.20.30.40:4096
```

### Scripting with Server
```bash
# Terminal 1: Start headless server
opencode serve

# Terminal 2: Run commands that attach to it (faster, no cold boot)
opencode run --attach http://localhost:4096 "Explain async/await"
```

---

## Choosing the Right Interface

| Scenario | Recommended Interface |
|----------|----------------------|
| Daily coding | **TUI** |
| Quick question | **CLI** (`opencode run`) |
| CI/CD pipeline | **CLI** with `--format json` |
| Remote access | **Web UI** or **Server + Attach** |
| Desktop preference | **Desktop App** |
| Editor integration | **IDE Extension** |
| Custom tooling | **ACP** |
