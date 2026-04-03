---
name: monorepo-patterns
description: Monorepo setup and patterns. Turborepo, Nx, pnpm workspaces, shared packages, build caching, versioning.
---

# Monorepo Patterns

> One repo, multiple packages. Share code, maintain boundaries.

---

## 1. When to Use Monorepos

```
✅ Good fit:
├── Multiple apps sharing business logic
├── Design system used by multiple products
├── Full-stack: frontend + backend + shared types
├── Microservices with shared utilities
└── Library + consumer app in same codebase

❌ Poor fit:
├── Unrelated projects
├── Very different release cadences
└── Team has no tooling experience
```

---

## 2. Tool Selection

| Tool | Strengths | Best For |
|------|-----------|---------|
| **Turborepo** | Simple, fast, good DX | JS/TS apps (Next.js, React) |
| **Nx** | Plugins, advanced caching | Large enterprise |
| **pnpm workspaces** | Minimal, manual | When you need full control |
| **Lerna + pnpm** | Library versioning | Publishing packages to npm |
| **Bazel** | Maximum scale | Google-scale |

---

## 3. Turborepo Structure

```
my-monorepo/
├── apps/
│   ├── web/              # Next.js app
│   ├── mobile/           # React Native
│   └── docs/             # Documentation site
├── packages/
│   ├── ui/               # Shared React components
│   ├── config/           # ESLint, TS, Tailwind configs
│   ├── types/            # Shared TypeScript types
│   ├── utils/            # Shared utilities
│   └── api-client/       # Generated API client
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 4. Configuration Files

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

```json
// packages/ui/package.json
{
  "name": "@myapp/ui",
  "version": "0.0.1",
  "main": "./src/index.tsx",
  "types": "./src/index.tsx",
  "exports": {
    ".": "./src/index.tsx"
  },
  "devDependencies": {
    "react": "^19.0.0",
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  }
}
```

---

## 5. Shared Package Patterns

```tsx
// packages/ui/src/index.tsx
export { Button } from "./Button";
export { Input } from "./Input";
export { Modal } from "./Modal";
export type { ButtonProps, InputProps } from "./types";

// packages/types/src/index.ts
export type { User, Order, Product } from "./models";
export type { ApiResponse, PaginatedResponse } from "./api";

// packages/config/eslint-config/index.js
module.exports = {
  extends: ["next", "turbo", "prettier"],
  rules: { "no-console": "warn" },
};
```

---

## 6. Dependency Management

```bash
# Install package in specific app
pnpm --filter @myapp/web add axios

# Install in root (devtools)
pnpm add -w -D prettier

# Install shared package in app
pnpm --filter @myapp/web add @myapp/ui@workspace:*

# Run command in specific package
pnpm --filter @myapp/web dev

# Run in all packages
pnpm -r build
turbo build
```

---

## 7. Remote Caching (Turborepo Cloud)

```bash
# Login to Turbo Remote Cache
turbo login
turbo link  # Link to Vercel Remote Cache (free)

# Or self-host with Ducktape Cache / Turborepo Remote Cache server
turbo.json:
{
  "remoteCache": { "enabled": true }
}
```

---

## 8. Versioning Strategies

| Strategy | Tool | When |
|----------|------|------|
| **Lockstep** | All at same version | Internal apps |
| **Independent** | Each package versions separately | Published libraries |
| **Fixed + independent** | Some locked, some free | Mixed |

```bash
# Changesets (for publishing packages)
pnpm add -Dw @changesets/cli
pnpm changeset  # Add change description
pnpm changeset version  # Bump versions
pnpm changeset publish  # Publish to npm
```

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Import across apps directly | Use shared packages |
| Circular dependencies | One-direction dependency graph |
| Ignore build order | Use `dependsOn: ["^build"]` |
| Local packages with `file:` | Use `workspace:*` |
| Global node_modules | pnpm strict isolation |
