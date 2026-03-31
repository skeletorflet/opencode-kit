# GitLab Integration

Integrate OpenCode with GitLab Duo Agent Platform for AI-powered development.

---

## Overview

OpenCode integrates with the **GitLab Duo Agent Platform (DAP)**, providing AI-powered agentic chat with native tool calling capabilities.

> **Status:** Experimental. Features and behavior may change.

### License Requirements
- Requires **Premium** or **Ultimate** GitLab subscription
- Available on GitLab.com and GitLab Self-Managed

---

## Authentication

### OAuth (Recommended)
```bash
/connect
```
Select **GitLab** → **OAuth** → browser opens for authorization.

### Personal Access Token
1. Go to [GitLab User Settings > Access Tokens](https://gitlab.com/-/user_settings/personal_access_tokens)
2. Create token: Name `OpenCode`, Scope `api`
3. Copy the token (starts with `glpat-`)
4. Enter in terminal during `/connect`

### Environment Variable
```bash
export GITLAB_TOKEN=glpat-...
```

---

## Available Models

| Model | Description |
|-------|-------------|
| `duo-chat-haiku-4-5` | Fast responses (default) |
| `duo-chat-sonnet-4-5` | Balanced performance |
| `duo-chat-opus-4-5` | Most capable for complex analysis |

---

## Self-Hosted GitLab

### Environment Variables
```bash
export GITLAB_INSTANCE_URL=https://gitlab.company.com
export GITLAB_TOKEN=glpat-...
export GITLAB_AI_GATEWAY_URL=https://ai-gateway.company.com  # Optional
```

### OAuth for Self-Hosted
Create an application in Settings → Applications with:
- Callback URL: `http://127.0.0.1:8080/callback`
- Scopes: `api`, `read_user`, `read_repository`

Then:
```bash
export GITLAB_OAUTH_CLIENT_ID=your_application_id
```

### Configuration
```json
{
  "provider": {
    "gitlab": {
      "options": {
        "instanceUrl": "https://gitlab.com"
      }
    }
  }
}
```

---

## DAP Workflow Models

DAP workflow models route tool calls through GitLab's Duo Workflow Service:

1. Discover available models from your GitLab namespace
2. Selection picker if multiple models available
3. Cache selected model to disk
4. Route tool execution through permission-gated system

Models follow `duo-workflow-*` naming convention.

---

## GitLab API Tools (Plugin)

For MR reviews, issues, pipelines, CI/CD:

```json
{
  "plugin": ["opencode-gitlab-plugin"]
}
```

Provides:
- Merge request reviews
- Issue tracking
- Pipeline monitoring
- CI/CD management

---

## Compliance Note

For self-hosted instances, lock OpenCode to use only GitLab-hosted models:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "small_model": "gitlab/duo-chat-haiku-4-5",
  "share": "disabled"
}
```

---

## Administrator Requirements

Your GitLab admin must:
1. Turn on GitLab Duo for user/group/instance
2. Turn on Agent Platform (GitLab 18.8+) or beta features (18.7 and earlier)
3. For Self-Managed: configure the instance
