---
name: app-builder
description: Main application building orchestrator. Creates full-stack applications from natural language requests. Determines project type, selects tech stack, coordinates agents.
---

# App Builder - Application Building Orchestrator

> Analyzes user's requests, determines tech stack, plans structure, and coordinates agents.

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File | Description | When to Read |
|------|-------------|--------------|
| `project-detection.md` | Keyword matrix, project type detection | Starting new project |
| `tech-stack.md` | 2026 default stack, alternatives | Choosing technologies |
| `agent-coordination.md` | Agent pipeline, execution order | Coordinating multi-agent work |
| `scaffolding.md` | Directory structure, core files | Creating project structure |
| `feature-building.md` | Feature analysis, error handling | Adding features to existing project |
| `templates/SKILL.md` | **Project templates** | Scaffolding new project |

---

## 📦 Templates (26)

Quick-start scaffolding for new projects. **Read the matching template only!**

### JavaScript/TypeScript
| Template | Tech Stack | When to Use |
|----------|------------|-------------|
| [nextjs-fullstack](templates/nextjs-fullstack/TEMPLATE.md) | Next.js + Prisma | Full-stack web app |
| [nextjs-saas](templates/nextjs-saas/TEMPLATE.md) | Next.js + Stripe | SaaS product |
| [nextjs-static](templates/nextjs-static/TEMPLATE.md) | Next.js + Framer | Landing page |
| [nuxt-app](templates/nuxt-app/TEMPLATE.md) | Nuxt 3 + Pinia | Vue full-stack app |
| [express-api](templates/express-api/TEMPLATE.md) | Express + JWT | REST API |
| [sveltekit-app](templates/sveltekit-app/TEMPLATE.md) | SvelteKit 2 + Prisma | Svelte full-stack |
| [react-native-app](templates/react-native-app/TEMPLATE.md) | Expo + Zustand | Mobile app |
| [flutter-app](templates/flutter-app/TEMPLATE.md) | Flutter + Riverpod | Cross-platform mobile |
| [electron-desktop](templates/electron-desktop/TEMPLATE.md) | Electron + React | Desktop app |
| [chrome-extension](templates/chrome-extension/TEMPLATE.md) | Chrome MV3 | Browser extension |
| [cli-tool](templates/cli-tool/TEMPLATE.md) | Node.js + Commander | CLI app |
| [monorepo-turborepo](templates/monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm | Monorepo |

### Python
| Template | Tech Stack | When to Use |
|----------|------------|-------------|
| [python-fastapi](templates/python-fastapi/TEMPLATE.md) | FastAPI + SQLAlchemy | Python API |
| [django-app](templates/django-app/TEMPLATE.md) | Django 4 + DRF | Full Django app |

### Go
| Template | Tech Stack | When to Use |
|----------|------------|-------------|
| [go-gin-api](templates/go-gin-api/TEMPLATE.md) | Go + Gin | High-perf API |
| [go-fiber-api](templates/go-fiber-api/TEMPLATE.md) | Go + Fiber | Fastest Go |

### Java
| Template | Tech Stack | When to Use |
|----------|------------|-------------|
| [spring-boot-api](templates/spring-boot-api/TEMPLATE.md) | Spring Boot 3 + JPA | Enterprise API |

### .NET
| Template | Tech Stack | When to Use |
|----------|------------|-------------|
| [aspnet-core-api](templates/aspnet-core-api/TEMPLATE.md) | .NET 8 + Minimal APIs | Modern .NET API |

### PHP
| Template | Tech Stack | When to Use |
|----------|------------|-------------|
| [laravel-app](templates/laravel-app/TEMPLATE.md) | Laravel 11 | Full PHP app |
| [rails-app](templates/rails-app/TEMPLATE.md) | Rails 7 + Hotwire | Full Ruby app |

### Rust
| Template | Tech Stack | When to Use |
|----------|------------|-------------|
| [rust-axum-api](templates/rust-axum-api/TEMPLATE.md) | Rust + Axum | High-perf API |

### Swift
| Template | Tech Stack | When to Use |
|----------|------------|-------------|
| [swiftui-app](templates/swiftui-app/TEMPLATE.md) | Swift + SwiftUI | iOS App |

### Kotlin/Android
| Template | Tech Stack | When to Use |
|----------|------------|-------------|
| [kotlin-android](templates/kotlin-android/TEMPLATE.md) | Kotlin + Compose | Android App |

---

## 🔗 Related Agents

| Agent | Role |
|-------|------|
| `project-planner` | Task breakdown, dependency graph |
| `frontend-specialist` | UI components, pages |
| `backend-specialist` | API, business logic |
| `database-architect` | Schema, migrations |
| `devops-engineer` | Deployment, preview |

---

## Usage Example

```
User: "Make an Instagram clone with photo sharing and likes"

App Builder Process:
1. Project type: Social Media App
2. Tech stack: Next.js + Prisma + Cloudinary + Clerk
3. Create plan:
   ├─ Database schema (users, posts, likes, follows)
   ├─ API routes (12 endpoints)
   ├─ Pages (feed, profile, upload)
   └─ Components (PostCard, Feed, LikeButton)
4. Coordinate agents
5. Report progress
6. Start preview
```
