# 🚀 OpenCode Documentation

> **OpenCode** is an open-source, provider-agnostic AI coding agent built for the terminal.
> Written in **Go**, MIT licensed, supporting **75+ LLM providers**.

---

## 📖 Documentation Structure

### Getting Started
| Document | Description |
|----------|-------------|
| [Introduction](./getting-started/introduction.md) | What is OpenCode, overview |
| [Installation](./getting-started/installation.md) | All installation methods |
| [Quick Start](./getting-started/quick-start.md) | Get up and running in 5 minutes |
| [Interfaces](./getting-started/interfaces.md) | TUI, CLI, Web, Desktop, IDE |

### Core Concepts
| Document | Description |
|----------|-------------|
| [Agents](./core-concepts/agents.md) | Primary agents, subagents, configuration |
| [Tools](./core-concepts/tools.md) | Built-in tools, permissions |
| [Commands](./core-concepts/commands.md) | Built-in and custom commands |
| [Skills](./core-concepts/skills.md) | Agent skills and reusable instructions |
| [Permissions](./core-concepts/permissions.md) | Fine-grained tool control |

### Configuration
| Document | Description |
|----------|-------------|
| [Config Files](./configuration/config-files.md) | Locations, precedence, format |
| [Providers](./configuration/providers.md) | 75+ LLM providers setup |
| [Models](./configuration/models.md) | Model selection and local models |
| [Themes & Keybinds](./configuration/themes-keybinds.md) | UI customization |
| [Formatters](./configuration/formatters.md) | Code formatter configuration |
| [Rules & Instructions](./configuration/rules-instructions.md) | AGENTS.md, custom instructions |

### Integrations
| Document | Description |
|----------|-------------|
| [MCP Servers](./integrations/mcp-servers.md) | Model Context Protocol setup |
| [Plugins](./integrations/plugins.md) | Extending OpenCode with plugins |
| [LSP Servers](./integrations/lsp-servers.md) | Language Server Protocol |
| [Custom Tools](./integrations/custom-tools.md) | Define your own tools |
| [GitHub Integration](./integrations/github.md) | GitHub agent and Actions |
| [GitLab Integration](./integrations/gitlab.md) | GitLab Duo integration |

### CLI Reference
| Document | Description |
|----------|-------------|
| [CLI Overview](./cli-reference/cli-overview.md) | All CLI commands and flags |
| [TUI Reference](./cli-reference/tui-reference.md) | Terminal UI features and keybinds |
| [Server Mode](./cli-reference/server.md) | HTTP server and web interface |
| [ACP](./cli-reference/acp.md) | Agent Client Protocol |
| [Environment Variables](./cli-reference/environment-variables.md) | All env vars reference |

### Advanced
| Document | Description |
|----------|-------------|
| [SDK](./advanced/sdk.md) | TypeScript SDK reference |
| [Share & Collaboration](./advanced/share.md) | Sharing conversations |
| [Enterprise](./advanced/enterprise.md) | Enterprise deployment |
| [Experimental Features](./advanced/experimental.md) | Unstable features |

### Ecosystem
| Document | Description |
|----------|-------------|
| [Community Plugins](./ecosystem/plugins.md) | Community-built plugins |
| [Community Projects](./ecosystem/projects.md) | Apps and integrations |
| [Community Agents](./ecosystem/agents.md) | Pre-built agent configurations |

### Troubleshooting
| Document | Description |
|----------|-------------|
| [Windows & WSL](./troubleshooting/windows.md) | Windows setup guide |
| [Common Issues](./troubleshooting/common-issues.md) | Frequently encountered problems |
| [Network](./troubleshooting/network.md) | Proxy and network configuration |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    OpenCode Core (Go)                    │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│   TUI    │   CLI    │  Server  │   Web    │     ACP     │
│ (default)│  (run)   │ (serve)  │  (web)   │  (stdin/out)│
├──────────┴──────────┴──────────┴──────────┴─────────────┤
│                     Agent System                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Build   │  │   Plan   │  │ General  │  │ Explore │ │
│  │ (primary)│  │ (primary)│  │(subagent)│  │(subagent)│ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
├─────────────────────────────────────────────────────────┤
│                      Tools Layer                         │
│  bash · edit · write · read · grep · glob · list · lsp  │
│  apply_patch · skill · todowrite · webfetch · websearch │
├─────────────────────────────────────────────────────────┤
│                   Extension Points                       │
│  MCP Servers · Plugins · Custom Tools · Skills          │
├─────────────────────────────────────────────────────────┤
│                  LLM Providers (75+)                     │
│  OpenAI · Anthropic · Ollama · Groq · Bedrock · etc.    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔗 External Resources

- **GitHub**: [github.com/anomalyco/opencode](https://github.com/anomalyco/opencode)
- **Discord**: [opencode.ai/discord](https://opencode.ai/discord)
- **Official Docs**: [opencode.ai/docs](https://opencode.ai/docs)
- **Awesome OpenCode**: [github.com/awesome-opencode/awesome-opencode](https://github.com/awesome-opencode/awesome-opencode)
- **Community**: [opencode.cafe](https://opencode.cafe)
