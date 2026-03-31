# MCP Servers

**Model Context Protocol (MCP)** lets you add external tools and services to OpenCode.

---

## Overview

MCP servers provide tools that the LLM can use alongside built-in tools. OpenCode supports both **local** and **remote** MCP servers, with automatic **OAuth** handling.

> **Warning:** MCP servers add to your context window. Be careful with how many you enable — servers like the GitHub MCP can quickly exceed context limits.

---

## Local MCP Servers

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-server": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"],
      "environment": {
        "MY_ENV_VAR": "value"
      },
      "timeout": 5000,
      "enabled": true
    }
  }
}
```

### Local MCP Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | String | ✅ Yes | Must be `"local"` |
| `command` | Array | ✅ Yes | Command and arguments to start the server |
| `environment` | Object | | Environment variables |
| `enabled` | Boolean | | Enable/disable on startup |
| `timeout` | Number | | Timeout in ms for fetching tools (default: 5000) |

---

## Remote MCP Servers

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer {env:SENTRY_TOKEN}"
      },
      "timeout": 5000
    }
  }
}
```

### Remote MCP Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | String | ✅ Yes | Must be `"remote"` |
| `url` | String | ✅ Yes | URL of the remote MCP server |
| `enabled` | Boolean | | Enable/disable on startup |
| `headers` | Object | | HTTP headers |
| `oauth` | Object/Boolean | | OAuth configuration |
| `timeout` | Number | | Timeout in ms (default: 5000) |

---

## OAuth

OpenCode automatically handles OAuth for remote MCP servers:

1. Detects 401 response
2. Initiates OAuth flow
3. Uses Dynamic Client Registration (RFC 7591)
4. Stores tokens securely in `~/.local/share/opencode/mcp-auth.json`

### Automatic OAuth
```json
{
  "mcp": {
    "my-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp"
    }
  }
}
```

### Pre-registered OAuth
```json
{
  "mcp": {
    "my-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "clientId": "{env:MY_CLIENT_ID}",
        "clientSecret": "{env:MY_CLIENT_SECRET}",
        "scope": "tools:read tools:execute"
      }
    }
  }
}
```

### Disabling OAuth
```json
{
  "mcp": {
    "my-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

---

## Managing MCP Servers

```bash
opencode mcp add              # Add MCP server (interactive wizard)
opencode mcp list             # List all servers + status
opencode mcp ls               # Short version
opencode mcp auth <name>      # Authenticate with OAuth server
opencode mcp auth list        # List OAuth-capable servers
opencode mcp logout <name>    # Remove OAuth credentials
opencode mcp debug <name>     # Debug connection issues
```

---

## Managing MCP Tools

### Globally
```json
{
  "tools": {
    "my-mcp*": false
  }
}
```

### Per-Agent
```json
{
  "tools": {
    "my-mcp*": false
  },
  "agent": {
    "my-agent": {
      "tools": {
        "my-mcp*": true
      }
    }
  }
}
```

### Glob Patterns
- `*` matches zero or more characters
- `?` matches exactly one character
- MCP tools are registered with server name prefix: `servername_toolname`

---

## Example MCP Servers

### Sentry
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
Authenticate: `opencode mcp auth sentry`

### Context7 (Documentation Search)
```json
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

### Grep by Vercel (GitHub Code Search)
```json
{
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

---

## Remote Default Overrides

Organizations can provide default MCP servers via `.well-known/opencode`. Override locally:

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
