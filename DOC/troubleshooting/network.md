# Network Configuration

Proxy, firewall, and network setup for OpenCode.

---

## Proxy Support

OpenCode respects standard proxy environment variables:

```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1,.internal.company.com
```

---

## Custom Provider Base URLs

Route API calls through a proxy or gateway:

```json
{
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://api-proxy.internal/anthropic/v1"
      }
    },
    "openai": {
      "options": {
        "baseURL": "https://api-proxy.internal/openai/v1"
      }
    }
  }
}
```

---

## Firewall Rules

### Outbound Connections

OpenCode needs outbound HTTPS access to:
- LLM provider APIs (api.openai.com, api.anthropic.com, etc.)
- Models.dev (model directory)
- npm registry (for plugins)
- GitHub (for updates)

### Inbound Connections (Server Mode)

When running `opencode serve` or `opencode web`:

```bash
# Allow inbound on specific port
sudo ufw allow 4096/tcp

# Or with iptables
sudo iptables -A INPUT -p tcp --dport 4096 -j ACCEPT
```

---

## mDNS Discovery

Enable mDNS for local network discovery:

```bash
opencode serve --mdns
```

Custom domain:
```json
{
  "server": {
    "mdns": true,
    "mdnsDomain": "myproject.local"
  }
}
```

### Firewall for mDNS
```bash
# Allow mDNS (UDP 5353)
sudo ufw allow 5353/udp
```

---

## CORS Configuration

For browser-based access to the server:

```json
{
  "server": {
    "cors": ["http://localhost:5173", "https://app.company.com"]
  }
}
```

---

## Offline Mode

For fully offline usage with local models:

1. Disable model fetching:
```bash
OPENCODE_DISABLE_MODELS_FETCH=true
```

2. Configure local provider:
```json
{
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": { "baseURL": "http://localhost:11434/v1" },
      "models": {
        "qwen2.5-coder": { "name": "Qwen 2.5 Coder" }
      }
    }
  }
}
```

3. Disable autoupdate:
```json
{
  "autoupdate": false
}
```

---

## Enterprise Network

### Certificate Authorities

If your company uses a custom CA:

```bash
export NODE_EXTRA_CA_CERTS=/path/to/company-ca.pem
```

### Internal Model Registry

Point to an internal model configuration:
```bash
OPENCODE_MODELS_URL=https://internal.company.com/models.json
```

### Disable External Services

```json
{
  "disabled_providers": ["openai", "anthropic", "openrouter"],
  "enabled_providers": ["internal-provider"],
  "share": "disabled",
  "autoupdate": false
}
```
