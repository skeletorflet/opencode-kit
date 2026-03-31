# Antigravity Kit — OpenCode Agent Toolkit

> **34 specialist agents · 69 domain skills · 5 commands · 2 custom tools · 7 validation scripts**

A production-grade AI agent capability expansion toolkit for [OpenCode](https://github.com/anomalyco/opencode). Transform your terminal into a multi-agent AI coding studio with domain-specialized assistants, reusable skills, custom tools, and automated workflows.

---

## At a Glance

| Component | Count | Status |
|-----------|-------|--------|
| **Specialist Agents** | 34 | OpenCode-compatible frontmatter |
| **Domain Skills** | 69 | Clean SKILL.md format |
| **Custom Commands** | 5 | All agent references verified |
| **Custom Tools** | 2 | TypeScript with error handling |
| **Validation Scripts** | 7 | Python, cross-platform |
| **Supported Languages** | 12+ | Go, Java, .NET, Kotlin, PHP, Ruby, C++, Swift, Python, Rust, TS/JS |

---

## Quick Start

### Prerequisites

1. **[OpenCode CLI](https://github.com/anomalyco/opencode)** installed
2. **At least one LLM provider** configured (OpenAI, Anthropic, Ollama, etc.)

### 1. Install OpenCode

```bash
curl -fsSL https://opencode.ai/install | bash
```

### 2. Connect a Provider

```bash
opencode
# Then run /connect inside the TUI
```

### 3. Start Coding

```bash
# Interactive mode
opencode

# Quick one-shot
opencode run "Explain how closures work in Go"

# With file context
opencode run -f src/main.go "Review this code for issues"

# Continue previous session
opencode --continue
```

---

## Specialist Agents (34)

Agents are AI assistants with specialized knowledge, tool access, and behavior. Each uses OpenCode's native `mode:` + `permission:` frontmatter.

### Core Agents

| Agent | Mode | Domain |
|-------|------|--------|
| `orchestrator` | primary | Multi-agent coordination and task orchestration |
| `project-planner` | primary | Task breakdown, planning, dependency graphs |
| `explorer-agent` | primary | Codebase discovery and architectural analysis |
| `debugger` | primary | Systematic debugging and root cause analysis |
| `review` | primary | Code review, PR audits, quality checks |

### Frontend and Design

| Agent | Domain |
|-------|--------|
| `frontend-specialist` | React, Next.js, TypeScript, Tailwind, performance |
| `accessibility-specialist` | WCAG, ARIA, screen readers, inclusive design |
| `seo-specialist` | SEO audits, Core Web Vitals, E-E-A-T, GEO |

### Backend and Data

| Agent | Domain |
|-------|--------|
| `backend-specialist` | Node.js, Python, serverless, edge systems |
| `database-architect` | Schema design, migrations, indexing, Prisma |
| `data-engineer` | ETL pipelines, data warehouses, Kafka, dbt |
| `graphql-developer` | GraphQL APIs, Apollo, federation, resolvers |
| `ml-engineer` | ML pipelines, model serving, RAG, fine-tuning |
| `cloud-architect` | AWS, Azure, GCP, serverless, containers |
| `devops-engineer` | CI/CD, deployment, monitoring, infrastructure |

### Language Specialists

| Agent | Language | Focus |
|-------|----------|-------|
| `go-developer` | Go 1.22+ | APIs, microservices, CLI tools |
| `java-developer` | Java 21+ | Spring Boot, Quarkus, Micronaut |
| `dotnet-developer` | .NET 8 | ASP.NET Core, Blazor, Minimal APIs |
| `kotlin-developer` | Kotlin 2.0 | Ktor, Spring Boot, Jetpack Compose |
| `ruby-developer` | Ruby 3.3+ | Rails 7, Hanami, Sinatra |
| `php-developer` | PHP 8.3 | Laravel 11, Symfony 7 |
| `cpp-developer` | C++23/26 | Systems programming, game engines |

### Mobile and Games

| Agent | Domain |
|-------|--------|
| `mobile-developer` | React Native, Flutter, Expo |
| `mobile-native` | Swift/SwiftUI (iOS), Kotlin/Compose (Android) |
| `game-developer` | Unity, Godot, Unreal, Phaser, Three.js |

### Quality and Security

| Agent | Domain |
|-------|--------|
| `security-auditor` | OWASP 2025, supply chain, zero trust |
| `penetration-tester` | Red team, vulnerability exploitation |
| `test-engineer` | TDD, unit/E2E testing, coverage |
| `qa-automation-engineer` | Playwright, Cypress, CI pipelines |
| `performance-optimizer` | Profiling, Core Web Vitals, bundle optimization |

### Product and Documentation

| Agent | Domain |
|-------|--------|
| `product-manager` | Requirements, user stories, acceptance criteria |
| `product-owner` | Roadmap, backlog, MVP, stakeholder management |
| `documentation-writer` | README, API docs, tutorials, changelogs |

---

## Domain Skills (69)

Skills are reusable instruction sets (SKILL.md) that agents discover on-demand via the `skill` tool.

### Development Patterns

| Skill | Description |
|-------|-------------|
| `clean-code` | Language-agnostic coding standards |
| `naming-conventions` | Naming rules by language |
| `code-review-checklist` | Language-agnostic review guidelines |
| `systematic-debugging` | 4-phase debugging methodology |
| `tdd-workflow` | RED-GREEN-REFACTOR cycle |
| `testing-patterns` | Unit, integration, mocking strategies |
| `plan-writing` | Structured task planning |
| `behavioral-modes` | AI operational modes |
| `brainstorming` | Socratic questioning protocol |

### Frontend and Design

| Skill | Description |
|-------|-------------|
| `frontend-design` | Design thinking for web UI |
| `react-best-practices` | React 18+ / Next.js performance |
| `nextjs-react-expert` | React and Next.js from Vercel Engineering |
| `tailwind-patterns` | Tailwind CSS v4, CSS-first configuration |
| `web-design-guidelines` | Web interface guidelines compliance |
| `ui-ux-pro-max` | 50+ visual styles, 21 color palettes |

### Backend and Frameworks

| Skill | Description |
|-------|-------------|
| `nodejs-best-practices` | Node.js async, security, architecture |
| `python-patterns` | Python async, type hints, project structure |
| `go-patterns` | Go 1.22+ patterns, concurrency, project structure |
| `go-concurrency` | Goroutines, channels, sync primitives |
| `java-expert` | Java 21+, Spring Boot, Quarkus |
| `spring-boot` | Spring Boot 3+ REST APIs, security |
| `dotnet-expert` | .NET 8, ASP.NET Core, C# 12 |
| `aspnet-core` | ASP.NET Core 8 Minimal APIs, MVC |
| `kotlin-expert` | Kotlin 2.0, coroutines, Ktor, Compose |
| `ruby-patterns` | Ruby 3.3+, Rails 7.2 |
| `rails-patterns` | Rails 7+ Hotwire, Turbo, Stimulus |
| `php-patterns` | PHP 8.3, Laravel 11, Symfony 7 |
| `laravel-patterns` | Laravel 11 Eloquent, API, queues |
| `django-patterns` | Django 4.2+ DRF, Celery, Docker |
| `nestjs-expert` | NestJS TypeScript, DI, modules |

### Database and ORM

| Skill | Description |
|-------|-------------|
| `database-design` | Schema design, indexing, serverless databases |
| `prisma-expert` | Prisma schema, migrations, query optimization |

### DevOps and Infrastructure

| Skill | Description |
|-------|-------------|
| `docker-expert` | Dockerfiles, multi-stage builds, security |
| `deployment-procedures` | Safe deployment, rollback, verification |
| `server-management` | Process management, monitoring, scaling |
| `bash-linux` | Bash/Linux terminal patterns |
| `powershell-windows` | PowerShell Windows patterns |

### Security and Testing

| Skill | Description |
|-------|-------------|
| `vulnerability-scanner` | OWASP 2025, supply chain, attack surface |
| `red-team-tactics` | MITRE ATT&CK, attack phases |
| `webapp-testing` | E2E, Playwright, deep audit |
| `performance-profiling` | Measurement, analysis, optimization |
| `seo-fundamentals` | SEO, E-E-A-T, Core Web Vitals |
| `geo-fundamentals` | Generative Engine Optimization |

### Mobile and Games

| Skill | Description |
|-------|-------------|
| `mobile-design` | Mobile-first design, touch interaction |
| `android-compose` | Jetpack Compose, Material 3 |
| `swift-expert` | Swift 5.9+, SwiftUI, concurrency |
| `game-development` | Multi-platform game development |
| `2d-games` | Sprites, tilemaps, physics, camera |
| `3d-games` | Rendering, shaders, physics |
| `pc-games` | Engine selection, platform features |
| `mobile-games` | Touch input, battery, app stores |
| `web-games` | Framework selection, WebGPU, PWA |
| `multiplayer` | Architecture, networking, synchronization |
| `game-design` | GDD, balancing, player psychology |
| `game-art` | Visual style, asset pipeline |
| `game-audio` | Sound design, adaptive audio |
| `vr-ar` | Comfort, interaction, performance |

### Architecture and Advanced

| Skill | Description |
|-------|-------------|
| `architecture` | Requirements, trade-offs, ADRs |
| `api-patterns` | REST vs GraphQL vs tRPC |
| `mcp-builder` | MCP server design, tools, resources |
| `parallel-agents` | Multi-agent orchestration |
| `intelligent-routing` | Automatic agent selection |
| `app-builder` | Full-stack application creation |
| `i18n-localization` | Translations, locale files, RTL |
| `documentation-templates` | README, API docs, comments |
| `systems-programming` | C++, Rust, memory, concurrency |
| `rust-pro` | Rust 1.75+, async, production systems |
| `cpp-modern` | C++23/26, RAII, performance |
| `lint-and-validate` | Linting, validation, CI integration |

---

## Custom Commands (5)

Slash commands for repetitive tasks. Run with `/command-name` in the TUI.

| Command | Agent | Description |
|---------|-------|-------------|
| `/audit-security` | `security-auditor` | Full project security audit |
| `/deploy-check` | `project-planner` | Verify project is ready to deploy |
| `/fix-types` | `debugger` | Find and fix TypeScript errors |
| `/gen-docs` | `documentation-writer` | Generate documentation for a file |
| `/review-pr` | `review` | Review branch changes before opening a PR |

### Usage

```
/audit-security src/
/deploy-check
/fix-types
/gen-docs src/components/Button.tsx
/review-pr
```

---

## Custom Tools (2)

TypeScript tools callable by agents via the OpenCode plugin API.

| Tool | Description |
|------|-------------|
| `read-env` | Lists environment variable names from .env files (values hidden) |
| `run-script` | Runs a package.json script and returns output with error handling |

---

## Validation Scripts (7)

Python scripts for quality assurance.

| Script | Location | Purpose |
|--------|----------|---------|
| `checklist.py` | `scripts/` | Priority-based project audit |
| `verify_all.py` | `scripts/` | Comprehensive verification suite |
| `auto_preview.py` | `scripts/` | Preview management |
| `session_manager.py` | `scripts/` | Session lifecycle management |
| `lint_runner.py` | `scripts/linters/` | Code linting automation |
| `md_validator.py` | `scripts/linters/` | Markdown validation |
| `test_runner_multi.py` | `scripts/testrunners/` | Multi-framework test execution |

---

## Project Structure

```
.
├── DOC/                          ← Complete OpenCode documentation
│   ├── README.md                 ← Documentation index
│   ├── getting-started/          ← Introduction, installation, quick-start
│   ├── core-concepts/            ← Agents, tools, commands, skills, permissions
│   ├── configuration/            ← Config files, providers, models, themes
│   ├── integrations/             ← MCP, plugins, LSP, custom tools, GitHub, GitLab
│   ├── cli-reference/            ← CLI, TUI, server, ACP, env vars
│   ├── advanced/                 ← SDK, share, enterprise, experimental
│   ├── ecosystem/                ← Community plugins, projects, agents
│   └── troubleshooting/          ← Windows, common issues, network
├── .opencode/                    ← OpenCode kit (auto-loaded)
│   ├── agents/                   ← 34 specialist agents (.md)
│   ├── skills/                   ← 69 domain skills (SKILL.md)
│   ├── commands/                 ← 5 custom commands (.md)
│   ├── tools/                    ← 2 custom tools (.ts)
│   ├── scripts/                  ← 7 validation scripts (.py)
│   ├── prompts/                  ← System prompt templates
│   ├── rules/                    ← Global rules (RULES.md)
│   ├── ARCHITECTURE.md           ← Kit architecture overview
│   ├── package.json              ← Plugin dependencies
│   └── bun.lock                  ← Dependency lock file
├── AGENTS.md                     ← Project-level agent instructions
└── README.md                     ← This file
```

---

## Configuration

### Agent Frontmatter Format

All agents use OpenCode's native format:

```yaml
---
name: agent-name
description: What this agent does
mode: primary
permission:
  edit: allow
  bash: allow
  read: allow
  grep: allow
  glob: allow
---
```

### Skill Frontmatter Format

All skills follow the OpenCode specification:

```yaml
---
name: skill-name
description: What this skill teaches
license: MIT              # optional
compatibility: opencode   # optional
metadata:                 # optional
  audience: developers
  category: backend
---
```

---

## Common Workflows

### Create a New Application

```bash
opencode
# Switch to plan mode (Tab), describe your application
# Review the plan, switch back to build mode (Tab)
# "Looks good, implement it"
```

### Code Review

```
/review-pr
# or
@security-auditor Review the auth implementation in @src/auth/
```

### Fix TypeScript Errors

```
/fix-types
```

### Security Audit

```
/audit-security
```

### Deploy Check

```
/deploy-check
```

---

## Supported Languages and Frameworks

| Language | Frameworks | Agent |
|----------|-----------|-------|
| **TypeScript/JavaScript** | React, Next.js, Node.js, Express, NestJS | `frontend-specialist`, `backend-specialist` |
| **Go** | Gin, Echo, Fiber | `go-developer` |
| **Java** | Spring Boot, Quarkus, Micronaut | `java-developer` |
| **.NET/C#** | ASP.NET Core, Blazor | `dotnet-developer` |
| **Kotlin** | Ktor, Spring Boot, Jetpack Compose | `kotlin-developer` |
| **Ruby** | Rails, Hanami, Sinatra | `ruby-developer` |
| **PHP** | Laravel, Symfony, Slim | `php-developer` |
| **C++** | Modern C++23/26 | `cpp-developer` |
| **Python** | Django, FastAPI, Flask | `backend-specialist` |
| **Rust** | Tokio, axum | `rust-pro` (skill) |
| **Swift** | SwiftUI | `mobile-native` |
| **Dart** | Flutter | `mobile-developer` |

---

## Documentation

Complete documentation is available in the `DOC/` directory:

| Section | Description |
|---------|-------------|
| [Getting Started](DOC/getting-started/introduction.md) | What is OpenCode, installation, quick start |
| [Core Concepts](DOC/core-concepts/agents.md) | Agents, tools, commands, skills, permissions |
| [Configuration](DOC/configuration/config-files.md) | Config files, providers, models, themes |
| [Integrations](DOC/integrations/mcp-servers.md) | MCP servers, plugins, LSP, custom tools |
| [CLI Reference](DOC/cli-reference/cli-overview.md) | All CLI commands and flags |
| [Advanced](DOC/advanced/sdk.md) | SDK, sharing, enterprise, experimental |
| [Ecosystem](DOC/ecosystem/plugins.md) | Community plugins, projects, agents |
| [Troubleshooting](DOC/troubleshooting/windows.md) | Windows setup, common issues, network |

---

## Resources

| Resource | Link |
|----------|------|
| **OpenCode GitHub** | [github.com/anomalyco/opencode](https://github.com/anomalyco/opencode) |
| **OpenCode Docs** | [opencode.ai/docs](https://opencode.ai/docs) |
| **Discord** | [opencode.ai/discord](https://opencode.ai/discord) |
| **Awesome OpenCode** | [github.com/awesome-opencode/awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) |
| **Community** | [opencode.cafe](https://opencode.cafe) |


---

Built for the OpenCode community.

Read [ARCHITECTURE.md](.opencode/ARCHITECTURE.md) for the full technical overview.

Browse the [DOC/](DOC/) directory for complete OpenCode documentation.
