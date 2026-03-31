---
name: go-patterns
description: Go (Golang) development principles and decision-making. 
             Modern Go 1.22+ patterns, concurrency, project structure, API design.
---

# Go Patterns - Modern Go 1.22+

> Go development principles and decision-making.
> **Learn to THINK, not copy-paste patterns.**

---

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles** for Go development.

- ASK user for use case (API, CLI, Microservice, Worker)
- Choose Go idioms, not Java/Python patterns
- Don't assume async if not needed (Go is already concurrent)

---

## 1. Framework Selection (Go)

### Decision Tree

```
What are you building?
│
├── HTTP API / REST
│   ├── Gin (most popular, fast)
│   ├── Chi (minimalist, Go idioms)
│   ├── Fiber (Echo-compatible, fast)
│   └── Echo (full-featured)
│
├── gRPC / Microservices
│   ├── gRPC (Google)
│   └── Connect (Buf)
│
├── CLI Tool
│   ├── Cobra (complete CLI framework)
│   ├── Kingpin (flags only)
│   └── Cli (simple)
│
├── Background Worker
│   └── Asynq (Redis-based)
│   └── Machinery (Celery-like)
│
└── Full-stack Web
    │   └── Go doesn't do full-stack; use templ + HTMX
    └── Go templates + HTMX
```

### Comparison Table

| Factor | Gin | Chi | Echo | Fiber |
|--------|-----|-----|------|-------|
| **Performance** | Very High | High | High | Very High |
| **Routing** | Tree-based | Middleware | Flexible | Express-like |
| **Learning Curve** | Low | Low | Low | Medium |
| **Middleware** | Many available | Chain-based | Rich | Many |
| **Best For** | Production APIs | Clean APIs | Full-featured | Speed |

---

## 2. Go Modules & Project Structure

### Standard Module Structure

```
myproject/
├── go.mod
├── go.sum
├── cmd/
│   └── myapp/
│       └── main.go
├── internal/
│   ├── handler/
│   ├── service/
│   ├── repository/
│   └── middleware/
├── pkg/
│   └── utils/
├── api/
│   └── openapi.yaml
├── configs/
├── migrations/
└── tests/
```

### Go 1.22+ Routing Patterns

```go
// New Go 1.22 routing (built-in)
func SetupRoutes(r *http.ServeMux) {
    r.HandleFunc("GET /users", handler.ListUsers)
    r.HandleFunc("POST /users", handler.CreateUser)
    r.HandleFunc("GET /users/{id}", handler.GetUser)
    r.HandleFunc("PUT /users/{id}", handler.UpdateUser)
    r.HandleFunc("DELETE /users/{id}", handler.DeleteUser)
}
```

---

## 3. Concurrency Patterns

### Go Idioms vs Other Languages

```
Go's philosophy (DON'T):
├── Don't use goroutines when not needed
├── Don't use channels for simple syncs (use sync.Mutex)
├── Don't over-engineer with patterns from other languages
└── Don't abuse "go run" for everything

Go's philosophy (DO):
├── Use goroutines for I/O-bound operations
├── Use channels for communication, not shared memory
├── Keep it simple - clear > clever
└── Let Go handle the concurrency, don't fight it
```

### Common Patterns

```go
// WaitGroup for multiple goroutines
var wg sync.WaitGroup
for _, task := range tasks {
    wg.Add(1)
    go func(t Task) {
        defer wg.Done()
        process(t)
    }(task)
}
wg.Wait()

// Context for cancellation
func Handler(w http.ResponseWriter, r *http.Request) {
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()
    
    result, err := doWork(ctx, r.URL.Query())
    if err != nil {
        http.Error(w, err.Error(), 500)
        return
    }
    json.NewEncoder(w).Encode(result)
}

// Channel for streaming
func StreamUsers(w http.ResponseWriter, r *http.Request) {
    flusher, ok := w.(http.Flusher)
    if !ok {
        return
    }
    
    w.Header().Set("Content-Type", "text/event-stream")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")
    
    for user := range userChan {
        fmt.Fprintf(w, "data: %s\n\n", user)
        flusher.Flush()
    }
}
```

---

## 4. Error Handling

### Go Idiomatic Error Handling

```go
// DON'T: Wrap everything with large stack traces
// DO: Simple, actionable errors

// Pattern 1: Sentinel errors
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
)

// Pattern 2: Custom error types
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

// Pattern 3: Error wrapping (Go 1.13+)
if err != nil {
    return fmt.Errorf("failed to get user %d: %w", userID, err)
}

// Using errors.Is / errors.As
if errors.Is(err, ErrNotFound) {
    // Handle not found
}
if errors.As(err, &validationErr) {
    // Handle validation error
}
```

