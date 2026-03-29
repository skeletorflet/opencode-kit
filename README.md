# 🚀 Antigravity Kit for Opencode - MULTI-LANGUAGE EDITION

A comprehensive AI agent capability expansion toolkit designed to enhance your development workflow with specialized agents, skills, and workflows. Now supports **12+ programming languages** with language-agnostic conventions.

## 📋 Overview

Antigravity Kit is a modular system consisting of:
- **27 Specialist Agents** 👥 - Role-based AI personas
- **49 Skills** 🧩 - Domain-specific knowledge modules
- **27 Templates** 📦 - Multi-stack app scaffolding
- **11 Workflows** ⚡ - Slash command procedures
- **5 GitHub Actions CI/CD** 🚀 - Multi-language CI/CD pipelines
- **Multi-language Scripts** 🐍 - Linting and testing for all languages

> This kit has been adapted from the original Antigravity Kit to work seamlessly with Opencode. Now with FULL multi-language support.

---

## 🌐 Supported Languages & Frameworks

| Language | Framework | Skill | Template | Key Tooling |
|----------|-----------|-------|----------|-------------|
| **JS/TS** | Node.js | nestjs-expert | nestjs-api | NestJS, TypeORM |
| **JS/TS** | Next.js | react-best-practices | nextjs-fullstack | React, Prisma |
| **JS/TS** | SvelteKit | svelte-expert | sveltekit-app | SvelteKit, Prisma |
| **Python** | FastAPI | python-patterns | python-fastapi | FastAPI, SQLAlchemy |
| **Python** | Django | django-patterns | django-app | Django, DRF, Celery |
| **Go** | Gin/Fiber | go-patterns | go-gin-api, go-fiber-api | GORM |
| **Java** | Spring Boot | java-expert | spring-boot-api | JPA, Hibernate |
| **.NET** | ASP.NET Core | dotnet-expert | aspnet-core-api | EF Core |
| **Kotlin** | Ktor | kotlin-expert | ktor-api | Exposed |
| **PHP** | Laravel | php-patterns | laravel-app | Eloquent |
| **Ruby** | Rails | ruby-patterns | rails-app | ActiveRecord |
| **Rust** | Axum | rust-pro | rust-axum-api | SQLx |

---

## 📁 Directory Structure

```
.opencode/
├── ARCHITECTURE.md              # 📖 Complete architecture docs
├── agents/                      # 👨‍💼 27 Specialist Agents
├── skills/                      # 🧰 49 Skills
│   ├── nestjs-expert/           # NEW - NestJS 10+
│   ├── django-patterns/         # NEW - Django 4.2+
│   ├── go-patterns/             # Go patterns
│   ├── java-expert/             # Java 21+
│   ├── dotnet-expert/           # .NET 8
│   ├── kotlin-expert/           # Kotlin 2.0
│   ├── php-patterns/            # PHP 8.3
│   ├── ruby-patterns/           # Ruby 3.3
│   ├── cpp-modern/              # C++23
│   ├── swift-expert/            # Swift 5.9
│   ├── naming-conventions/      # Multi-language conventions
│   └── [more skills...]
├── skills/app-builder/templates/ # 📦 27 Templates
│   ├── nestjs-api/              # NEW
│   ├── django-app/              # NEW
│   ├── sveltekit-app/           # NEW
│   └── [more templates...]
├── .github/workflows/           # 🚀 5 CI/CD Pipelines
│   ├── go-ci.yml
│   ├── java-ci.yml
│   ├── dotnet-ci.yml
│   ├── python-ci.yml
│   └── nodejs-ci.yml
└── scripts/                     # 🐍 Validation Scripts
│   ├── lint-and-validate/       # 🔄 Refactored - Multi-language linting
│   └── [more skills...]
├── skills/app-builder/templates/ # 📦 24 Templates
│   ├── go-gin-api/              # NEW
│   ├── spring-boot-api/         # NEW
│   ├── aspnet-core-api/         # NEW
│   ├── rails-app/               # NEW
│   ├── laravel-app/             # NEW
│   └── [more templates...]
├── scripts/                     # 🐍 Validation Scripts
│   ├── linters/
│   │   └── lint_runner.py       # Multi-language linter
│   └── testrunners/
│       └── test_runner_multi.py # Multi-language test runner
└── mcp_config.json              # MCP Server Configuration
```

---

## 👨‍💼 Specialist Agents (27)

