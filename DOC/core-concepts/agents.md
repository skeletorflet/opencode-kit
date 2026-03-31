# Agents

Agents are **specialized AI assistants** with custom prompts, models, tool access, and behavior. They let you route different types of work to the most appropriate assistant.

---

## Agent Types

### Primary Agents

The main assistants you interact with directly. Cycle through them with **Tab**.

| Agent | Mode | Tools | Use Case |
|-------|------|-------|----------|
| **build** | Primary | All enabled | Default development work |
| **plan** | Primary | Restricted (read-only) | Analysis, planning, no changes |

### Subagents

Specialized assistants invoked via `@mention` or automatically by primary agents.

| Agent | Mode | Tools | Use Case |
|-------|------|-------|----------|
| **general** | Subagent | Full (except todowrite) | Multi-step tasks, parallel work |
| **explore** | Subagent | Read-only | Codebase exploration, research |
| **compaction** | Primary | Hidden | Auto-compacts long context |
| **title** | Primary | Hidden | Generates session titles |
| **summary** | Primary | Hidden | Creates session summaries |

---

## Using Agents

### Switch Primary Agents
Press **Tab** during a session to cycle through primary agents.

### Invoke Subagents
```
@general Help me search for this function across the codebase
@explore Find all API endpoints in the project
```

### Navigate Sessions
When subagents create child sessions:
- `<Leader>+Down` — Enter first child session
- `Right` / `Left` — Cycle between child sessions
- `Up` — Return to parent session

---

## Configuring Agents

### JSON Configuration

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "{file:./prompts/code-review.txt}",
      "temperature": 0.1,
      "steps": 10,
      "permission": {
        "edit": "deny",
        "bash": {
          "*": "ask",
          "git status *": "allow",
          "grep *": "allow"
        },
        "webfetch": "allow"
      },
      "color": "#ff6b6b"
    }
  }
}
```

### Markdown Configuration

Create `.opencode/agents/review.md`:

```markdown
---
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
permission:
  edit: deny
  bash:
    "*": ask
    "git diff": allow
    "git log*": allow
    "grep *": allow
  webfetch: deny
---
You are in code review mode. Focus on:
- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations

Provide constructive feedback without making direct changes.
```

### Agent Locations

| Location | Scope |
|----------|-------|
| `~/.config/opencode/agents/` | Global agents |
| `.opencode/agents/` | Project-specific agents |

---

## Agent Options Reference

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `description` | String | ✅ Yes | What the agent does |
| `mode` | String | | `primary`, `subagent`, or `all` (default: `all`) |
| `model` | String | | Override model (format: `provider/model-id`) |
| `prompt` | String | | Path to custom system prompt file |
| `temperature` | Number | | 0.0-1.0 randomness control |
| `top_p` | Number | | Alternative to temperature (0.0-1.0) |
| `steps` | Number | | Max agentic iterations before forced response |
| `permission` | Object | | Fine-grained tool permissions |
| `color` | String | | Hex color or theme name for UI |
| `hidden` | Boolean | | Hide from @ autocomplete (subagents only) |
| `disable` | Boolean | | Disable the agent entirely |

---

## Temperature Guide

| Range | Behavior | Best For |
|-------|----------|----------|
| 0.0-0.2 | Very focused, deterministic | Code analysis, planning |
| 0.3-0.5 | Balanced | General development |
| 0.6-1.0 | Creative, varied responses | Brainstorming, design |

---

## Permissions

Control what each agent can do:

```json
{
  "agent": {
    "build": {
      "permission": {
        "edit": "ask",
        "bash": {
          "*": "ask",
          "git status *": "allow",
          "git push": "deny"
        },
        "task": {
          "*": "deny",
          "orchestrator-*": "allow",
          "code-reviewer": "ask"
        }
      }
    }
  }
}
```

Permission levels:
- `"allow"` — Execute without approval
- `"ask"` — Prompt user for approval
- `"deny"` — Completely disabled

**Task permissions** control which subagents an agent can invoke via the Task tool. Uses glob patterns. Last matching rule wins.

---

## Create Agents

### Interactive Creation
```bash
opencode agent create
```

This wizard will:
1. Ask where to save (global or project)
2. Ask for a description
3. Generate system prompt and identifier
4. Let you select tool access
5. Create the markdown agent file

### List Agents
```bash
opencode agent list
```

---

## Default Agent

Set the default agent in config:

```json
{
  "default_agent": "build"
}
```

Must be a primary agent. Falls back to `build` if invalid.

---

## Example Agent Configurations

### Documentation Agent
```markdown
---
description: Writes and maintains project documentation
mode: subagent
permission:
  bash: deny
---
You are a technical writer. Create clear, comprehensive documentation.
Focus on clear explanations, proper structure, code examples, and user-friendly language.
```

### Security Auditor
```markdown
---
description: Performs security audits and identifies vulnerabilities
mode: subagent
permission:
  edit: deny
---
You are a security expert. Focus on identifying potential security issues:
- Input validation vulnerabilities
- Authentication and authorization flaws
- Data exposure risks
- Dependency vulnerabilities
- Configuration security issues
```

### Debug Agent
```json
{
  "debug-agent": {
    "description": "Focused on investigation and debugging",
    "mode": "subagent",
    "model": "anthropic/claude-sonnet-4-20250514",
    "temperature": 0.1,
    "permission": {
      "edit": "ask",
      "bash": "allow",
      "read": "allow",
      "grep": "allow"
    }
  }
}
```
