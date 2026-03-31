# Introduction

## What is OpenCode?

**OpenCode** is an open-source AI coding agent that runs in your terminal. It helps you write, understand, and refactor code using AI — without being locked into a single provider.

## Key Features

| Feature | Description |
|---------|-------------|
| **Provider-Agnostic** | Works with 75+ LLM providers including OpenAI, Anthropic, Ollama, Groq, Bedrock, and more |
| **Multi-Interface** | Available as TUI, CLI, Desktop App, Web UI, and IDE Extension |
| **Multi-Agent** | Primary agents for main work + subagents for specialized tasks |
| **Extensible** | Plugins, MCP servers, custom tools, skills, and commands |
| **Local-First** | Full support for Ollama, llama.cpp, LM Studio for offline usage |
| **Open Source** | MIT license, written in Go (99.2%), 11k+ GitHub stars |

## Why OpenCode?

Unlike other AI coding tools that lock you into one provider, OpenCode lets you:

- Use **any LLM provider** — OpenAI, Anthropic, local models, or 75+ others
- Use your **existing subscriptions** — ChatGPT Plus, GitHub Copilot, GitLab Duo
- Run **fully offline** with Ollama or llama.cpp
- **Extend** with plugins, MCP servers, and custom tools
- **Share** conversations with your team
- **Integrate** with GitHub Actions, GitLab CI, and more

## Architecture at a Glance

```
┌─────────────────────────────────────────────────┐
│              Interfaces                          │
│  TUI · CLI · Web · Desktop · IDE · ACP          │
├─────────────────────────────────────────────────┤
│              Agent System                        │
│  Build · Plan · General · Explore               │
├─────────────────────────────────────────────────┤
│              Tools                               │
│  bash · edit · write · read · grep · glob · ... │
├─────────────────────────────────────────────────┤
│              Extensions                          │
│  MCP · Plugins · Skills · Custom Tools          │
├─────────────────────────────────────────────────┤
│              LLM Providers (75+)                 │
│  OpenAI · Anthropic · Ollama · Groq · ...       │
└─────────────────────────────────────────────────┘
```

## Quick Comparison

| Feature | OpenCode | Claude Code | Codex CLI |
|---------|----------|-------------|-----------|
| Open Source | ✅ MIT | ❌ | ✅ |
| Provider Choice | ✅ 75+ | ❌ Anthropic only | ❌ OpenAI only |
| Local Models | ✅ Ollama, llama.cpp | ❌ | ❌ |
| Plugin System | ✅ | ✅ Limited | ❌ |
| MCP Support | ✅ | ✅ | ❌ |
| Multi-Agent | ✅ | ✅ | ❌ |
| Desktop App | ✅ | ❌ | ❌ |
| Web UI | ✅ | ❌ | ❌ |
| GitHub Actions | ✅ | ❌ | ✅ |

## Next Steps

- [Installation](./installation.md) — Install OpenCode on your system
- [Quick Start](./quick-start.md) — Get up and running in 5 minutes
- [Interfaces](./interfaces.md) — Explore all available interfaces
