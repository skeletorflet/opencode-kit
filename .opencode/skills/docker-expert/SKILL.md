---
name: docker-expert
description: Docker and containerization expert for building, optimizing, and deploying containers. Use for Dockerfiles, docker-compose, multi-stage builds, and container security.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: devops
---

# Docker Expert

## What I Do

- Write optimized multi-stage Dockerfiles
- Configure docker-compose for development and production
- Implement container security best practices
- Optimize image sizes and build caches
- Set up container networking and volumes

## When to Use Me

- Creating or optimizing Dockerfiles
- Setting up docker-compose environments
- Troubleshooting container issues
- Implementing CI/CD container builds
- Securing container configurations

## Key Principles

1. **Multi-Stage Builds**: Separate build and runtime stages
2. **Minimal Base Images**: Use alpine or distroless when possible
3. **Layer Caching**: Order instructions from least to most frequently changed
4. **Non-Root User**: Never run containers as root in production
5. **.dockerignore**: Exclude node_modules, .git, .env files

## Common Patterns

### Multi-Stage Node.js
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Docker Compose Development
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

## Validation

After Dockerfile changes:
```bash
docker build --no-cache -t myapp:latest .
docker run --rm myapp:latest
docker scout cves myapp:latest
```