### Original Agents (20)
| Agent | Focus |
|-------|-------|
| `orchestrator` | Multi-agent coordination |
| `project-planner` | Discovery, task planning |
| `frontend-specialist` | Web UI/UX |
| `backend-specialist` | API, business logic |
| `database-architect` | Schema, SQL |
| `mobile-developer` | iOS, Android, RN |
| `game-developer` | Game logic, mechanics |
| `devops-engineer` | CI/CD, Docker |
| `security-auditor` | Security compliance |
| `penetration-tester` | Offensive security |
| `test-engineer` | Testing strategies |
| `debugger` | Root cause analysis |
| `performance-optimizer` | Speed, Web Vitals |
| `seo-specialist` | Ranking, visibility |
| `documentation-writer` | Manuals, docs |
| `product-manager` | Requirements, user stories |
| `product-owner` | Strategy, backlog, MVP |
| `qa-automation-engineer` | E2E testing, CI pipelines |
| `code-archaeologist` | Legacy code, refactoring |
| `explorer-agent` | Codebase analysis |

### NEW: Multi-Language Agents (7)
| Agent | Focus | Key Skills |
|-------|-------|-------------|
| `go-developer` | Go/Golang backend | go-patterns, Gin/Chi/Fiber |
| `java-developer` | Java/JVM backend | java-expert, Spring Boot |
| `dotnet-developer` | .NET/C# backend | dotnet-expert, ASP.NET Core |
| `kotlin-developer` | Kotlin backend/Android | kotlin-expert, Ktor, Compose |
| `ruby-developer` | Ruby/Rails backend | ruby-patterns, Rails 7 |
| `php-developer` | PHP/Laravel backend | php-patterns, Laravel |
| `cpp-developer` | C++ systems programming | cpp-modern |

---

## 🧩 Skills (49)

### 🎯 Language-Agnostic Skills (REFACTORIZED)
- `clean-code` - Language-agnostic coding standards
- `lint-and-validate` - Multi-language linting
- `code-review-checklist` - Language-adaptive code review
- `systematic-debugging` - Debugging per language
- `naming-conventions` - Complete reference table by language

### 🐍 Backend & API Skills
- `nestjs-expert` - NestJS 10+, TypeORM, JWT Auth
- `django-patterns` - Django 4.2+, DRF, Celery
- `go-patterns` - Go 1.22+, Gin/Chi/Fiber
- `java-expert` - Java 21+, Spring Boot
- `dotnet-expert` - .NET 8, C# 12
- `kotlin-expert` - Kotlin 2.0+, Ktor
- `php-patterns` - PHP 8.3, Laravel
- `ruby-patterns` - Ruby 3.3+, Rails 7
- `kotlin-expert` - Kotlin 2.0+, Ktor, coroutines
- `php-patterns` - PHP 8.3, Laravel 11, PSR standards
- `ruby-patterns` - Ruby 3.3+, Rails 7, Hotwire

### 🦀 Systems & Mobile
- `rust-pro` - Rust 1.75+, Tokio, Axum
- `cpp-modern` - C++23/26, RAII, concepts
- `swift-expert` - Swift 5.9+, SwiftUI, async/await
- `kotlin-expert` - Kotlin multiplatform

### 🕸️ Web & Frontend (Original)
- `react-best-practices` - React & Next.js performance
- `web-design-guidelines` - Web UI audit
- `tailwind-patterns` - Tailwind CSS v4
- `nodejs-best-practices` - Node.js async

### 🗄️ Database
- `database-design` - Schema design, optimization
- `prisma-expert` - Prisma ORM

### 🛡️ Quality & Security
- `testing-patterns` - Test strategies
- `webapp-testing` - E2E, Playwright
- `vulnerability-scanner` - Security auditing
- `code-review-checklist` - Code review

---

## 📦 App Builder Templates (27)

### 🆕 Enterprise Backend
| Template | Stack | Use Case |
|----------|-------|----------|
| `nestjs-api` | NestJS + TypeORM | Enterprise Node.js APIs |
| `django-app` | Django 4 + DRF | Full Python web apps |
| `sveltekit-app` | SvelteKit 2 + Prisma | Modern Svelte apps |

### Multi-Language Templates
| Template | Stack | Use Case |
|----------|-------|----------|
| `go-gin-api` | Go + Gin | High-performance APIs |
| `go-fiber-api` | Go + Fiber | Fastest Go web framework |
| `spring-boot-api` | Java + Spring Boot 3 | Enterprise APIs |
| `ktor-api` | Kotlin + Ktor | Lightweight async APIs |
| `aspnet-core-api` | .NET 8 + Minimal APIs | Modern .NET APIs |
| `rails-app` | Ruby + Rails 7 | Full-stack Rails |
| `laravel-app` | PHP + Laravel 11 | Modern PHP apps |
| `rust-axum-api` | Rust + Axum | High-performance Rust APIs |
| `swiftui-app` | Swift + SwiftUI | iOS/macOS apps |
| `kotlin-android` | Kotlin + Jetpack Compose | Android apps |

