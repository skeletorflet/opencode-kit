# Permissions

Permissions control **what actions the AI can take** without your approval. By default, all operations are allowed, but you can fine-tune this for safety.

---

## Permission Levels

| Level | Behavior |
|-------|----------|
| `"allow"` | Execute without asking |
| `"ask"` | Prompt for user approval before executing |
| `"deny"` | Completely disabled |

---

## Global Permissions

Set in `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "ask",
    "bash": "ask",
    "webfetch": "allow",
    "read": "allow"
  }
}
```

---

## Bash Command Permissions

Control specific bash commands with glob patterns:

```json
{
  "permission": {
    "bash": {
      "*": "ask",
      "git status *": "allow",
      "git diff *": "allow",
      "grep *": "allow",
      "ls *": "allow",
      "cat *": "allow",
      "npm test *": "allow",
      "npm run build *": "allow",
      "git push *": "deny",
      "rm *": "deny"
    }
  }
}
```

**Important:** Rules are evaluated in order, and the **last matching rule wins**. Put `*` first, then specific overrides:

```json
{
  "permission": {
    "bash": {
      "*": "ask",
      "git status *": "allow",
      "git log *": "allow"
    }
  }
}
```

---

## Per-Agent Permissions

Override global permissions for specific agents:

```json
{
  "agent": {
    "build": {
      "permission": {
        "edit": "ask",
        "bash": {
          "*": "ask",
          "git *": "ask",
          "npm *": "allow"
        }
      }
    },
    "plan": {
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "read": "allow",
        "grep": "allow"
      }
    }
  }
}
```

### Markdown Agent Permissions

```markdown
---
description: Code review agent
mode: subagent
permission:
  edit: deny
  bash:
    "*": ask
    "git diff": allow
    "git log*": allow
    "grep *": allow
  webfetch: deny
---
```

---

## Skill Permissions

Control which skills agents can access:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

---

## MCP Tool Permissions

Control MCP server tools with glob patterns:

```json
{
  "permission": {
    "sentry_*": "ask",
    "context7_*": "allow"
  }
}
```

MCP tools are registered with server name prefix, so `sentry_*` matches all tools from the `sentry` MCP server.

---

## Task Permissions

Control which subagents an agent can invoke:

```json
{
  "agent": {
    "orchestrator": {
      "mode": "primary",
      "permission": {
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

**Rules:**
- Uses glob patterns
- Last matching rule wins
- `deny` removes the subagent from Task tool description entirely
- Users can always invoke subagents directly via `@` autocomplete, bypassing task permissions

---

## Permission Inheritance

```
Global permissions
    ↓ (overridden by)
Agent permissions
    ↓ (overridden by)
Command-level permissions
```

---

## Environment Variable

Set inline permissions via environment variable:

```bash
OPENCODE_PERMISSION='{"edit":"ask","bash":"ask"}' opencode
```

---

## Best Practices

### Safe Defaults
```json
{
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git status *": "allow",
      "git diff *": "allow",
      "npm test *": "allow"
    },
    "webfetch": "allow"
  }
}
```

### Read-Only Mode
```json
{
  "permission": {
    "edit": "deny",
    "bash": "deny"
  }
}
```

### Trusted Mode (Default)
```json
{
  "permission": {}
}
```

### CI/CD Mode
```json
{
  "permission": {
    "edit": "allow",
    "bash": "allow",
    "webfetch": "allow"
  }
}
```