---

## 5. Database Patterns

### ORMs & SQL

| Solution | Best For | Notes |
|----------|----------|-------|
| **GORM** | Full ORM | Rich features, popular |
| **Ent** | Type-safe queries | Code generation, GraphQL |
| **sqlx** | Raw SQL + struct mapping | Lightweight, fast |
| **Squirrel** | Query builder | Flexible |
| **Kitex** | gRPC + DB | When using gRPC |

### Pattern: Repository

```go
type UserRepository interface {
    FindByID(ctx context.Context, id int) (*User, error)
    FindAll(ctx context.Context) ([]User, error)
    Create(ctx context.Context, user *User) error
    Update(ctx context.Context, user *User) error
    Delete(ctx context.Context, id int) error
}

type PostgresUserRepo struct {
    db *sqlx.DB
}

func (r *PostgresUserRepo) FindByID(ctx context.Context, id int) (*User, error) {
    var user User
    err := r.db.GetContext(ctx, &user, "SELECT * FROM users WHERE id = $1", id)
    if errors.Is(err, sql.ErrNoRows) {
        return nil, ErrNotFound
    }
    return &user, err
}
```

---

## 6. Testing Patterns

### Test Structure

```go
// Table-driven tests
func TestCalculateArea(t *testing.T) {
    tests := []struct {
        name     string
        width    float64
        height   float64
        expected float64
    }{
        {"square", 10, 10, 100},
        {"rectangle", 5, 10, 50},
        {"zero", 0, 10, 0},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := CalculateArea(tt.width, tt.height)
            if result != tt.expected {
                t.Errorf("expected %.2f, got %.2f", tt.expected, result)
            }
        })
    }
}

// Mocking interfaces
type UserRepository interface {
    FindByID(ctx context.Context, id int) (*User, error)
}

type MockUserRepo struct {
    mock.Mock
}

func (m *MockUserRepo) FindByID(ctx context.Context, id int) (*User, error) {
    args := m.Called(ctx, id)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*User), args.Error(1)
}
```

### Testing Tools

| Tool | Purpose |
|------|---------|
| `testify` | Assertions, mocking |
| `gocheck` | More testing features |
| `ginkgo` | BDD testing |
| `goconvey` | BDD with assertion sugar |
| `monkey` | Runtime patching (for tough cases) |

---

## 7. Configuration

### Best Practices

```go
// Use Viper for config
import "github.com/spf13/viper"

func LoadConfig() (*Config, error) {
    viper.SetConfigName("config")
    viper.SetConfigType("yaml")
    viper.AddConfigPath(".")
    viper.AddConfigPath("/etc/app/")
    
    if err := viper.ReadInConfig(); err != nil {
        return nil, err
    }
    
    var config Config
    if err := viper.Unmarshal(&config); err != nil {
        return nil, err
    }
    return &config, nil
}

// Or use standard library for simple cases
type Config struct {
    DatabaseURL string `env:"DATABASE_URL"`
    Port        string `env:"PORT" default:"8080"`
}
```

---

## 8. Middleware Patterns

### HTTP Middleware

```go
// Function middleware
func Logger(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// Chain example
r := chi.NewRouter()
r.Use(Logger)
r.Use(Recovery)
r.Use(Auth)
r.Route("/api", func(r chi.Router) {
    r.Use(RateLimit)
    r.Mount("/users", users.Routes())
})
```

---

## 9. Decision Checklist

Before implementing:

- [ ] **Chosen right HTTP framework for use case?**
- [ ] **Go idioms used (not Java/Python patterns)?**
- [ ] **Error handling is idiomatic?**
- [ ] **Repository pattern for DB access?**
- [ ] **Context used for timeouts/cancellation?**
- [ ] **Proper concurrency (not over-engineered)?**
- [ ] **Testing with table-driven tests?**

---

## ❌ Anti-Patterns to Avoid

### ❌ DON'T:
- Use goroutines for CPU-bound work (use worker pool)
- Create custom mutex when sync package suffices
- Use frameworks when net/http is enough
- Skip error handling ("if err != nil { return }")
- Use global variables
- Panic for expected errors

### ✅ DO:
- Go 1.22+ routing with http.ServeMux
- Context for timeout/cancellation
- Interfaces for dependency injection
- Think about Go idioms, not other languages
- Keep it simple and clear

---

> **Remember:** Go is about simplicity and clarity.
> Don't bring patterns from Java/Python/Ruby.
> **Think in Go.**