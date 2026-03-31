# Community Plugins

Plugins built by the OpenCode community.

---

## Authentication & Cost Savings

| Plugin | Description |
|--------|-------------|
| [opencode-openai-codex-auth](https://github.com/numman-ali/opencode-openai-codex-auth) | Use your ChatGPT Plus/Pro subscription instead of API credits |
| [opencode-gemini-auth](https://github.com/jenslys/opencode-gemini-auth) | Use your existing Gemini plan instead of API billing |
| [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) | Use Antigravity's free models instead of API billing |
| [opencode-google-antigravity-auth](https://github.com/shekohex/opencode-google-antigravity-auth) | Google Antigravity OAuth with Search support |

## Observability & Monitoring

| Plugin | Description |
|--------|-------------|
| [opencode-helicone-session](https://github.com/H2Shami/opencode-helicone-session) | Auto-inject Helicone session headers for request grouping |
| [opencode-wakatime](https://github.com/angristan/opencode-wakatime) | Track OpenCode usage with Wakatime |
| [opencode-sentry-monitor](https://github.com/stolinski/opencode-sentry-monitor) | Trace and debug AI agents with Sentry AI Monitoring |

## Security & Privacy

| Plugin | Description |
|--------|-------------|
| [opencode-vibeguard](https://github.com/inkdust2021/opencode-vibeguard) | Redact secrets/PII into placeholders before LLM calls |

## Performance & Optimization

| Plugin | Description |
|--------|-------------|
| [opencode-dynamic-context-pruning](https://github.com/Tarquinen/opencode-dynamic-context-pruning) | Optimize token usage by pruning obsolete tool outputs |
| [opencode-md-table-formatter](https://github.com/franlol/opencode-md-table-formatter) | Clean up markdown tables produced by LLMs |

## Development Tools

| Plugin | Description |
|--------|-------------|
| [opencode-daytona](https://github.com/daytonaio/daytona) | Run sessions in isolated Daytona sandboxes with git sync |
| [opencode-type-inject](https://github.com/nick-vi/opencode-type-inject) | Auto-inject TypeScript/Svelte types into file reads |
| [opencode-devcontainers](https://github.com/athal7/opencode-devcontainers) | Multi-branch devcontainer isolation with shallow clones |
| [opencode-shell-strategy](https://github.com/JRedeker/opencode-shell-strategy) | Prevent hangs from TTY-dependent shell operations |
| [opencode-pty](https://github.com/shekohex/opencode-pty) | Run background processes in PTY with interactive input |
| [opencode-websearch-cited](https://github.com/ghoulr/opencode-websearch-cited) | Native websearch with Google grounded-style citations |
| [opencode-firecrawl](https://github.com/firecrawl/opencode-firecrawl) | Web scraping, crawling, and search via Firecrawl CLI |
| [opencode-morph-plugin](https://github.com/morphllm/opencode-morph-plugin) | Fast Apply editing, WarpGrep search, context compaction |

## Notifications

| Plugin | Description |
|--------|-------------|
| [opencode-notificator](https://github.com/panta82/opencode-notificator) | Desktop notifications and sound alerts |
| [opencode-notifier](https://github.com/mohak34/opencode-notifier) | Notifications for permission, completion, and error events |
| [opencode-notify](https://github.com/kdcokenny/opencode-notify) | Native OS notifications for task completion |

## Orchestration & Workflow

| Plugin | Description |
|--------|-------------|
| [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) | Background agents, LSP/AST/MCP tools, curated agents |
| [opencode-workspace](https://github.com/kdcokenny/opencode-workspace) | Multi-agent orchestration harness — 16 components |
| [opencode-background-agents](https://github.com/kdcokenny/opencode-background-agents) | Claude Code-style background agents with async delegation |
| [opencode-scheduler](https://github.com/different-ai/opencode-scheduler) | Schedule recurring jobs with cron syntax |
| [@openspoon/subtask2](https://github.com/spoons-and-mirrors/subtask2) | Extend /commands into orchestration with granular flow control |
| [micode](https://github.com/vtemian/micode) | Brainstorm → Plan → Implement workflow with session continuity |

## Git Integration

| Plugin | Description |
|--------|-------------|
| [opencode-worktree](https://github.com/kdcokenny/opencode-worktree) | Zero-friction git worktrees for OpenCode |

## Session & Terminal

| Plugin | Description |
|--------|-------------|
| [opencode-zellij-namer](https://github.com/24601/opencode-zellij-namer) | AI-powered Zellij session naming |
| [opencode-skillful](https://github.com/zenobi-us/opencode-skillful) | Lazy-load prompts with skill discovery and injection |
| [opencode-supermemory](https://github.com/supermemoryai/opencode-supermemory) | Persistent memory across sessions |

## UI & Interaction

| Plugin | Description |
|--------|-------------|
| [@plannotator/opencode](https://github.com/backnotprop/plannotator) | Interactive plan review with visual annotation |
| [octto](https://github.com/vtemian/octto) | Interactive browser UI for AI brainstorming with multi-question forms |

## Extension Management

| Plugin | Description |
|--------|-------------|
| [ocx](https://github.com/kdcokenny/ocx) | Extension manager with portable, isolated profiles |

## Templates

| Plugin | Description |
|--------|-------------|
| [opencode plugin template](https://github.com/zenobi-us/opencode-plugin-template/) | Template for building OpenCode plugins |

---

## Installing Plugins

### From npm
```json
{
  "plugin": ["opencode-wakatime", "opencode-helicone-session"]
}
```

### From Local Files
Place `.js` or `.ts` files in `.opencode/plugins/` or `~/.config/opencode/plugins/`.

---

## Contributing

Want to add your plugin to this list? [Submit a PR](https://github.com/anomalyco/opencode).

Also check out:
- [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode)
- [opencode.cafe](https://opencode.cafe) community
