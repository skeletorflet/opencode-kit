# Enterprise

Deploy and configure OpenCode for enterprise environments.

---

## Remote Configuration

Organizations can provide default configuration via `.well-known/opencode` endpoint.

### Setup
Host a JSON at `https://your-domain/.well-known/opencode`:

```json
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.your-company.com/mcp",
      "enabled": false
    },
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "enabled": false
    }
  },
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://your-proxy.internal/v1"
      }
    }
  },
  "permission": {
    "edit": "ask",
    "bash": "ask"
  }
}
```

Users authenticate with a provider that supports remote config, and the config is fetched automatically.

### User Override
Users can opt-in to specific servers:
```json
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.your-company.com/mcp",
      "enabled": true
    }
  }
}
```

---

## Provider Restrictions

### Allowlist Only
```json
{
  "enabled_providers": ["anthropic", "openai"]
}
```

### Block Specific Providers
```json
{
  "disabled_providers": ["openrouter", "openai"]
}
```

> `disabled_providers` takes priority over `enabled_providers`.

---

## Security

### Disable Sharing
```json
{
  "share": "disabled"
}
```

### Restrict Tools
```json
{
  "tools": {
    "webfetch": false,
    "websearch": false
  }
}
```

### Require Permissions
```json
{
  "permission": {
    "edit": "ask",
    "bash": "ask"
  }
}
```

### Disable External Plugins
```json
{
  "disabled_default_plugins": true
}
```

---

## Authentication

### HTTP Basic Auth
```bash
OPENCODE_SERVER_PASSWORD=company-secret opencode serve
```

### API Key Proxy
Configure providers to route through an internal proxy:
```json
{
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://api-proxy.internal/anthropic"
      }
    }
  }
}
```

---

## Compliance

### Self-Hosted GitLab
```json
{
  "small_model": "gitlab/duo-chat-haiku-4-5",
  "share": "disabled"
}
```

### Data Residency
Use regional providers:
```json
{
  "provider": {
    "azure": {
      "options": {
        "baseURL": "https://your-region.openai.azure.com"
      }
    }
  }
}
```

---

## Deployment Patterns

### Centralized Server
```bash
# Run on central server
opencode serve --hostname 0.0.0.0 --mdns

# Team connects via
opencode attach http://opencode-server.internal:4096
```

### Per-Developer
Each developer runs their own instance with org config:
```bash
opencode
# Fetches remote config from .well-known/opencode
```

### CI/CD Integration
```yaml
# GitHub Actions
- name: AI Code Review
  run: |
    opencode github run --token ${{ secrets.GITHUB_TOKEN }}
```
