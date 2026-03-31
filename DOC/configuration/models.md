# Models

Configure and select which AI models OpenCode uses.

---

## Model Format

Models are identified by `provider/model-id`:
```
anthropic/claude-sonnet-4-20250514
openai/gpt-4o
ollama/qwen2.5-coder
```

---

## Setting the Default Model

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-20250514"
}
```

Or in the TUI:
```
/models
```

---

## Small Model

A separate model for lightweight tasks (title generation, summaries):

```json
{
  "small_model": "anthropic/claude-haiku-4-20250514"
}
```

By default, OpenCode tries to use a cheaper model if available, falling back to the main model.

---

## Listing Models

### In TUI
```
/models
```

### In CLI
```bash
opencode models                    # All models
opencode models anthropic          # Filter by provider
opencode models --refresh          # Refresh model cache
opencode models --verbose          # Show costs and metadata
```

---

## Per-Agent Model Override

Each agent can use a different model:

```json
{
  "agent": {
    "plan": {
      "model": "anthropic/claude-haiku-4-20250514",
      "temperature": 0.1
    },
    "build": {
      "model": "anthropic/claude-sonnet-4-20250514",
      "temperature": 0.3
    },
    "creative": {
      "model": "openai/gpt-4o",
      "temperature": 0.7
    }
  }
}
```

---

## Per-Command Model Override

```json
{
  "command": {
    "analyze": {
      "model": "anthropic/claude-sonnet-4-20250514"
    }
  }
}
```

---

## Local Models

### Ollama
```json
{
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": { "baseURL": "http://localhost:11434/v1" },
      "models": {
        "llama3": { "name": "Llama 3 (local)" },
        "qwen2.5-coder": { "name": "Qwen 2.5 Coder (local)" }
      }
    }
  }
}
```

### llama.cpp
```json
{
  "provider": {
    "llama.cpp": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "llama-server",
      "options": { "baseURL": "http://127.0.0.1:8080/v1" },
      "models": {
        "qwen3-coder:a3b": {
          "name": "Qwen3-Coder a3b",
          "limit": { "context": 128000, "output": 65536 }
        }
      }
    }
  }
}
```

### LM Studio
```json
{
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio",
      "options": { "baseURL": "http://127.0.0.1:1234/v1" },
      "models": {
        "google/gemma-3n-e4b": { "name": "Gemma 3n-e4b" }
      }
    }
  }
}
```

---

## Custom Models

Add models not in the default list:

```json
{
  "provider": {
    "openrouter": {
      "models": {
        "somecoolnewmodel": {}
      }
    }
  }
}
```

With provider routing:
```json
{
  "provider": {
    "openrouter": {
      "models": {
        "moonshotai/kimi-k2": {
          "options": {
            "provider": {
              "order": ["baseten"],
              "allow_fallbacks": false
            }
          }
        }
      }
    }
  }
}
```

---

## Provider-Specific Model Options

### Vercel AI Gateway
```json
{
  "provider": {
    "vercel": {
      "models": {
        "anthropic/claude-sonnet-4": {
          "options": {
            "order": ["anthropic", "vertex"]
          }
        }
      }
    }
  }
}
```

### Amazon Bedrock (Custom Inference Profiles)
```json
{
  "provider": {
    "amazon-bedrock": {
      "models": {
        "anthropic-claude-sonnet-4.5": {
          "id": "arn:aws:bedrock:us-east-1:xxx:application-inference-profile/yyy"
        }
      }
    }
  }
}
```

---

## Model Selection Guide

| Task | Recommended Model Type |
|------|----------------------|
| Quick questions | Haiku / small model |
| Code generation | Sonnet / medium model |
| Complex refactoring | Opus / large model |
| Planning | Haiku / small model |
| Code review | Sonnet / medium model |
| Creative tasks | GPT-4o / high temperature |
| Local/offline | Qwen 2.5 Coder via Ollama |

---

## Experimental Models

Enable experimental models:
```bash
OPENCODE_ENABLE_EXPERIMENTAL_MODELS=true opencode
```

Or in config:
```json
{
  "experimental": {}
}
```

---

## Disabling Model Fetching

Disable fetching models from remote sources:
```bash
OPENCODE_DISABLE_MODELS_FETCH=true opencode
```
