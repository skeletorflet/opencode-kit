# Providers

OpenCode supports **75+ LLM providers** via the AI SDK and [Models.dev](https://models.dev). You're never locked into a single provider.

---

## Quick Setup

1. Run `/connect` in the TUI
2. Select your provider
3. Enter API key or authenticate via browser
4. Run `/models` to see available models

Credentials are stored in `~/.local/share/opencode/auth.json`.

---

## OpenCode Zen & Go

### OpenCode Zen
Curated, tested models by the OpenCode team.

1. Run `/connect` → select **OpenCode Zen**
2. Go to [opencode.ai/auth](https://opencode.ai/auth)
3. Sign in, add billing, copy API key
4. Paste in terminal

### OpenCode Go
Low-cost subscription for popular open coding models.

Same setup flow as Zen — select **OpenCode Go** during `/connect`.

---

## Provider Directory

### Major Providers

#### OpenAI
- **Auth:** ChatGPT Plus/Pro OAuth or manual API key
- **Models:** GPT-4o, GPT-5, o1, o3, etc.
- **Setup:** `/connect` → OpenAI → ChatGPT Plus/Pro or API key

#### Anthropic
- **Auth:** Claude Pro/Max OAuth or manual API key
- **Models:** Claude Sonnet 4, Opus 4, Haiku 4
- **Setup:** `/connect` → Anthropic → OAuth or API key

#### GitHub Copilot
- **Auth:** Device code OAuth
- **Models:** Claude Sonnet, GPT-4o (depends on plan)
- **Setup:** `/connect` → GitHub Copilot → enter device code
- **Note:** Some models require Pro+ subscription

#### GitLab Duo
- **Auth:** OAuth or Personal Access Token
- **Models:** duo-chat-haiku-4-5, duo-chat-sonnet-4-5, duo-chat-opus-4-5
- **Requires:** Premium or Ultimate subscription
- **Setup:** `/connect` → GitLab → OAuth or PAT

### Cloud Providers

#### Amazon Bedrock
- **Auth:** AWS credentials, profile, or bearer token
- **Config:**
```json
{
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-aws-profile",
        "endpoint": "https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"
      }
    }
  }
}
```

#### Google Vertex AI
- **Auth:** Service account JSON or `gcloud auth`
- **Env vars:** `GOOGLE_CLOUD_PROJECT`, `GOOGLE_APPLICATION_CREDENTIALS`, `VERTEX_LOCATION`

#### Azure OpenAI
- **Auth:** API key + resource name
- **Env var:** `AZURE_RESOURCE_NAME`

#### Azure Cognitive Services
- **Auth:** API key + resource name
- **Env var:** `AZURE_COGNITIVE_SERVICES_RESOURCE_NAME`

### Fast & Open Model Providers

| Provider | Setup | Notable Models |
|----------|-------|----------------|
| **Groq** | API key | Llama 3, Mixtral |
| **Cerebras** | API key | Qwen 3 Coder 480B |
| **DeepSeek** | API key | DeepSeek Reasoner |
| **Fireworks AI** | API key | Kimi K2, Llama 3 |
| **Together AI** | API key | Kimi K2 Instruct |
| **Hugging Face** | Token | 17+ providers, Kimi K2, GLM-4.6 |
| **OpenRouter** | API key | Multi-provider aggregator |
| **ZenMux** | API key | Multi-provider aggregator |

### Local Models

#### Ollama
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
> Tip: If tool calls aren't working, increase `num_ctx` to 16k-32k.

#### llama.cpp
```json
{
  "provider": {
    "llama.cpp": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "llama-server (local)",
      "options": { "baseURL": "http://127.0.0.1:8080/v1" },
      "models": {
        "qwen3-coder:a3b": {
          "name": "Qwen3-Coder: a3b-30b (local)",
          "limit": { "context": 128000, "output": 65536 }
        }
      }
    }
  }
}
```

#### LM Studio
```json
{
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (local)",
      "options": { "baseURL": "http://127.0.0.1:1234/v1" },
      "models": {
        "google/gemma-3n-e4b": { "name": "Gemma 3n-e4b (local)" }
      }
    }
  }
}
```

### Gateway & Observability

| Provider | Purpose |
|----------|---------|
| **Helicone** | Observability + Gateway + Caching |
| **Vercel AI Gateway** | Unified endpoint, list price |
| **Cloudflare AI Gateway** | Unified endpoint |
| **Cloudflare Workers AI** | Edge AI inference |

### Regional & Enterprise

| Provider | Region | Notes |
|----------|--------|-------|
| **SAP AI Core** | Global | 40+ models, enterprise |
| **Scaleway** | Europe | Sovereign hosting |
| **OVHcloud** | Europe | European endpoints |
| **STACKIT** | Europe | Sovereign AI |
| **Baseten** | Global | Custom model hosting |
| **Deep Infra** | Global | Open model hosting |
| **IO.NET** | Global | Decentralized GPU |
| **Nebius** | Global | Token factory |
| **Moonshot AI** | China | Kimi K2 |
| **MiniMax** | China | M2.1 |
| **xAI** | Global | Grok models |
| **Z.AI** | China | GLM models |
| **Cortecs** | Global | Kimi K2 Instruct |
| **Firmware** | Global | AI platform |
| **Venice AI** | Global | Privacy-focused |
| **302.AI** | China | Chinese platform |

---

## Custom Provider

Any **OpenAI-compatible** API:

```json
{
  "provider": {
    "myprovider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My AI Provider",
      "options": { "baseURL": "https://api.myprovider.com/v1" },
      "models": {
        "my-model": { "name": "My Model Display Name" }
      }
    }
  }
}
```

### Steps
1. Run `/connect` → scroll to **Other**
2. Enter a unique provider ID
3. Enter your API key
4. Configure in `opencode.json`

---

## Provider Configuration Options

```json
{
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000,
        "chunkTimeout": 30000,
        "setCacheKey": true,
        "baseURL": "https://api.anthropic.com/v1"
      }
    }
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `timeout` | Number | Request timeout in ms (default: 300000) |
| `chunkTimeout` | Number | Timeout between streamed chunks |
| `setCacheKey` | Boolean | Always set cache key |
| `baseURL` | String | Custom API endpoint |

---

## Disabling Providers

```json
{
  "disabled_providers": ["openai", "gemini"]
}
```

Or use an allowlist:
```json
{
  "enabled_providers": ["anthropic", "openai"]
}
```

> `disabled_providers` takes priority over `enabled_providers`.

---

## Managing Credentials

```bash
opencode auth login    # Add provider credentials
opencode auth list     # List authenticated providers
opencode auth ls       # Short version
opencode auth logout   # Remove provider credentials
```
