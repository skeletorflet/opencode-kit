# Quick Start

Get OpenCode up and running in **5 minutes**.

## Step 1: Install

```bash
curl -fsSL https://opencode.ai/install | bash
```

Or see the [full installation guide](./installation.md) for other methods.

## Step 2: Configure a Provider

Open OpenCode and connect your first provider:

```bash
opencode
```

Then run:
```
/connect
```

### Option A: OpenCode Zen (Recommended for Beginners)
1. Select **OpenCode Zen** from the provider list
2. Go to [opencode.ai/auth](https://opencode.ai/auth)
3. Sign in, add billing details, copy your API key
4. Paste the API key in the terminal

### Option B: Use an Existing Subscription
- **ChatGPT Plus/Pro**: Select OpenAI → ChatGPT Plus/Pro → authenticate in browser
- **GitHub Copilot**: Select GitHub Copilot → authenticate with device code
- **GitLab Duo**: Select GitLab → OAuth or Personal Access Token

### Option C: Local Models (No API Key)
1. Install [Ollama](https://ollama.com)
2. Pull a model: `ollama pull qwen2.5-coder`
3. Add to `opencode.json`:
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

## Step 3: Select a Model

```
/models
```

Pick a model from the list. The format is `provider/model-id`.

## Step 4: Initialize Your Project

```bash
cd /path/to/your/project
opencode
```

Then run:
```
/init
```

This analyzes your project and creates an `AGENTS.md` file. **Commit this file to Git** — it helps OpenCode understand your project structure.

## Step 5: Start Working

### Ask Questions
```
How is authentication handled in @src/auth/index.ts?
```

### Add Features
1. Press **Tab** to switch to **Plan mode**
2. Describe what you want:
   ```
   Add a user profile page with avatar upload. Use the existing
   component patterns from @src/components/
   ```
3. Review the plan, then press **Tab** to switch back to **Build mode**
4. Say: `Looks good, implement it`

### Make Direct Changes
```
Refactor the database layer in @src/db/ to use connection pooling.
Follow the patterns in @src/db/pool.ts
```

### Undo Changes
If you're not happy with the result:
```
/undo
```

## Common Workflows

### Quick One-Liner (No TUI)
```bash
opencode run "Explain how closures work in JavaScript"
```

### With File Attachment
```bash
opencode run -f src/main.go "Review this code for issues"
```

### Continue Previous Session
```bash
opencode --continue
# or
opencode -s <session-id>
```

## Next Steps

- [Interfaces](./interfaces.md) — Explore TUI, CLI, Web, Desktop, IDE
- [Agents](../core-concepts/agents.md) — Learn about Build, Plan, and custom agents
- [Configuration](../configuration/config-files.md) — Customize your setup
- [Commands](../core-concepts/commands.md) — Built-in and custom commands
