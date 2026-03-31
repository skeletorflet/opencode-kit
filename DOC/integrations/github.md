# GitHub Integration

Automate repository workflows with the OpenCode GitHub agent.

---

## Overview

The GitHub agent integrates OpenCode with your repositories for automated code review, PR management, and CI/CD workflows.

---

## Installation

### In Your Repository
```bash
opencode github install
```

This sets up:
- GitHub Actions workflow files
- Configuration prompts
- Agent setup

### Running the Agent
```bash
opencode github run
```

Typically used within GitHub Actions.

---

## GitHub Actions

After installation, OpenCode creates a workflow file in `.github/workflows/`.

### Manual Trigger
```yaml
on:
  workflow_dispatch:
    inputs:
      prompt:
        description: "What should OpenCode do?"
        required: true
        type: string
```

### Event-Based
```yaml
on:
  pull_request:
    types: [opened, synchronize]
  issue_comment:
    types: [created]
```

---

## GitHub Copilot as Provider

Use your GitHub Copilot subscription as an LLM provider:

```bash
/connect
```
Select **GitHub Copilot** → authenticate via device code at [github.com/login/device](https://github.com/login/device).

> **Note:** Some models require a Pro+ subscription.

---

## Running with Tokens

```bash
opencode github run \
  --token ghp_your_token \
  --event pull_request
```

| Flag | Description |
|------|-------------|
| `--token` | GitHub personal access token |
| `--event` | GitHub mock event to run for |

---

## Use Cases

| Use Case | Description |
|----------|-------------|
| **PR Review** | Automatically review pull requests |
| **Issue Triage** | Categorize and respond to issues |
| **Code Generation** | Generate code from issue descriptions |
| **Documentation** | Auto-update docs on code changes |
| **Changelog** | Generate changelogs from commits |

---

## Configuration

Configure through `opencode.json`:
```json
{
  "agent": {
    "github-reviewer": {
      "description": "Reviews PRs automatically",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "{file:./prompts/github-review.txt}"
    }
  }
}
```
