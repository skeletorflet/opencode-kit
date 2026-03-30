# OpenCode — Complete `.opencode` Kit Guide

> **Source:** [opencode.ai/docs](https://opencode.ai/docs) — verified March 30, 2026  
> **Goal:** Build a battle-ready `.opencode/` directory with agents, skills, commands, custom tools, rules, and config all wired together.

---

## Table of Contents

1. [How Everything Connects](#1-how-everything-connects)
2. [Directory Structure](#2-directory-structure)
3. [opencode.json — The Hub](#3-opencodejson--the-hub)
4. [AGENTS.md — Rules & Context](#4-agentsmd--rules--context)
5. [Agents](#5-agents)
6. [Skills](#6-skills)
7. [Commands](#7-commands)
8. [Custom Tools](#8-custom-tools)
9. [Permissions](#9-permissions)
10. [MCP Servers](#10-mcp-servers)
11. [LSP Servers](#11-lsp-servers)
12. [Prompts Directory](#12-prompts-directory)
13. [Full Working Kit Example](#13-full-working-kit-example)
14. [Config Loading Order](#14-config-loading-order)
15. [Quick Reference Cheatsheet](#15-quick-reference-cheatsheet)

---

## 1. How Everything Connects

```
opencode.json              ← master config: wires everything together
│
├── instructions: [...]    ← loads AGENTS.md + external rule files into every agent's context
├── agent: {...}           ← defines/overrides agents, assigns models, prompts, permissions
├── command: {...}         ← defines /commands that invoke specific agents with preset prompts
├── mcp: {...}             ← registers MCP servers, tools become available to all agents
├── lsp: {...}             ← language server protocol for diagnostics
├── permission: {...}      ← global tool permissions (edit / bash / webfetch / skill / task)
│
.opencode/
├── AGENTS.md              ← project rules injected into every session context
├── agents/                ← markdown agent definitions (name = filename)
│   ├── review.md          ← → creates agent "review", callable with @review or Tab
│   ├── docs-writer.md
│   └── security.md
├── skills/                ← on-demand knowledge libraries loaded by agents via skill tool
│   ├── git-release/
│   │   └── SKILL.md
│   ├── nextjs-patterns/
│   │   └── SKILL.md
│   └── deploy-netlify/
│       └── SKILL.md
├── commands/              ← /slash-commands with preset prompts + agent assignment
│   ├── review-pr.md
│   ├── fix-types.md
│   └── deploy-check.md
├── tools/                 ← custom TypeScript tools the LLM can call
│   ├── database.ts
│   └── run-script.ts
└── prompts/               ← reusable prompt files referenced by agents/commands
    ├── build.txt
    ├── review.txt
    └── security.txt
```

**Data flow at runtime:**

```
User types /review-pr
    → command "review-pr" fires
    → uses agent "review" (subagent)
    → agent loads prompt from prompts/review.txt
    → agent context includes AGENTS.md + instructions[]
    → agent can call skill tool → loads skills/git-release/SKILL.md on demand
    → agent permissions: edit=deny, bash restricted to git read commands
    → result returned to primary session
```

---

## 2. Directory Structure

```
your-project/
├── opencode.json          ← project-level config (commit to git)
├── AGENTS.md              ← project rules (commit to git)
└── .opencode/
    ├── agents/
    │   ├── review.md
    │   ├── docs-writer.md
    │   ├── security-auditor.md
    │   ├── debugger.md
    │   └── orchestrator.md
    ├── skills/
    │   ├── git-release/
    │   │   └── SKILL.md
    │   ├── nextjs-patterns/
    │   │   └── SKILL.md
    │   ├── deploy-netlify/
    │   │   └── SKILL.md
    │   └── typescript-standards/
    │       └── SKILL.md
    ├── commands/
    │   ├── review-pr.md
    │   ├── fix-types.md
    │   ├── deploy-check.md
    │   ├── gen-docs.md
    │   └── audit-security.md
    ├── tools/
    │   ├── query-db.ts
    │   └── run-script.ts
    └── prompts/
        ├── build.txt
        ├── review.txt
        ├── security.txt
        └── docs.txt
```

> **Note:** `.opencode/` uses plural subfolder names: `agents/`, `commands/`, `skills/`, `tools/`.  
> Singular names (`agent/`, `command/`) also work for backwards compatibility.

---

## 3. opencode.json — The Hub

This is the single source of truth. Place it at your **project root** (not inside `.opencode/`).

```json
{
  "$schema": "https://opencode.ai/config.json",

  // ── Provider & Models ──────────────────────────────────────────────────
  "provider": {
    "anthropic": {
      "apiKey": "env:ANTHROPIC_API_KEY"
    }
  },
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5-20251001",

  // ── Rules: files loaded into every agent's context ─────────────────────
  // Supports globs, relative paths, and remote URLs
  "instructions": [
    "AGENTS.md",
    "docs/contributing.md",
    "docs/code-standards.md",
    ".opencode/rules/*.md"
  ],

  // ── Global Permissions (per-agent can override) ────────────────────────
  "permission": {
    "edit": "ask",
    "bash": "ask",
    "webfetch": "allow",
    "skill": {
      "*": "allow",
      "internal-*": "deny"
    }
  },

  // ── Agents ─────────────────────────────────────────────────────────────
  // Can also live as .opencode/agents/*.md files (markdown wins on conflict)
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-5",
      "prompt": "{file:.opencode/prompts/build.txt}",
      "permission": {
        "edit": "ask",
        "bash": {
          "*": "ask",
          "git status": "allow",
          "git diff*": "allow",
          "npm run*": "ask"
        }
      }
    },
    "plan": {
      "mode": "primary",
      "model": "anthropic/claude-haiku-4-5-20251001",
      "temperature": 0.1,
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    }
  },

  // ── Commands ───────────────────────────────────────────────────────────
  // Can also live as .opencode/commands/*.md files
  "command": {
    "deploy-check": {
      "description": "Check deployment readiness",
      "template": "Review recent changes and check if the project is ready to deploy.\n!`git diff HEAD~1 --stat`\nList any blockers.",
      "agent": "plan"
    }
  },

  // ── MCP Servers ────────────────────────────────────────────────────────
  "mcp": {
    "github": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "env:GITHUB_TOKEN"
      }
    }
  },

  // ── LSP Servers ────────────────────────────────────────────────────────
  "lsp": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"]
    }
  },

  // ── Formatters ─────────────────────────────────────────────────────────
  "formatter": {
    "command": "prettier --write $FILE"
  },

  // ── Default Agent ──────────────────────────────────────────────────────
  "default_agent": "build"
}
```

---

## 4. AGENTS.md — Rules & Context

The `AGENTS.md` file is injected into every agent's system context automatically. Think of it as persistent instructions for the whole project.

**Locations (in order of precedence):**
- `.opencode/AGENTS.md` or `AGENTS.md` (project root) → committed to git, shared with team  
- `~/.config/opencode/AGENTS.md` → global, personal rules, not committed  
- `CLAUDE.md` → fallback if no `AGENTS.md` (Claude Code compatibility)

**Example `AGENTS.md`:**

```markdown
# LolaSahtt — Next.js 15 Jewelry Store

## Project Overview
E-commerce store built with Next.js 15, TypeScript, hosted on Netlify.
Monorepo: the Next.js app lives in `jewelry-store/` subfolder.

## Stack
- Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS
- Netlify (deploy via netlify.toml)
- GitHub: skeletorflet/LolaSahtt

## Critical Rules
- NEVER modify `netlify.toml` without reading deploy docs first
- ALWAYS use `pnpm` — not npm or yarn
- Keep path separators POSIX-style (`/`) — Windows path issues caused past failures
- `@netlify/plugin-nextjs` must be declared in `netlify.toml`

## Code Standards
- TypeScript strict mode only — no `any` unless absolutely justified with a comment
- React Server Components by default; use `"use client"` only when needed
- Import aliases: `@/` maps to `jewelry-store/src/`

## Monorepo Conventions
- All shared code lives in `packages/`
- The Next.js app is in `jewelry-store/`
- Run commands from the repo root unless specified otherwise

## External File Loading
When you encounter references like @docs/standards.md, use the Read tool to
load them on demand — do NOT preload everything upfront.
```

---

## 5. Agents

Agents are defined either in `opencode.json` (under `"agent"`) or as **markdown files** in `.opencode/agents/`.  
The **filename** becomes the **agent name**. `review.md` → agent `review`.

### Agent Markdown Frontmatter Fields

| Field | Required | Description |
|---|---|---|
| `description` | ✅ Yes | What the agent does. Used in @mention autocomplete and for primary agents to decide when to delegate. |
| `mode` | No | `primary`, `subagent`, or `all` (default: `all`) |
| `model` | No | Override model for this agent. Format: `provider/model-id` |
| `temperature` | No | 0.0–1.0. Default: 0 for most models |
| `steps` | No | Max agentic iterations before forced text response |
| `color` | No | Hex `#FF5733` or theme key: `primary`, `accent`, `warning`, etc. |
| `top_p` | No | 0.0–1.0. Alternative to temperature |
| `hidden` | No | `true` hides from @mention menu (subagents only) |
| `permission` | No | Per-agent tool permissions |
| `disable` | No | `true` to disable the agent |

### Built-in Agents

| Agent | Mode | Description |
|---|---|---|
| `build` | primary | Default. Full tool access. Development work. |
| `plan` | primary | Read-only analysis. `edit=ask`, `bash=ask`. |
| `general` | subagent | Multi-step research tasks. Full tools (no todo). |
| `explore` | subagent | Read-only codebase explorer. Fast, no modifications. |
| `compaction` | hidden | Auto-compacts long contexts. Not user-selectable. |
| `title` | hidden | Auto-generates session titles. |
| `summary` | hidden | Auto-creates session summaries. |

### Agent Examples

**`.opencode/agents/review.md`** — Code Reviewer (subagent)
```markdown
---
description: Reviews code for quality, security, and best practices. Invoked automatically before merging.
mode: subagent
model: anthropic/claude-sonnet-4-5
temperature: 0.1
color: "#f59e0b"
permission:
  edit: deny
  bash:
    "*": deny
    "git diff*": allow
    "git log*": allow
    "grep *": allow
  webfetch: deny
---

You are a senior code reviewer. Analyze changes for:

- Code quality and idiomatic patterns
- Potential bugs and edge cases
- Security vulnerabilities (XSS, injection, auth flaws)
- Performance bottlenecks
- TypeScript type safety

Provide numbered, actionable feedback. Do NOT make changes — only suggest them.
```

**`.opencode/agents/docs-writer.md`** — Documentation Writer (subagent)
```markdown
---
description: Writes and maintains technical documentation, README files, JSDoc, and changelogs.
mode: subagent
model: anthropic/claude-sonnet-4-5
temperature: 0.3
color: accent
permission:
  edit: ask
  bash: deny
---

You are a technical writer. Create clear, developer-friendly documentation.

Focus on:
- Accurate code examples that actually work
- Clear explanations of *why*, not just *what*
- Proper markdown structure with headers and tables
- JSDoc for all exported functions and types
```

**`.opencode/agents/security-auditor.md`** — Security Auditor (subagent)
```markdown
---
description: Performs deep security audits. Identifies vulnerabilities without modifying code.
mode: subagent
model: anthropic/claude-sonnet-4-5
temperature: 0
color: error
permission:
  edit: deny
  bash:
    "*": deny
    "grep *": allow
    "find *": allow
  webfetch: allow
---

You are a security expert. Audit code for:

- Input validation and sanitization issues
- Authentication and authorization flaws
- Sensitive data exposure (API keys in code, logging PII)
- Dependency vulnerabilities (flag outdated packages)
- OWASP Top 10 issues
- Next.js specific: Server Actions exposure, middleware auth bypass

Output a structured report with severity levels: CRITICAL / HIGH / MEDIUM / LOW.
```

**`.opencode/agents/debugger.md`** — Debugger (subagent)
```markdown
---
description: Specialized debugging agent. Investigates errors, traces root causes, proposes fixes.
mode: subagent
model: anthropic/claude-sonnet-4-5
temperature: 0.1
color: warning
steps: 15
permission:
  edit: ask
  bash:
    "*": ask
    "cat *": allow
    "grep *": allow
    "find *": allow
    "npm test*": ask
    "pnpm test*": ask
---

You are an expert debugger. When given an error:

1. Read the full error message and stack trace carefully
2. Identify the root cause — not just the symptom
3. Trace back through call chains if needed
4. Propose the minimal fix required
5. Check for related issues that might surface after the fix

Always explain your reasoning.
```

**`.opencode/agents/orchestrator.md`** — Orchestrator (primary)
```markdown
---
description: High-level orchestrator. Breaks complex tasks into subtasks and delegates to specialized subagents.
mode: primary
model: anthropic/claude-sonnet-4-5
temperature: 0.2
color: primary
permission:
  task:
    "*": allow
  edit: ask
  bash:
    "*": ask
---

You are a project orchestrator. For complex requests:

1. Break the task into clearly defined subtasks
2. Delegate each subtask to the appropriate subagent using @mentions
3. Synthesize results into a coherent final answer
4. Never do specialized work yourself when a subagent can do it better

Available subagents: @review, @docs-writer, @security-auditor, @debugger, @general, @explore
```

---

## 6. Skills

Skills are **on-demand knowledge libraries** — not always loaded, but available for agents to pull in when needed via the built-in `skill` tool.

**Key facts:**
- Live in `.opencode/skills/<name>/SKILL.md` (name must match the directory name)
- Filename must be `SKILL.md` (all caps)
- Require YAML frontmatter with `name` and `description`
- `name` must be lowercase alphanumeric with single hyphens: `^[a-z0-9]+(-[a-z0-9]+)*$`
- Agents see skill names + descriptions in their context, load content on demand

### Skill Frontmatter Fields

| Field | Required | Type | Notes |
|---|---|---|---|
| `name` | ✅ | string | 1–64 chars. Must match directory name. |
| `description` | ✅ | string | 1–1024 chars. Be specific — agents use this to decide when to load. |
| `license` | No | string | e.g. `MIT` |
| `compatibility` | No | string | e.g. `opencode` |
| `metadata` | No | map | Free-form string-to-string pairs |

### Skill Examples

**`.opencode/skills/git-release/SKILL.md`**
```markdown
---
name: git-release
description: Create consistent versioned releases, draft changelogs from merged PRs, and generate gh release commands
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## What I Do

- Analyze merged PRs since the last tag to draft release notes
- Propose a semantic version bump (major/minor/patch) based on change types
- Generate a ready-to-run `gh release create` command
- Ensure CHANGELOG.md follows Keep a Changelog format

## When to Use Me

Use when preparing a tagged release. Call me with:
> "Prepare a release using the git-release skill"

## Workflow

1. Run `git log --oneline <last-tag>..HEAD` to list commits
2. Categorize: feat → minor bump, fix → patch bump, breaking → major bump
3. Draft `CHANGELOG.md` entry
4. Propose: `gh release create v<version> --title "v<version>" --notes "<notes>"`

Ask for clarification if the versioning scheme is unclear.
```

**`.opencode/skills/nextjs-patterns/SKILL.md`**
```markdown
---
name: nextjs-patterns
description: Next.js 15 App Router patterns, Server Components, Server Actions, and caching strategies
compatibility: opencode
---

## Key Patterns

### Server vs Client Components
- Default to Server Components — use `"use client"` only for interactivity/hooks
- Never import a Client Component into a Server Component that uses `async/await`

### Server Actions
- Define in files with `"use server"` directive at top
- Always validate and sanitize inputs server-side
- Use `revalidatePath()` or `revalidateTag()` to invalidate cache after mutations

### Data Fetching
- Fetch in Server Components directly — no useEffect needed
- Use `cache()` wrapper from React for request deduplication
- Pass `{ cache: 'no-store' }` for dynamic data

### Route Handlers
- Place in `app/api/<route>/route.ts`
- Export named functions: `GET`, `POST`, `PUT`, `DELETE`

### Monorepo (this project)
- App root: `jewelry-store/`
- Import alias: `@/` → `jewelry-store/src/`
- Run dev: `pnpm --filter jewelry-store dev`
```

**`.opencode/skills/deploy-netlify/SKILL.md`**
```markdown
---
name: deploy-netlify
description: Netlify deployment for Next.js monorepos — netlify.toml config, build settings, environment variables, and common failure fixes
compatibility: opencode
metadata:
  project: lolasahtt
---

## Critical Requirements

- `@netlify/plugin-nextjs` MUST be declared in `netlify.toml`
- Base directory must be set to `jewelry-store` (monorepo subfolder)
- Build command: `pnpm --filter jewelry-store build`
- Publish directory: `jewelry-store/.next`

## netlify.toml Template

```toml
[build]
  base = "jewelry-store"
  command = "pnpm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
  PNPM_VERSION = "9"
```

## Common Failures

| Error | Fix |
|---|---|
| `Cannot find module '@netlify/plugin-nextjs'` | Add `[[plugins]]` block above |
| Windows path backslash error | Ensure all paths use `/` not `\` |
| `Build base directory not found` | Verify `base = "jewelry-store"` matches exact folder name |

## Environment Variables
Set in Netlify UI → Site Settings → Environment Variables. Never commit to repo.
```

**`.opencode/skills/typescript-standards/SKILL.md`**
```markdown
---
name: typescript-standards
description: TypeScript strict mode conventions, naming rules, and error handling patterns for this project
---

## Config
- `strict: true` in tsconfig
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

## Rules
- No `any` — use `unknown` and narrow with type guards
- Prefer `interface` for object shapes, `type` for unions/intersections
- Export types separately from implementation
- Use `satisfies` operator for config objects to get type inference

## Error Handling
```typescript
// Always wrap async operations
const result = await tryCatch(fetchData())
if (result.error) { /* handle */ }
```

## Naming
- Components: PascalCase
- Hooks: `use` prefix, camelCase
- Files: kebab-case
- Constants: UPPER_SNAKE_CASE
```

---

## 7. Commands

Custom `/slash-commands` for repetitive workflows. Live in `.opencode/commands/*.md`.  
Filename = command name. `review-pr.md` → `/review-pr`.

### Command Frontmatter Fields

| Field | Required | Description |
|---|---|---|
| `description` | No | Shown in TUI autocomplete |
| `agent` | No | Which agent handles this command |
| `model` | No | Override model for this command |
| `subtask` | No | `true` forces subagent invocation (keeps primary context clean) |

### Prompt Placeholders

| Placeholder | Description |
|---|---|
| `$ARGUMENTS` | All arguments passed after the command |
| `$1`, `$2`, `$3`... | Individual positional arguments |
| `` !`shell command` `` | Inject shell command output into prompt |
| `@path/to/file` | Include file content in prompt |

### Command Examples

**`.opencode/commands/review-pr.md`**
```markdown
---
description: Review current branch changes before opening a PR
agent: review
subtask: true
---

Review the following changes for a pull request:

!`git diff main...HEAD`

Recent commits:
!`git log main..HEAD --oneline`

Check for:
- Logic errors and edge cases
- Security issues
- Code quality and TypeScript strictness
- Missing tests

Output a structured review with MUST FIX / SHOULD FIX / SUGGESTION sections.
```

**`.opencode/commands/fix-types.md`**
```markdown
---
description: Find and fix TypeScript type errors in the project
agent: build
---

Run the TypeScript compiler and fix all type errors:

!`pnpm tsc --noEmit 2>&1 | head -50`

Fix every error above. Prefer proper types over `any` casts.
After fixing, verify with another tsc run.
```

**`.opencode/commands/gen-docs.md`**
```markdown
---
description: Generate or update documentation for a file or component
agent: docs-writer
subtask: true
model: anthropic/claude-sonnet-4-5
---

Generate comprehensive documentation for: $ARGUMENTS

Include:
- Overview of what it does
- Props/parameters with types
- Usage examples
- Any edge cases or gotchas

Update the file in-place with JSDoc comments, and create/update the corresponding section in docs/.
```

**`.opencode/commands/audit-security.md`**
```markdown
---
description: Run a security audit on the entire project or a specific path
agent: security-auditor
subtask: true
---

Perform a full security audit on: $ARGUMENTS

!`find ${1:-.} -name "*.ts" -o -name "*.tsx" | head -30`

Focus on:
- Server Actions exposure
- API route authentication
- Environment variable handling
- Input sanitization
- Dependency issues: !`pnpm audit --audit-level moderate 2>&1 | head -20`
```

**`.opencode/commands/deploy-check.md`**
```markdown
---
description: Verify project is ready to deploy to Netlify
agent: plan
---

Check if the project is ready to deploy. Use the deploy-netlify skill.

Current status:
!`git status --short`
!`git log --oneline -5`

Verify:
1. netlify.toml has correct config for monorepo
2. @netlify/plugin-nextjs is declared
3. No uncommitted breaking changes
4. Build would succeed: !`pnpm --filter jewelry-store build --dry-run 2>&1 | tail -10`

List any blockers clearly.
```

---

## 8. Custom Tools

TypeScript/JS files the **LLM can call directly** during a session. Live in `.opencode/tools/`.  
Filename = tool name. Requires `@opencode-ai/plugin` package.

```bash
# Install once at project root
pnpm add -D @opencode-ai/plugin
```

### `.opencode/tools/run-script.ts`
```typescript
import { tool } from "@opencode-ai/plugin"
import path from "path"

export default tool({
  description: "Run a package.json script in the jewelry-store subfolder and return output",
  args: {
    script: tool.schema.string().describe("npm script name, e.g. 'build', 'test', 'lint'"),
  },
  async execute(args, context) {
    const result = await Bun.$`pnpm --filter jewelry-store run ${args.script}`
      .cwd(context.worktree)
      .text()
    return result
  },
})
```

### `.opencode/tools/read-env.ts`
```typescript
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "List environment variable names (NOT values) present in .env files",
  args: {},
  async execute(args, context) {
    const result = await Bun.$`grep -h '^[A-Z]' ${context.worktree}/.env* 2>/dev/null | cut -d= -f1 | sort -u`.text()
    return `Environment variables defined (names only):\n${result}`
  },
})
```

### `.opencode/tools/search-code.ts` (multiple exports)
```typescript
import { tool } from "@opencode-ai/plugin"

// Creates tools: search-code_symbol and search-code_pattern
export const symbol = tool({
  description: "Search for a TypeScript symbol (function, type, component) across the codebase",
  args: {
    name: tool.schema.string().describe("Symbol name to search for"),
  },
  async execute(args, context) {
    const result = await Bun.$`grep -rn "\\b${args.name}\\b" ${context.worktree}/jewelry-store/src --include="*.ts" --include="*.tsx" -l`.text()
    return result || "Symbol not found"
  },
})

export const pattern = tool({
  description: "Search for a regex pattern in source files",
  args: {
    regex: tool.schema.string().describe("Regular expression to search"),
    dir: tool.schema.string().optional().describe("Directory to search in (default: src)"),
  },
  async execute(args, context) {
    const dir = args.dir ?? `${context.worktree}/jewelry-store/src`
    const result = await Bun.$`grep -rn "${args.regex}" ${dir} --include="*.ts" --include="*.tsx"`.text()
    return result || "No matches found"
  },
})
```

---

## 9. Permissions

Permissions control what agents can do. Three levels: **global** → **per-agent** (JSON) → **per-agent** (markdown frontmatter).

| Value | Behavior |
|---|---|
| `"allow"` | Execute without asking |
| `"ask"` | Prompt user before executing |
| `"deny"` | Block completely |

Tools that support permissions: `edit`, `bash`, `webfetch`, `skill`, `task`.

`bash` supports **glob-pattern granularity**:
```json
"bash": {
  "*": "ask",
  "git status": "allow",
  "git diff*": "allow",
  "git push*": "ask",
  "rm *": "deny"
}
```

> **Rule:** last matching pattern wins — put `*` first, specifics after.

---

## 10. MCP Servers

MCP (Model Context Protocol) servers extend agents with external tools.  
Configure in `opencode.json` under `"mcp"`.

```json
{
  "mcp": {
    "github": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "env:GITHUB_TOKEN"
      }
    },
    "filesystem": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"]
    },
    "postgres": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "env:DATABASE_URL"
      }
    }
  }
}
```

MCP tools follow the same permission model as built-in tools.  
Disable all MCP tools for a specific agent:
```json
"agent": {
  "plan": {
    "tools": { "mymcp_*": false }
  }
}
```

---

## 11. LSP Servers

Language Server Protocol for live diagnostics (errors, warnings) that agents can read via the `diagnostics` tool.

```json
{
  "lsp": {
    "typescript": {
      "disabled": false,
      "command": "typescript-language-server",
      "args": ["--stdio"]
    },
    "css": {
      "command": "vscode-css-language-server",
      "args": ["--stdio"]
    }
  }
}
```

Install language servers:
```bash
pnpm add -g typescript-language-server typescript
pnpm add -g vscode-langservers-extracted
```

---

## 12. Prompts Directory

Keep agent prompts in separate `.txt` files for easy editing without touching `opencode.json`.  
Reference them in agent config with `{file:./path}`.

**`.opencode/prompts/build.txt`**
```
You are a senior full-stack engineer working on a Next.js 15 jewelry e-commerce store.

Stack: Next.js 15 App Router, TypeScript strict, Tailwind CSS, Netlify deployment.
Monorepo: Next.js app lives in `jewelry-store/` subfolder.

When making changes:
- Always prefer Server Components unless client interactivity is needed
- Run `pnpm tsc --noEmit` to verify types before declaring done
- Keep Tailwind classes sorted (use prettier-plugin-tailwindcss convention)
- Never commit API keys or secrets
- Prefer atomic commits with conventional commit messages (feat:, fix:, chore:)

When uncertain about deployment behavior, use the deploy-netlify skill.
```

**`.opencode/prompts/review.txt`**
```
You are a code reviewer focused on correctness, security, and maintainability.

Review philosophy:
- Every comment must be actionable
- Distinguish between blockers (must fix) and suggestions (nice to have)
- Assume the author is skilled — explain the WHY, not just the WHAT
- Security issues are always blockers

Output format:
## MUST FIX
- [file:line] Issue description

## SHOULD FIX
- [file:line] Issue description

## SUGGESTIONS
- [file:line] Suggestion
```

---

## 13. Full Working Kit Example

Here's a complete, minimal but production-ready `.opencode/` kit that you can copy directly.

### File tree
```
opencode.json
AGENTS.md
.opencode/
├── agents/
│   ├── review.md
│   ├── docs-writer.md
│   └── security-auditor.md
├── skills/
│   ├── git-release/SKILL.md
│   ├── nextjs-patterns/SKILL.md
│   └── deploy-netlify/SKILL.md
├── commands/
│   ├── review-pr.md
│   ├── fix-types.md
│   ├── gen-docs.md
│   ├── deploy-check.md
│   └── audit-security.md
├── tools/
│   └── run-script.ts
└── prompts/
    ├── build.txt
    └── review.txt
```

### How agents, skills, and commands relate

```
/review-pr command
    └── uses agent: review
            ├── prompt: .opencode/prompts/review.txt
            ├── permissions: edit=deny, bash=git-read-only
            └── can load skills:
                    ├── git-release (if release-related)
                    └── nextjs-patterns (if Next.js code)

/deploy-check command
    └── uses agent: plan (read-only)
            └── can load skills:
                    └── deploy-netlify

/audit-security command
    └── uses agent: security-auditor (subagent)
            ├── permissions: edit=deny, bash=search-only
            └── can load skills:
                    └── nextjs-patterns (framework-specific vulns)

build agent (default, Tab to switch)
    ├── prompt: .opencode/prompts/build.txt
    ├── can invoke subagents: @review, @docs-writer, @security-auditor
    ├── custom tools: run-script
    └── can load all skills
```

---

## 14. Config Loading Order

Understanding precedence prevents surprises:

```
1. Remote config (.well-known/opencode)       ← org-wide defaults
2. Global config (~/.config/opencode/opencode.json)  ← personal prefs
3. OPENCODE_CONFIG env var                     ← custom overrides
4. Project config (opencode.json at root)      ← project-specific (WINS)
```

For rules/instructions:
```
1. Walk up from CWD → first AGENTS.md or CLAUDE.md found
2. ~/.config/opencode/AGENTS.md (global personal rules)
3. ~/.claude/CLAUDE.md (Claude Code compat, unless disabled)
   All are combined — not exclusive.
```

For agents (markdown vs JSON):
- **Markdown files** in `.opencode/agents/` are loaded and merged with JSON `"agent"` entries
- If the same agent name appears in both, **markdown wins**

---

## 15. Quick Reference Cheatsheet

### Key directories

| Path | Purpose |
|---|---|
| `opencode.json` | Master config — models, agents, commands, MCP, LSP |
| `AGENTS.md` | Project rules — always in context |
| `.opencode/agents/*.md` | Custom agents (filename = agent name) |
| `.opencode/skills/<n>/SKILL.md` | On-demand skill libraries |
| `.opencode/commands/*.md` | `/slash-commands` |
| `.opencode/tools/*.ts` | Custom callable tools |
| `.opencode/prompts/*.txt` | Reusable prompt files |

### TUI shortcuts

| Key | Action |
|---|---|
| `Tab` | Cycle through primary agents |
| `@name` | Invoke a subagent directly |
| `/command` | Run a custom or built-in command |
| `@filename` | Fuzzy file search to include in prompt |
| `/undo` | Revert last change |
| `/redo` | Redo undone change |
| `/init` | Generate/update `AGENTS.md` for project |
| `/share` | Share current session |

### Built-in commands

| Command | Description |
|---|---|
| `/init` | Scan project and generate `AGENTS.md` |
| `/undo` | Revert last file change |
| `/redo` | Redo last undone change |
| `/share` | Share session link |
| `/help` | Show available commands |

### CLI flags

```bash
opencode                          # Start TUI
opencode run "fix the build"      # Run headless with a message
opencode -m anthropic/claude-sonnet-4-5  # Override model
opencode --continue               # Continue last session
opencode agent create             # Interactive agent creator
opencode models                   # List available models
```

### Skill name validation regex
```
^[a-z0-9]+(-[a-z0-9]+)*$
```

### Agent `prompt` file reference syntax
```json
"prompt": "{file:.opencode/prompts/build.txt}"
```
Path is relative to the config file location.

---

> **Tip:** Run `opencode agent create` to interactively scaffold new agents.  
> **Tip:** Commit `opencode.json`, `AGENTS.md`, and `.opencode/` to Git — your whole team benefits.  
> **Tip:** Global skills in `~/.config/opencode/skills/` work across all projects.
