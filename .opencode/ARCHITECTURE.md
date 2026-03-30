# Opencode Kit Architecture

> Comprehensive AI Agent Capability Expansion Toolkit - ENHANCED EDITION v2

---

## 📋 Overview

Opencode Kit is a modular system consisting of:

- **33 Specialist Agents** - Role-based AI personas (6 NEW)
- **49 Skills** - Domain-specific knowledge modules
- **31 Templates** - Multi-stack app scaffolding (5 NEW)
- **11 Workflows** - Slash command procedures
- **10 GitHub Actions CI/CD** - Multi-language CI/CD pipelines (5 NEW)

---

## 🏗️ Directory Structure

```plaintext
.opencode/
├── ARCHITECTURE.md          # This file
├── agents/                  # 33 Specialist Agents
├── skills/                  # 49 Skills (multi-language)
│   ├── app-builder/         # App scaffolding orchestrator
│   │   └── templates/       # 31 Project templates
│   ├── [language]-patterns/ # Language-specific skills
│   └── [domain]-skills/     # Domain-specific skills
├── workflows/               # 11 Slash Commands
├── .github/workflows/       # 10 CI/CD Pipelines
├── rules/                   # Global Rules
└── scripts/                 # Validation & Linting Scripts
    ├── linters/             # Multi-language linting + MD validation
    └── testrunners/         # Multi-language testing
```

---

## 🤖 Agents (33)

### Core Agents (20)
| Agent | Focus | Skills Used |
|-------|-------|-------------|
| `orchestrator` | Multi-agent coordination | parallel-agents, behavioral-modes |
| `project-planner` | Discovery, task planning | brainstorming, plan-writing, architecture |
| `frontend-specialist` | Web UI/UX | frontend-design, react-best-practices, tailwind-patterns |
| `backend-specialist` | API, business logic | api-patterns, nodejs-best-practices, database-design |
| `database-architect` | Schema, SQL | database-design, prisma-expert |
| `mobile-developer` | iOS, Android, RN | mobile-design |
| `game-developer` | Game logic, mechanics | game-development |
| `devops-engineer` | CI/CD, Docker | deployment-procedures, docker-expert |
| `security-auditor` | Security compliance | vulnerability-scanner, red-team-tactics |
| `penetration-tester` | Offensive security | red-team-tactics |
| `test-engineer` | Testing strategies | testing-patterns, tdd-workflow, webapp-testing |
| `debugger` | Root cause analysis | systematic-debugging |
| `performance-optimizer` | Speed, Web Vitals | performance-profiling |
| `seo-specialist` | Ranking, visibility | seo-fundamentals, geo-fundamentals |
| `documentation-writer` | Manuals, docs | documentation-templates |
| `product-manager` | Requirements, user stories | plan-writing, brainstorming |
| `product-owner` | Strategy, backlog, MVP | plan-writing, brainstorming |
| `qa-automation-engineer` | E2E testing, CI pipelines | webapp-testing, testing-patterns |
| `code-archaeologist` | Legacy code, refactoring | clean-code, code-review-checklist |
| `explorer-agent` | Codebase analysis | - |

### Multi-Language Agents (7)
| Agent | Focus | Skills Used |
|-------|-------|-------------|
| `go-developer` | Go/Golang development | go-patterns, go-concurrency |
| `java-developer` | Java/JVM development | java-expert, spring-boot |
| `dotnet-developer` | .NET/C# development | dotnet-expert, aspnet-core |
| `kotlin-developer` | Kotlin/Android development | kotlin-expert, android-compose |
| `ruby-developer` | Ruby/Rails development | ruby-patterns, rails-patterns |
| `php-developer` | PHP/Laravel development | php-patterns, laravel-patterns |
| `cpp-developer` | C++ development | cpp-modern, systems-programming |

### NEW: Specialized Agents (6)
| Agent | Focus | Skills Used |
|-------|-------|-------------|
| `data-engineer` | ETL, data pipelines, Spark, Kafka, dbt | database-design, python-patterns, deployment-procedures |
| `ml-engineer` | ML/AI, model training, RAG, LLMs | python-patterns, database-design, api-patterns |
| `cloud-architect` | AWS/Azure/GCP, infrastructure, IaC | deployment-procedures, server-management, database-design |
| `accessibility-specialist` | WCAG, screen readers, inclusive design | frontend-design, web-design-guidelines, testing-patterns |
| `graphql-developer` | GraphQL schemas, resolvers, federation | api-patterns, database-design, testing-patterns |
| `mobile-native` | Swift/SwiftUI, Kotlin/Compose native | mobile-design, swift-expert, kotlin-expert |

---

## 🧩 Skills (47)

### Language-Agnostic Skills (REFACTORIZED)
| Skill | Description |
|-------|-------------|
| `clean-code` | Coding standards - NOW LANGUAGE-AGNOSTIC |
| `lint-and-validate` | Multi-language linting |
| `code-review-checklist` | Code review with language-adaptive conventions |
| `systematic-debugging` | Debugging tools by language |
| `naming-conventions` | **NEW** - Complete naming convention table by language |

