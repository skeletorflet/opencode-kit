# Opencode Kit Architecture

> Comprehensive AI Agent Capability Expansion Toolkit - ENHANCED EDITION v2

---

## 📋 Overview

Opencode Kit is a modular system consisting of:

- **34 Specialist Agents** - Role-based AI personas
- **69 Skills** - Domain-specific knowledge modules (flat structure, all discoverable)
- **27 Templates** - Multi-stack app scaffolding
- **5 Commands** - Custom slash commands
- **2 Custom Tools** - TypeScript callable tools
- **7 Scripts** - Validation, linting, preview management, testing

---

## 🏗️ Directory Structure

```plaintext
.opencode/
├── ARCHITECTURE.md          # This file
├── .gitignore               # Git ignore for kit artifacts
├── package.json             # Plugin dependency (@opencode-ai/plugin)
├── agents/                  # 33 Specialist Agents
├── skills/                  # 69 Skills (flat structure, all discoverable by OpenCode)
│   ├── app-builder/         # App scaffolding orchestrator
│   │   └── templates/       # 27 Project templates
│   ├── game-development/    # Game dev parent skill (sub-skills at root)
│   ├── [language]-patterns/ # Language-specific skills
│   └── [domain]-skills/     # Domain-specific skills
├── commands/                # 5 Custom slash commands
├── tools/                   # 2 Custom tools (TypeScript)
├── prompts/                 # Reusable prompt files (build.txt, review.txt)
├── rules/                   # Global Rules (RULES.md)
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

### Specialized Agents (6)
| Agent | Focus | Skills Used |
|-------|-------|-------------|
| `data-engineer` | ETL, data pipelines, Spark, Kafka, dbt | database-design, python-patterns, deployment-procedures |
| `ml-engineer` | ML/AI, model training, RAG, LLMs | python-patterns, database-design, api-patterns |
| `cloud-architect` | AWS/Azure/GCP, infrastructure, IaC | deployment-procedures, server-management, database-design |
| `accessibility-specialist` | WCAG, screen readers, inclusive design | frontend-design, web-design-guidelines, testing-patterns |
| `graphql-developer` | GraphQL schemas, resolvers, federation | api-patterns, database-design, testing-patterns |
| `mobile-native` | Swift/SwiftUI, Kotlin/Compose native | mobile-design, swift-expert, kotlin-expert |

---

## 🧩 Skills (69)

### Language-Agnostic Skills
| Skill | Description |
|-------|-------------|
| `clean-code` | Coding standards - language-agnostic |
| `lint-and-validate` | Multi-language linting |
| `code-review-checklist` | Code review with language-adaptive conventions |
| `systematic-debugging` | Debugging tools by language |
| `naming-conventions` | Complete naming convention table by language |

### Backend & API
| Skill | Description |
|-------|-------------|
| `api-patterns` | REST, GraphQL, tRPC |
| `nestjs-expert` | NestJS 10+, TypeORM, JWT |
| `nodejs-best-practices` | Node.js async, modules |
| `python-patterns` | Python 3.11+, FastAPI |
| `django-patterns` | Django 4.2+, DRF, Celery |
| `go-patterns` | Go 1.22+, Gin/Chi/Fiber |
| `go-concurrency` | Go goroutines, channels, sync primitives |
| `java-expert` | Java 21+, Spring Boot |
| `spring-boot` | Spring Boot 3+, REST APIs, Security |
| `dotnet-expert` | .NET 8, C# 12, Minimal APIs |
| `aspnet-core` | ASP.NET Core 8+, EF Core, Identity |
| `kotlin-expert` | Kotlin 2.0+, Ktor |
| `php-patterns` | PHP 8.3, Laravel/Symfony |
| `laravel-patterns` | Laravel 11+, Eloquent, API Resources |
| `ruby-patterns` | Ruby 3.3+, Rails 7 |
| `rails-patterns` | Rails 7+, Hotwire, Turbo, Stimulus |
| `rust-pro` | Rust 1.75+, Tokio, Axum |
| `cpp-modern` | C++23/26, RAII, Concepts |
| `systems-programming` | Low-level patterns, FFI, memory management |

### Mobile & Desktop
| Skill | Description |
|-------|-------------|
| `mobile-design` | Mobile UI/UX patterns |
| `swift-expert` | Swift 5.9+, SwiftUI |
| `android-compose` | Jetpack Compose, Material 3 |

### Game Development
| Skill | Description |
|-------|-------------|
| `game-development` | Game logic, mechanics |
| `pc-games` | PC game development (Unity, Unreal) |
| `web-games` | Browser games (Phaser, Three.js) |
| `mobile-games` | Mobile game development |
| `game-design` | Game design, GDD, balancing |
| `multiplayer` | Multiplayer, networking, sync |
| `vr-ar` | VR/AR development |
| `2d-games` | 2D games, sprites, tilemaps |
| `3d-games` | 3D games, rendering, shaders |
| `game-art` | Game art, visual style, animation |
| `game-audio` | Game audio, sound design, music |

### Database
| Skill | Description |
|-------|-------------|
| `database-design` | Schema design, optimization |
| `prisma-expert` | Prisma ORM, migrations |

### Frontend & UI
| Skill | Description |
|-------|-------------|
| `react-best-practices` | React 18+, Next.js, RSC |
| `nextjs-react-expert` | Next.js performance optimization |
| `web-design-guidelines` | Web UI audit |
| `tailwind-patterns` | Tailwind CSS v4 |
| `frontend-design` | UI/UX patterns |
| `ui-ux-pro-max` | 50+ styles, 21 palettes, anti-cliché |

### Cloud & Infrastructure
| Skill | Description |
|-------|-------------|
| `deployment-procedures` | CI/CD, deploy workflows |
| `server-management` | Infrastructure management |
| `docker-expert` | Docker, docker-compose, multi-stage builds |

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
| `parallel-agents` | Multi-agent orchestration |
| `behavioral-modes` | AI operational modes |
| `intelligent-routing` | Automatic agent selection |

---

## 📦 App Builder Templates (26)

### JavaScript/TypeScript (12)
- `nextjs-fullstack` - Next.js fullstack
- `nextjs-saas` - Next.js SaaS
- `nextjs-static` - Next.js static
- `nuxt-app` - Nuxt 3 + Pinia
- `sveltekit-app` - SvelteKit 2 + Prisma
- `express-api` - Express.js API
- `react-native-app` - React Native
- `flutter-app` - Flutter mobile
- `electron-desktop` - Electron desktop
- `chrome-extension` - Chrome extension
- `astro-static` - Astro static
- `nestjs-api` - NestJS API

### Backend (8)
- `python-fastapi` - FastAPI + SQLAlchemy
- `django-app` - Django 4 + DRF + Celery
- `go-gin-api` - Go + Gin API
- `go-fiber-api` - Go + Fiber API
- `spring-boot-api` - Spring Boot 3 + JPA
- `aspnet-core-api` - .NET 8 + Minimal APIs
- `laravel-app` - Laravel 11
- `rails-app` - Rails 7 + Hotwire

### Systems & Mobile (4)
- `rust-axum-api` - Rust + Axum
- `kotlin-android` - Kotlin + Jetpack Compose
- `swiftui-app` - Swift + SwiftUI
- `ktor-api` - Kotlin Ktor API

### Other
- `cli-tool` - CLI tool
- `monorepo-turborepo` - Turborepo monorepo

---

## 📋 Commands (5)

| Command | Agent | Description |
|---------|-------|-------------|
| `/audit-security` | security-auditor | Full security audit |
| `/deploy-check` | plan | Verify deployment readiness |
| `/fix-types` | build | Fix TypeScript type errors |
| `/gen-docs` | documentation-writer | Generate documentation |
| `/review-pr` | review | Review branch changes |

---

## 🛠️ Custom Tools (2)

| Tool | Description |
|------|-------------|
| `read-env` | List environment variable names from .env files |
| `run-script` | Run package.json scripts |

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

## 🔧 Scripts

| Script | Purpose |
|--------|---------|
| `checklist.py` | Priority-based project audit |
| `verify_all.py` | Full verification suite |
| `auto_preview.py` | Dev server management |
| `linters/lint_runner.py` | Multi-language linting |
| `linters/md_validator.py` | Markdown validation |
| `testrunners/test_runner_multi.py` | Multi-language testing |

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Agents** | 34 |
| **Total Skills** | 71 (flat structure, all discoverable by OpenCode) |
| **Total Templates** | 26 |
| **Total Commands** | 9 |
| **Total Workflows** | 3 |
| **Custom Tools** | 2 |
| **Languages Supported** | 15+ (Go, Java, .NET, Kotlin, PHP, Ruby, C++, Swift, Python, Rust, JS/TS, Angular, Svelte, SolidJS) |
| **Coverage** | Full multi-language development + Data/ML + Cloud + Accessibility |

---

## 🔗 Quick Reference

| Need | Agent | Skills |
|------|-------|--------|
| Python API | (use python-patterns) | python-patterns, fastapi |
| Go API | `go-developer` | go-patterns, go-concurrency |
| Java API | `java-developer` | java-expert, spring-boot |
| .NET API | `dotnet-developer` | dotnet-expert, aspnet-core |
| Kotlin/Android | `kotlin-developer` | kotlin-expert, android-compose |
| Ruby/Rails | `ruby-developer` | ruby-patterns, rails-patterns |
| PHP/Laravel | `php-developer` | php-patterns, laravel-patterns |
| iOS/SwiftUI | `mobile-native` | swift-expert |
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
