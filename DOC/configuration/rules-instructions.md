# Rules & Instructions

Control what the AI knows about your project and how it should behave.

---

## AGENTS.md

The primary project instruction file. Created by running `/init` in the TUI.

```bash
/init
```

This analyzes your project and creates `AGENTS.md` in the project root. **Commit this file to Git** — it helps OpenCode understand:
- Project structure
- Coding patterns
- Architecture decisions
- Conventions

---

## Custom Instructions

Add additional instruction files:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "CONTRIBUTING.md",
    "docs/guidelines.md",
    ".cursor/rules/*.md"
  ]
}
```

Accepts paths and glob patterns. Files are loaded as context for every conversation.

---

## Claude Code Compatibility

OpenCode automatically reads Claude Code configuration files for compatibility:

| File | Description |
|------|-------------|
| `~/.claude/CLAUDE.md` | Global Claude instructions |
| `.claude/CLAUDE.md` | Project-level Claude instructions |
| `.claude/skills/` | Claude skills |
| `.agents/skills/` | Agent-compatible skills |

### Disabling Claude Code Reading

```json
{
  "disabled_claude_code": true,
  "disabled_claude_code_prompt": true,
  "disabled_claude_code_skills": true
}
```

Or via environment variables:
```bash
OPENCODE_DISABLE_CLAUDE_CODE=true
OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=true
OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=true
```

---

## Instruction File Locations

| Location | Scope |
|----------|-------|
| `AGENTS.md` (project root) | Main project instructions |
| `.opencode/` directory | Project-specific config directory |
| `~/.config/opencode/` | Global config directory |
| `.claude/` | Claude-compatible (project) |
| `~/.claude/` | Claude-compatible (global) |
| `.agents/` | Agent-compatible (project) |
| `~/.agents/` | Agent-compatible (global) |

---

## Best Practices

### What to Include in AGENTS.md

```markdown
# Project Name

## Stack
- TypeScript / Node.js 20
- React 18 / Next.js 14
- PostgreSQL / Prisma

## Architecture
- Monorepo with Turborepo
- API routes in apps/api/
- Shared types in packages/types/

## Code Standards
- ESLint + Prettier
- No `any` types — use `unknown` with narrowing
- Prefer atomic commits with conventional messages
- Tests with Vitest + Playwright

## Key Patterns
- Use server components by default
- Client components marked with "use client"
- API responses use { data, error } envelope
```

### Keep It Updated

- Run `/init` after major project changes
- Manually edit `AGENTS.md` for specific instructions
- Include links to architecture docs

### Example Project Structure

```
project/
├── AGENTS.md              # Main project instructions
├── opencode.json          # OpenCode config
├── tui.json               # TUI settings
├── .opencode/
│   ├── agents/            # Custom agents
│   ├── commands/          # Custom commands
│   ├── plugins/           # Plugins
│   ├── skills/            # Skills
│   └── themes/            # Custom themes
└── docs/
    ├── architecture.md    # Architecture docs
    └── guidelines.md      # Coding guidelines
```
