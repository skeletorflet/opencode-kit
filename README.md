# OpenCode Kit

> **A production-grade multi-agent AI coding studio for [OpenCode](https://opencode.ai)**

Transform your terminal into a powerful AI engineering environment with 34 specialist agents, 71 domain skills, automated workflows, custom commands, plugins, and full multi-agent orchestration via [oh-my-opencode](https://github.com/code-yeongyu/oh-my-openagent).

---

## What's Inside

| Component | Count | Description |
|---|---|---|
| **Specialist Agents** | 34 | Domain-expert AI assistants with scoped permissions |
| **Domain Skills** | 71 | Reusable instruction sets loaded on demand |
| **omo Personas** | 6 | Multi-agent orchestration system (Sisyphus, Prometheus, Atlas…) |
| **Slash Commands** | 9 | One-liner task automation |
| **Custom Tools** | 2 | TypeScript tools callable by agents |
| **Plugins** | 3 | Notifications, env injection, env protection |
| **Workflows** | 4 | Automated multi-step sequences |
| **Validation Scripts** | 7 | Python audit tools |
| **MCPs** | 4 | Context7, Shadcn, Netlify, Daytona |

---

## Quick Start

### 1. Install OpenCode

```bash
curl -fsSL https://opencode.ai/install | bash
```

### 2. Clone this kit

```bash
git clone https://github.com/skeletorflet/opencode-kit
cd opencode-kit
```

### 3. Configure your API keys

```bash
cp .env.example .env
# Edit .env and add your Anthropic/OpenAI API key
```

### 4. Launch

```bash
opencode
```

Everything in `.opencode/` is auto-loaded. No manual setup required.

---

## Multi-Agent System — oh-my-opencode (omo)

This kit integrates [oh-my-opencode](https://github.com/code-yeongyu/oh-my-openagent), a community plugin that transforms OpenCode into a full multi-agent orchestration system.

### The Personas

| Agent | Role | Use When |
|---|---|---|
| **Sisyphus** | Orchestrator — plans, delegates, executes in parallel | Starting any complex task |
| **Prometheus** | Strategic planner — interviews you, defines scope, writes the plan | Before writing any code |
| **Atlas** | Plan executor — reads Prometheus plans and runs them task by task | After a plan is approved |
| **Oracle** | Architecture consultant (read-only) — never writes code, only advises | Architecture decisions |
| **Librarian** | Documentation researcher — fast lookup via lightweight model | Docs and library research |
| **Explore** | Codebase explorer (read-only) — maps structure fast | Understanding an unfamiliar repo |
| **Hephaestus** | Deep autonomous worker — explores and executes end-to-end | Long autonomous tasks |

### Core Rule

> **Never use Atlas without a Prometheus plan.** Prometheus plans. Atlas executes.

### omo Workflow

```
# 1. Start OpenCode with Sisyphus as orchestrator
opencode

# 2. Activate max performance mode
ultrawork   (or: ulw)

# 3. Let Prometheus plan the feature
@prometheus "build a JWT auth system with refresh tokens"
# Prometheus interviews you, then saves the plan to .sisyphus/plans/

# 4. Atlas executes the plan
/start-work

# 5. Consult Oracle on architecture (no code touched)
@oracle "should I use event sourcing here?"

# 6. Loop until done
/ralph-loop    # iterates until all TODOs are complete
/ulw-loop      # ultrawork + ralph together
```

### omo Command Reference

| Command | Description |
|---|---|
| `ultrawork` / `ulw` | Maximum parallel orchestration mode |
| `ultrathink` | Extended thinking (32k token budget) |
| `search` / `find` | Runs Explore + Librarian in parallel |
| `analyze` / `investigate` | Deep multi-agent analysis |
| `/start-work` | Atlas picks up the plan and executes |
| `/ralph-loop` | Iterates until all TODOs are done |
| `/ulw-loop` | Ultrawork + Ralph combined |
| `/init-deep` | Generates hierarchical AGENTS.md in subdirectories |
| `npx oh-my-opencode doctor` | Diagnostics |

### omo Features Enabled

| Feature | Config | Description |
|---|---|---|
| **Hashline Edit** | `hashline_edit: true` | Hash-verified edits — zero stale-line corruption |
| **Ralph Loop** | `ralph_loop.enabled: true` | Agents don't stop until every TODO is complete |
| **Compaction guard** | `preemptive-compaction` disabled | Stable context window management |

---

## Specialist Agents (34)

Invoked with `@agent-name` in the TUI. All use OpenCode's native `mode` + `permission` frontmatter.

### Core

| Agent | Description |
|---|---|
| `orchestrator` | Multi-agent coordination, task breakdown, delegation |
| `project-planner` | 4-phase planning methodology, task-slug files |
| `explorer-agent` | Codebase discovery, architecture analysis |
| `debugger` | Systematic root-cause analysis, error tracing |
| `review` | Code review, PR audits, quality checks |
| `code-archaeologist` | Legacy code analysis and modernization paths |

### Frontend & Design

| Agent | Domain |
|---|---|
| `frontend-specialist` | React, Next.js, TypeScript, Tailwind, Core Web Vitals |
| `accessibility-specialist` | WCAG 2.2, ARIA, screen readers, inclusive design |
| `seo-specialist` | SEO audits, E-E-A-T, GEO, structured data |

### Backend & Data

| Agent | Domain |
|---|---|
| `backend-specialist` | Node.js, Python, serverless, edge systems |
| `database-architect` | Schema design, migrations, indexing, Prisma |
| `data-engineer` | ETL pipelines, data warehouses, Kafka, dbt |
| `graphql-developer` | GraphQL APIs, Apollo, federation |
| `ml-engineer` | ML pipelines, model serving, RAG, fine-tuning |
| `cloud-architect` | AWS, Azure, GCP, serverless, containers |
| `devops-engineer` | CI/CD, Docker, monitoring, infrastructure |

### Language Specialists

| Agent | Language / Focus |
|---|---|
| `go-developer` | Go 1.22+, APIs, microservices, CLI tools |
| `java-developer` | Java 21+, Spring Boot, Quarkus, Micronaut |
| `dotnet-developer` | .NET 8, ASP.NET Core, Blazor, Minimal APIs |
| `kotlin-developer` | Kotlin 2.0, Ktor, Jetpack Compose |
| `ruby-developer` | Ruby 3.3+, Rails 7, Hanami |
| `php-developer` | PHP 8.3, Laravel 11, Symfony 7 |
| `cpp-developer` | C++23/26, systems programming, game engines |

### Mobile & Games

| Agent | Domain |
|---|---|
| `mobile-developer` | React Native, Flutter, Expo |
| `mobile-native` | Swift/SwiftUI (iOS), Kotlin/Compose (Android) |
| `game-developer` | Unity, Godot, Unreal, Phaser, Three.js |

### Quality & Security

| Agent | Domain |
|---|---|
| `security-auditor` | OWASP 2025, supply chain, zero trust |
| `penetration-tester` | Red team, vulnerability exploitation |
| `test-engineer` | TDD, unit/E2E testing, coverage targets |
| `qa-automation-engineer` | Playwright, Cypress, CI pipelines |
| `performance-optimizer` | Profiling, Core Web Vitals, bundle analysis |

### Product & Docs

| Agent | Domain |
|---|---|
| `product-manager` | Requirements, user stories, acceptance criteria |
| `product-owner` | Roadmap, backlog, MVP, stakeholder management |
| `documentation-writer` | README, API docs, tutorials, changelogs |

---

## Domain Skills (71)

Skills are `SKILL.md` instruction sets loaded on demand by agents. Organized by category.

### Development Patterns

`clean-code` · `naming-conventions` · `code-review-checklist` · `systematic-debugging` · `tdd-workflow` · `testing-patterns` · `plan-writing` · `behavioral-modes` · `brainstorming` · `lint-and-validate`

### Frontend & Design

`frontend-design` · `react-best-practices` · `nextjs-react-expert` · `tailwind-patterns` · `web-design-guidelines` · `ui-ux-pro-max`

### Backend & Frameworks

`nodejs-best-practices` · `python-patterns` · `go-patterns` · `go-concurrency` · `java-expert` · `spring-boot` · `dotnet-expert` · `aspnet-core` · `kotlin-expert` · `ruby-patterns` · `rails-patterns` · `php-patterns` · `laravel-patterns` · `django-patterns` · `nestjs-expert`

### Database

`database-design` · `prisma-expert`

### DevOps & Infrastructure

`docker-expert` · `deployment-procedures` · `server-management` · `bash-linux` · `powershell-windows`

### Security & Testing

`vulnerability-scanner` · `red-team-tactics` · `webapp-testing` · `performance-profiling` · `seo-fundamentals` · `geo-fundamentals`

### Mobile & Games

`mobile-design` · `android-compose` · `swift-expert` · `game-development` · `2d-games` · `3d-games` · `pc-games` · `mobile-games` · `web-games` · `multiplayer` · `game-design` · `game-art` · `game-audio` · `vr-ar`

### Architecture & Advanced

`architecture` · `api-patterns` · `mcp-builder` · `parallel-agents` · `intelligent-routing` · `app-builder` · `i18n-localization` · `documentation-templates` · `systems-programming` · `rust-pro` · `cpp-modern` · `realtime-collaborative` · `ai-agent-integration`

---

## Slash Commands (9)

Run inside the TUI with `/command-name [args]`.

| Command | Agent | Description |
|---|---|---|
| `/plan` | `project-planner` | Break down a feature into a structured task plan |
| `/create` | `orchestrator` | Scaffold a new application or module |
| `/enhance` | `frontend-specialist` | Improve code quality, performance, or design |
| `/test` | `test-engineer` | Generate tests for a file or feature |
| `/audit-security` | `security-auditor` | Full project security audit |
| `/deploy-check` | `project-planner` | Verify the project is ready to deploy |
| `/fix-types` | `debugger` | Find and fix TypeScript type errors |
| `/gen-docs` | `documentation-writer` | Generate documentation for a file |
| `/review-pr` | `review` | Review branch changes before opening a PR |

---

## Plugins (3)

Auto-loaded from `.opencode/plugins/` at startup. Written in TypeScript, running on Bun.

| Plugin | Description |
|---|---|
| `notification.ts` | Windows toast notification when session goes idle (native PowerShell, TUI-safe) |
| `inject-env.ts` | Injects `PROJECT_ROOT` and `OPENCODE_KIT_ACTIVE` into every shell execution |
| `env-protection.ts` | Blocks agents from reading `.env` files directly |

---

## Custom Tools (2)

TypeScript tools callable by agents via the OpenCode tool API.

| Tool | Description |
|---|---|
| `read-env` | Lists environment variable names from `.env` files — values are never exposed |
| `run-script` | Runs a `package.json` script and returns output with proper error handling |

---

## Workflows (4)

Automated multi-step sequences. Run from the TUI or referenced by agents.

| Workflow | Description |
|---|---|
| `01-project-kickoff` | From idea → planned → scaffolded → first commit |
| `02-tdd-feature` | Red → Green → Refactor TDD development loop |
| `03-pre-flight-audit` | Security · lint · build · test · commit before any deploy |
| `04-omo-main-flow` | Full omo orchestration: Sisyphus → Prometheus → Atlas → Oracle |

---

## MCPs (4)

Model Context Protocol servers configured in `opencode.json`.

| MCP | Description |
|---|---|
| **Context7** | Live documentation for any library, injected directly into context |
| **Shadcn** | Shadcn/ui component registry and management |
| **Netlify** | Deploy and manage Netlify projects from the TUI |
| **Daytona** | Isolated sandbox environments (requires `DAYTONA_API_KEY`) |

---

## Validation Scripts (7)

Python scripts for quality assurance. Run via `python .opencode/scripts/<script>.py`.

| Script | When to Use |
|---|---|
| `verify_all.py` | Comprehensive full-stack verification suite |
| `checklist.py` | Priority-based project audit (Security → Lint → Schema → Test → UX → SEO) |
| `lint_runner.py` | Code linting automation |
| `test_runner_multi.py` | Multi-framework test execution |
| `security_scan.py` | OWASP vulnerability scanning |
| `ux_audit.py` | UI/UX quality audit |
| `auto_preview.py` | Preview management |

---

## Environment Variables

Copy `.env.example` to `.env` and fill your keys. The `inject-env.ts` plugin makes them available to all agent shell executions automatically.

```bash
cp .env.example .env
```

Key variables:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `CONTEXT7_API_KEY` | Context7 MCP (Upstash) |
| `DAYTONA_API_KEY` | Daytona sandbox MCP |
| `DAYTONA_SERVER_URL` | Daytona server endpoint |

---

## Project Structure

```
opencode-kit/
├── .env.example                  ← Environment variable template
├── opencode.json                 ← Main OpenCode config (MCPs, agents, permissions)
├── AGENTS.md                     ← Global agent routing rules
├── DOC/                          ← OpenCode reference documentation (41 files)
└── .opencode/
    ├── agents/                   ← 34 specialist agents (.md)
    ├── skills/                   ← 71 domain skills (SKILL.md)
    ├── commands/                 ← 9 slash commands (.md)
    ├── tools/                    ← 2 custom tools (.ts)
    ├── plugins/                  ← 3 plugins (.ts)
    ├── workflows/                ← 4 automated workflows (.md)
    ├── scripts/                  ← 7 Python validation scripts
    ├── prompts/                  ← System prompt templates
    ├── rules/RULES.md            ← Global behavior rules (P0 priority)
    ├── oh-my-opencode.jsonc      ← omo multi-agent config
    ├── ARCHITECTURE.md           ← Technical architecture overview
    └── package.json              ← Plugin dependencies (Bun)
```

---

## Agent Routing Rules

The kit enforces automatic agent selection via `RULES.md`. When you write a request, the AI:

1. **Classifies** the request type (question / code / design / security…)
2. **Selects** the best specialist agent(s) automatically
3. **Announces** `🤖 Applying knowledge of @[agent-name]...`
4. **Loads** required skills from the agent's frontmatter
5. **Applies** the agent's specific rules and coding standards

**Priority:** `RULES.md (P0)` > `Agent .md (P1)` > `SKILL.md (P2)`

---

## Resources

| Resource | Link |
|---|---|
| **OpenCode** | [opencode.ai](https://opencode.ai) |
| **OpenCode GitHub** | [github.com/anomalyco/opencode](https://github.com/anomalyco/opencode) |
| **oh-my-openagent** | [github.com/code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) |
| **OpenCode Discord** | [opencode.ai/discord](https://opencode.ai/discord) |
| **Context7** | [context7.com](https://context7.com) |

---

Read [ARCHITECTURE.md](.opencode/ARCHITECTURE.md) for the full technical overview.
