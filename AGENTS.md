# Antigravity Kit — OpenCode Agent Toolkit

## Project Overview
AI Agent Capability Expansion Toolkit for OpenCode. Provides 34 specialist agents, 69 domain skills, 7 validation scripts, 27 app templates, and 5 workflow commands.

## Stack
- OpenCode CLI (TUI-based AI coding assistant)
- TypeScript / Node.js
- MCP (Model Context Protocol) for external integrations
- Multi-language support: Go, Java, .NET, Kotlin, PHP, Ruby, C++, Swift, Python, Rust, JS/TS

## Critical Rules
- ALWAYS read the agent `.md` file before applying its persona
- NEVER skip skill loading — check agent frontmatter `skills:` field
- RULES.md (P0) > Agent .md (P1) > SKILL.md (P2) — priority order is binding
- For complex tasks: create `{task-slug}.md` plan FIRST, then implement
- Mobile projects → `mobile-developer` ONLY (never `frontend-specialist`)
- Security-related changes → include `security-auditor` review

## Code Standards
- Follow `clean-code` skill conventions (language-agnostic)
- Use `naming-conventions` skill for language-specific naming
- No `any` types — use `unknown` and narrow with type guards
- Prefer atomic commits with conventional messages (feat:, fix:, chore:)

## Agent Routing
- When user request touches multiple domains → use `orchestrator`
- Single domain → use the specific specialist agent
- Always announce: `🤖 Applying knowledge of @[agent-name]...`

## External File Loading
When you encounter references like @docs/standards.md, use the Read tool to
load them on demand — do NOT preload everything upfront.

## Scripts Reference
Run validation scripts via: `python .opencode/scripts/<script>.py`

| Script | When |
|--------|------|
| `security_scan.py` | Before deploy |
| `lint_runner.py` | Every code change |
| `test_runner.py` | After logic change |
| `ux_audit.py` | After UI change |
| `checklist.py` | Final verification |

## Skills & Agents
- Agents: `.opencode/agents/` (33 specialists)
- Skills: `.opencode/skills/` (57 knowledge modules)
- Commands: `.opencode/commands/` (slash-commands)
- Tools: `.opencode/tools/` (custom callable tools)
- Prompts: `.opencode/prompts/` (reusable prompt files)