### Backend & API
| Skill | Description |
|-------|-------------|
| `api-patterns` | REST, GraphQL, tRPC |
| `nestjs-expert` | NestJS 10+, TypeORM, JWT |
| `nodejs-best-practices` | Node.js async, modules |
| `python-patterns` | Python 3.11+, FastAPI |
| `django-patterns` | **NEW** - Django 4.2+, DRF, Celery |
| `go-patterns` | **NEW** - Go 1.22+, Gin/Chi/Fiber |
| `java-expert` | **NEW** - Java 21+, Spring Boot |
| `dotnet-expert` | **NEW** - .NET 8, C# 12, Minimal APIs |
| `kotlin-expert` | **NEW** - Kotlin 2.0+, Ktor |
| `php-patterns` | **NEW** - PHP 8.3, Laravel/Symfony |
| `ruby-patterns` | **NEW** - Ruby 3.3+, Rails 7 |
| `rust-pro` | Rust 1.75+, Tokio, Axum |

### Mobile & Desktop
| Skill | Description |
|-------|-------------|
| `mobile-design` | Mobile UI/UX patterns |
| `swift-expert` | **NEW** - Swift 5.9+, SwiftUI |

### Game Development
| Skill | Description |
|-------|-------------|
| `game-development` | Game logic, mechanics |

### Systems & Low-Level
| Skill | Description |
|-------|-------------|
| `cpp-modern` | **NEW** - C++23/26, RAII, Concepts |

### Database
| Skill | Description |
|-------|-------------|
| `database-design` | Schema design, optimization |
| `prisma-expert` | Prisma ORM, migrations |

### Frontend & UI
| Skill | Description |
|-------|-------------|
| `react-best-practices` | React & Next.js performance |
| `web-design-guidelines` | Web UI audit |
| `tailwind-patterns` | Tailwind CSS v4 |
| `frontend-design` | UI/UX patterns |
| `ui-ux-pro-max` | 50 styles, 21 palettes |

### Cloud & Infrastructure
| Skill | Description |
|-------|-------------|
| `deployment-procedures` | CI/CD, deploy workflows |
| `server-management` | Infrastructure management |

### Testing & Quality
| Skill | Description |
|-------|-------------|
| `testing-patterns` | Jest, Vitest, pytest |
| `webapp-testing` | E2E, Playwright |
| `tdd-workflow` | Test-driven development |

### Security
| Skill | Description |
|-------|-------------|
| `vulnerability-scanner` | Security auditing, OWASP |
| `red-team-tactics` | Offensive security |

### Architecture & Planning
| Skill | Description |
|-------|-------------|
| `app-builder` | Full-stack app scaffolding |
| `architecture` | System design patterns |
| `plan-writing` | Task planning, breakdown |
| `brainstorming` | Socratic questioning |

### Shell/CLI
| Skill | Description |
|-------|-------------|
| `bash-linux` | Linux commands, scripting |
| `powershell-windows` | Windows PowerShell |

### SEO & Growth
| Skill | Description |
|-------|-------------|
| `seo-fundamentals` | SEO, E-E-A-T, Core Web Vitals |
| `geo-fundamentals` | GenAI optimization |

### Documentation & Tools
| Skill | Description |
|-------|-------------|
| `mcp-builder` | Model Context Protocol |
| `documentation-templates` | Doc formats |
| `i18n-localization` | Internationalization |
| `performance-profiling` | Web Vitals, optimization |
| `code-review-checklist` | Code review |

---

## 📦 App Builder Templates (31)

### JavaScript/TypeScript (15)
- `nextjs-fullstack` - Next.js fullstack
- `nextjs-saas` - Next.js SaaS
- `nextjs-static` - Next.js static
- `nuxt-app` - Nuxt 3 + Pinia
- `sveltekit-app` - SvelteKit 2 + Prisma
- `react-router-v7` - **NEW** - React Router v7 (Remix v2)
- `hono-cloudflare` - **NEW** - Hono + Cloudflare Workers
- `solidstart-app` - **NEW** - SolidStart fine-grained reactivity
- `angular-app` - **NEW** - Angular 18+ Standalone
- `express-api` - Express.js API
- `react-native-app` - React Native
- `flutter-app` - Flutter mobile
- `electron-desktop` - Electron desktop
- `chrome-extension` - Chrome extension
- `astro-starlight` - **NEW** - Astro Starlight documentation

### Python (2)
- `python-fastapi` - FastAPI + SQLAlchemy
- `django-app` - Django 4 + DRF + Celery

### Go (2)
- `go-gin-api` - Go + Gin API
- `go-fiber-api` - Go + Fiber API

### Java (1)
- `spring-boot-api` - Spring Boot 3 + JPA

### .NET (1)
- `aspnet-core-api` - .NET 8 + Minimal APIs

