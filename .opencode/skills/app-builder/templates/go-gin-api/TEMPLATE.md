---
name: go-gin-api
description: Go Gin REST API template principles. GORM, Validator, Go modules.
---
# Go Gin API Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Gin Gonic |
| Language | Go 1.22+ |
| ORM | GORM |
| Validator | Go Playground Validator |
| DI | Wire (or manual) |
| Migrations | GORM Migrate |
| Auth | JWT |

---

## Directory Structure

```
project-name/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── handler/
│   │   ├── auth_handler.go
│   │   └── user_handler.go
│   ├── middleware/
│   │   ├── auth_middleware.go
│   │   └── logger_middleware.go
│   ├── model/
│   │   ├── user.go
│   │   └── post.go
│   ├── repository/
│   │   ├── user_repository.go
│   │   └── post_repository.go
│   ├── service/
│   │   ├── auth_service.go
│   │   ├── user_service.go
│   │   └── post_service.go
│   └── config/
│       └── config.go
├── api/
│   └── openapi.yaml
├── configs/
├── migrations/
├── scripts/
├── test/
│   ├── handler/
│   └── service/
├── go.mod
├── go.sum
└── Dockerfile
```

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Clean Architecture** | Separation of concerns (handler → service → repository) |
| **Dependency Injection** | Manual DI or Wire for Go |
| **Context** | Used for cancellation and timeouts |
| **Error Handling** | Wrapped errors with context |
| **Testing** | Table-driven tests with testify |

---

## API Structure

| Layer | Responsibility |
|-------|----------------|
| Handler | HTTP request/response handling |
| Middleware | Auth, logging, CORS |
| Service | Business logic |
| Repository | Data access layer |
| Model | Database entities |
| Config | Application configuration |

---

## Setup Steps

1. `go mod init github.com/username/project-name`
2. Create `go.mod` with dependencies:
   ```
   github.com/gin-gonic/gin v1.9.1
   gorm.io/gorm v1.25.0
   gorm.io/driver/postgres v1.5.5
   github.com/go-playground/validator/v10 v10.15.0
   github.com/google/wire v0.5.0
   ```
3. Create `.env` file for configuration
4. Run migrations: `go run migrations/migrate.go`
5. Start server: `go run ./cmd/server`

---

## Best Practices

- Use context.Context for all I/O operations
- Wrap errors with `%w` for proper error chaining
- Use struct tags for validation and ORM mapping
- Separate concerns with clean architecture
- Write table-driven tests for handlers
- Use environment variables for configuration
- Implement graceful shutdown with signal handling
- Use gofmt and golangci-lint for code quality