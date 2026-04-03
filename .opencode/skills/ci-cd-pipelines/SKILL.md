---
name: ci-cd-pipelines
description: CI/CD pipeline patterns. GitHub Actions, GitLab CI, Docker builds, testing, deployment stages, secrets management.
---

# CI/CD Pipelines

> Automate the path from code to production. Make it fast, safe, repeatable.

---

## 1. Pipeline Stages

```
Code Push
    ↓
Lint + Type Check (< 1 min)
    ↓
Unit Tests (< 3 min)
    ↓
Build (< 5 min)
    ↓
Integration Tests (< 10 min)
    ↓
Docker Build + Push
    ↓
Deploy to Staging
    ↓
E2E Tests (Smoke)
    ↓
[Manual Gate] → Deploy to Production
    ↓
Health Check + Monitor
```

---

## 2. GitHub Actions — Full Example

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: "20"
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Unit tests
        run: npm run test:unit -- --coverage

      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build-and-push:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.event_name == \'push\'
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=sha-
            type=ref,event=branch
            type=semver,pattern={{version}}

      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: staging
    if: github.ref == \'refs/heads/develop\'
    steps:
      - name: Deploy to staging
        run: |
          # kubectl set image or helm upgrade or fly deploy
          echo "Deploying ${{ steps.meta.outputs.version }}"

  deploy-production:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    if: github.ref == \'refs/heads/main\'
    steps:
      - name: Deploy to production
        run: echo "Deploy to prod"
```

---

## 3. Caching Strategies

```yaml
# Node.js dependencies
- uses: actions/setup-node@v4
  with:
    cache: "npm"  # or "yarn" or "pnpm"

# Docker layers
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max

# Custom cache
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles(\'requirements.txt\') }}
```

---

## 4. Matrix Testing

```yaml
strategy:
  matrix:
    node: [18, 20, 22]
    os: [ubuntu-latest, windows-latest, macos-latest]

runs-on: ${{ matrix.os }}
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node }}
```

---

## 5. Secrets Management

```yaml
# NEVER hardcode. Use GitHub Secrets or environment-specific secrets.
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}

# Use environments for staging vs production secrets
environment: production
# → uses environment-specific secrets
```

---

## 6. PR Checks

```yaml
# Require before merge:
- lint
- tests
- build
- Preview deployment URL in PR comment

# GitHub Branch Protection Rules:
# ✅ Require status checks to pass
# ✅ Require up-to-date branches
# ✅ Require review from code owners
# ✅ Dismiss stale reviews on new commits
```

---

## 7. Deployment Strategies

| Strategy | Description | Risk |
|----------|-------------|------|
| **Big bang** | All at once | High |
| **Rolling** | Replace instances gradually | Medium |
| **Blue/Green** | Switch traffic between two envs | Low |
| **Canary** | Route % of traffic to new version | Low |
| **Feature flags** | Deploy dark, release gradually | Lowest |

---

## 8. Pipeline Speed Targets

| Stage | Target | If Exceeded |
|-------|--------|------------|
| Lint + types | < 1 min | Cache, parallelize |
| Unit tests | < 3 min | Shard tests |
| Build | < 5 min | Layer caching |
| Full pipeline | < 15 min | Parallelize jobs |
| Production deploy | < 5 min | Optimize deploy step |