### PHP (1)
- `laravel-app` - Laravel 11

### Ruby (1)
- `rails-app` - Rails 7 + Hotwire

### Rust (1)
- `rust-axum-api` - Rust + Axum

### Kotlin (1)
- `kotlin-android` - Kotlin + Jetpack Compose

### Swift (1)
- `swiftui-app` - Swift + SwiftUI

### Others (5)
- `astro-static` - Astro static
- `cli-tool` - CLI tool
- `monorepo-turborepo` - Turborepo monorepo

---

## 🔄 Workflows (11)

| Command | Description |
|---------|-------------|
| `/brainstorm` | Socratic discovery |
| `/create` | Create new features |
| `/debug` | Debug issues |
| `/deploy` | Deploy application |
| `/enhance` | Improve existing code |
| `/orchestrate` | Multi-agent coordination |
| `/plan` | Task breakdown |
| `/preview` | Preview changes |
| `/status` | Check project status |
| `/test` | Run tests |
| `/ui-ux-pro-max` | Design with 50 styles |

---

## 🎯 Language-Specific Conventions

The kit now **automatically adapts** to the language being used:

| Language | Methods | Constants | Classes | Files |
|----------|---------|-----------|---------|-------|
| **Python** | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **C#/.NET** | PascalCase | PascalCase | PascalCase | PascalCase |
| **Go** | PascalCase | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **Rust** | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **JavaScript** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **Ruby** | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **PHP** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **Swift** | camelCase | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **Kotlin** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **Java** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |

---

## 🔧 Multi-Language Scripts

### Linting Scripts
| Script | Languages Supported |
|--------|---------------------|
| `lint_runner.py` | Python, Go, Rust, JS/TS, Java |
| `md_validator.py` | **NEW** - Markdown files, YAML frontmatter, internal links |

### Test Scripts
| Script | Languages Supported |
|--------|---------------------|
| `test_runner_multi.py` | Python (pytest), Go (go test), Rust (cargo test), Java (mvn/junit), JS (Jest) |

---

---

## 🚀 GitHub Actions CI/CD Pipelines (10)

Automated CI/CD workflows for multi-language projects:

| Workflow | Language | Features |
|----------|----------|----------|
| `go-ci.yml` | Go 1.22+ | Tests, lint, docker build |
| `java-ci.yml` | Java 21 | Maven, security scan |
| `dotnet-ci.yml` | .NET 8 | Tests, security analysis |
| `python-ci.yml` | Python 3.11 | pytest, coverage, ruff |
| `nodejs-ci.yml` | Node.js 20 | npm test, lint, build |
| `ruby-ci.yml` | **NEW** - Ruby 3.3 | RSpec, RuboCop, Brakeman |
| `rust-ci.yml` | **NEW** - Rust stable | cargo test, clippy, fmt |
| `swift-ci.yml` | **NEW** - Swift/Xcode | xcodebuild, SwiftLint |
| `kotlin-ci.yml` | **NEW** - Kotlin/Android | Gradle, detekt, ktlint |
| `php-ci.yml` | **NEW** - PHP 8.3 | PHPUnit, Pint, PHPStan |

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Agents** | 33 |
| **Total Skills** | 49 |
| **Total Templates** | 31 |
| **Total Workflows** | 11 |
| **CI/CD Pipelines** | 10 |
| **Languages Supported** | 15+ (Go, Java, .NET, Kotlin, PHP, Ruby, C++, Swift, Python, Rust, JS/TS, Angular, Svelte, SolidJS) |
| **Coverage** | Full multi-language development + Data/ML + Cloud + Accessibility |

---

## 🔗 Quick Reference

| Need | Agent | Skills |
|------|-------|--------|
| Python API | (use python-patterns) | python-patterns, fastapi |
| Go API | `go-developer` | go-patterns |
| Java API | `java-developer` | java-expert |
| .NET API | `dotnet-developer` | dotnet-expert |
| Kotlin/Android | `kotlin-developer` | kotlin-expert |
| Ruby/Rails | `ruby-developer` | ruby-patterns |
| PHP/Laravel | `php-developer` | php-patterns |
| iOS/SwiftUI | `swift-developer` | swift-expert |
| Web App | `frontend-specialist` | react-best-practices |
| API | `backend-specialist` | api-patterns |
| Mobile | `mobile-developer` | mobile-design |
| Security | `security-auditor` | vulnerability-scanner |
| Testing | `test-engineer` | testing-patterns |
| Code Review | any (auto-detect language) | clean-code, naming-conventions |

---

## 🧪 Skill Loading Protocol

```
User Request → Language Detection → Load Language-Specific Skill
    ↓
Auto-detect conventions → Adapt to language standards
```

### Example
- User asks: "Create a user service"
- Agent detects: Go project
- Loads: go-patterns/SKILL.md with Go conventions (PascalCase exports)

---

*Last Updated: March 2026 - Multi-Language Expansion Complete*