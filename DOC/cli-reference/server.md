# Server Mode

Run OpenCode as a headless HTTP server for API access and remote connections.

---

## Starting the Server

```bash
opencode serve
opencode serve --port 4096
opencode serve --hostname 0.0.0.0
opencode serve --mdns
opencode serve --cors "http://localhost:5173"
```

---

## Server Configuration

```json
{
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "mdnsDomain": "myproject.local",
    "cors": ["http://localhost:5173"]
  }
}
```

| Option | Description |
|--------|-------------|
| `port` | Port to listen on |
| `hostname` | Hostname (defaults to `0.0.0.0` when mDNS enabled) |
| `mdns` | Enable mDNS service discovery |
| `mdnsDomain` | Custom mDNS domain (default: `opencode.local`) |
| `cors` | Additional CORS origins |

---

## Authentication

Set environment variables for HTTP basic auth:

```bash
OPENCODE_SERVER_PASSWORD=mysecret opencode serve
OPENCODE_SERVER_USERNAME=admin opencode serve
```

Default username: `opencode`

---

## Attaching to a Server

### From TUI
```bash
opencode attach http://10.20.30.40:4096
```

### From CLI
```bash
opencode run --attach http://localhost:4096 "Explain async/await"
```

### Remote Development Workflow
```bash
# Machine 1: Start the backend
opencode web --port 4096 --hostname 0.0.0.0

# Machine 2: Attach TUI
opencode attach http://10.20.30.40:4096
```

---

## Web Interface

```bash
opencode web
opencode web --port 4096 --hostname 0.0.0.0
```

Same server options as `serve`, plus opens a browser automatically.

---

## mDNS Discovery

When enabled, other devices on the network can discover your server:

```bash
opencode serve --mdns
```

Custom domain for running multiple instances:
```bash
opencode serve --mdns --hostname 0.0.0.0
# Configure mdnsDomain in opencode.json
```

---

## API Access

The server provides an HTTP API for programmatic interaction. See the [SDK documentation](../advanced/sdk.md) for details.

---

## Use Cases

| Scenario | Setup |
|----------|-------|
| **Remote development** | `serve` on remote machine, `attach` locally |
| **Team sharing** | `web` on shared server, team accesses via browser |
| **CI/CD** | `serve` + `run --attach` for faster execution |
| **Mobile access** | `web --hostname 0.0.0.0` + mobile browser |
| **Multi-instance** | Different ports + mDNS domains |