### JavaScript/Frontend
- `nextjs-fullstack` / `nextjs-saas` / `nextjs-static`
- `nuxt-app` / `astro-static` / `sveltekit-app`
- `express-api` / `react-native-app`
- `flutter-app` / `electron-desktop`

### Python & Others
- `python-fastapi` / `django-app`
- `monorepo-turborepo` / `cli-tool` / `chrome-extension`

---

## 🚀 GitHub Actions CI/CD

Automated CI/CD pipelines for all major languages:

| Workflow | Language | Features |
|----------|----------|----------|
| `go-ci.yml` | Go 1.22+ | Tests, lint, docker |
| `java-ci.yml` | Java 21 | Maven, security |
| `dotnet-ci.yml` | .NET 8 | Tests, security |
| `python-ci.yml` | Python 3.11 | pytest, coverage, ruff |
| `nodejs-ci.yml` | Node.js 20 | npm test, lint |

---

## 🌟 Example: Building a Multi-Language Project

### Go Backend
```bash
opencode run "Create a REST API with Go and Gin" --agent go-developer
```

### Java Spring Boot
```bash
opencode run "Build a todo API with Spring Boot" --agent java-developer
```

### .NET Minimal API
```bash
opencode run "Create a minimal API with .NET 8" --agent dotnet-developer
```

### Laravel PHP
```bash
opencode run "Build a blog with Laravel" --agent php-developer
```

### Ruby on Rails
```bash
opencode run "Create a task manager with Rails 7" --agent ruby-developer
```

---

## 🔄 Language-Agnostic Code Conventions

The kit **automatically adapts** to the language being used. See `naming-conventions` skill:

| Language | Methods | Constants | Classes | Files |
|----------|---------|-----------|---------|-------|
| **Python** | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **C#/.NET** | PascalCase | PascalCase | PascalCase | PascalCase |
| **Go** | PascalCase (export) | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **Rust** | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **JavaScript** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **Ruby** | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **PHP** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **Swift** | camelCase | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **Kotlin** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **Java** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |

---

## 🐍 Validation Scripts

### Multi-Language Linting
```bash
# Auto-detects language and runs appropriate linter
python .opencode/scripts/linters/lint_runner.py ./project
```

Supports: Python (Ruff), Go (go vet/golangci-lint), Rust (cargo clippy), JavaScript/TypeScript (ESLint), Java (Checkstyle)

### Multi-Language Testing
```bash
# Auto-detects language and runs tests
python .opencode/scripts/testrunners/test_runner_multi.py ./project
```

Supports: Python (pytest), Go (go test), Rust (cargo test), JavaScript (Jest), Java/Maven, Ruby (RSpec), .NET (dotnet test)

---

## 🚀 Getting Started

### Prerequisites
- Opencode installed
- Node.js (for running validation scripts)
- Python 3.x (for scripts)
- Language-specific tooling (Go, Java, .NET, etc.)

### Using Multi-Language Agents
```bash
opencode run "Build a user API with Go" --agent go-developer
opencode run "Create a Spring Boot service" --agent java-developer
opencode run "Build an ASP.NET Core API" --agent dotnet-developer
```

### Using Templates
```bash
opencode run "/create Build a Go Gin API" --skill app-builder
opencode run "/create Build a Rails 7 app" --skill app-builder
opencode run "/create Build a Laravel 11 API" --skill app-builder
```

---

## 🔌 MCP Servers

The kit includes pre-configured MCP servers:

- **Context7** - For up-to-date documentation
- **Shadcn** - For UI component generation
- **Netlify** - For deployment capabilities

---

## 🏆 Best Practices

1. **Let the agent detect language** - Say "build an API" without specifying the language, and the appropriate agent will be selected
2. **Use language-agnostic skills** - `clean-code` and `naming-conventions` adapt automatically
3. **Use the right agent for your language** - Each language has a dedicated specialist
4. **Run validations** - Use the multi-language lint and test scripts
5. **Leverage templates** - App-builder generates complete project scaffolding

---

## 🛠️ Extending the Kit

You can extend by:
- Adding new skills to `.opencode/skills/`
- Creating new agents in `.opencode/agents/`
- Adding templates to `.opencode/skills/app-builder/templates/`
- Customizing scripts in `.opencode/scripts/`

---

## 📜 License

Adapted from the Antigravity Kit for use with Opencode.

---

## 🤝 Support

For questions, check:
- `ARCHITECTURE.md` - Complete system documentation
- Individual skill `SKILL.md` files
- Agent descriptions in `agents/`

---

> ⭐ **Star this repo** if you find it useful! Now with full multi-language support.