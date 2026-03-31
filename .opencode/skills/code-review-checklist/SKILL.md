---
name: code-review-checklist
description: Language-agnostic code review guidelines. Adapts conventions to each language's standards.
---

# Code Review Checklist - Agnóstico por Lenguaje

> **IMPORTANT:** This checklist adapts to the language being reviewed.
> **Rule:** Follow the conventions of the LANGUAGE, not JavaScript/Java defaults.

---

## 🔍 Auto-Detección de Lenguaje

```
Antes de hacer code review, detecta el lenguaje:
├── .py → Python (PEP 8 conventions)
├── .java → Java (Oracle conventions)
├── .cs → C# (Microsoft .NET conventions)
├── .go → Go (Go Code Review Comments)
├── .rs → Rust (Rust API Guidelines)
├── .rb → Ruby (Ruby Style Guide)
├── .ts/.js → JS/TS (Airbnb/Google)
├── .php → PHP (PSR-12)
├── .swift → Swift (Apple conventions)
└── .kt → Kotlin (JetBrains conventions)
```

---

## 📋 Quick Review Checklist (Adaptado por Lenguaje)

### Correctness (通用的)

- [ ] Code does what it's supposed to do
- [ ] Edge cases handled
- [ ] Error handling in place
- [ ] No obvious bugs
- [ ] Logic is sound

### Security (通用的)

- [ ] Input validated and sanitized
- [ ] No SQL/NoSQL injection vulnerabilities
- [ ] No XSS or CSRF vulnerabilities
- [ ] No hardcoded secrets or credentials
- [ ] **AI-Specific:** Protection against Prompt Injection (if applicable)
- [ ] **AI-Specific:** Outputs sanitized before critical sinks

### Performance (adaptado por lenguaje)

- [ ] No N+1 queries (check ORM patterns)
- [ ] No unnecessary loops
- [ ] Appropriate caching
- [ ] Memory usage reasonable

---

## 🔴 Naming Conventions by Language

| ❌ WRONG (assume wrong convention) | ✅ CORRECT (follows language) |
|-----------------------------------|------------------------------|
| camelCase in Python | snake_case |
| snake_case in C# | PascalCase |
| snake_case in Go (exported) | PascalCase for exported |
| camelCase in Rust | snake_case |

### Python Review

```python
# ❌ WRONG
def GetUserById(userId):
    MAX_CONNECTIONS = 100
    user_list = []

# ✅ CORRECT (PEP 8)
def get_user_by_id(user_id: int) -> Optional[User]:
    MAX_CONNECTIONS = 100
    user_list: List[User] = []
```

### C# Review

```csharp
// ❌ WRONG
public class user_service {
    public int max_connections { get; set; }
    public User get_user_by_id(int user_id) { ... }
}

// ✅ CORRECT (.NET conventions)
public class UserService
{
    public int MaxConnections { get; set; }
    public User GetUserById(int userId) { ... }
}
```

### Go Review

```go
// ❌ WRONG (exporting snake_case)
func get_user_by_id(user_id int) (*User, error) {
    max_connections := 100
    return get_user_by_id(user_id)
}

// ✅ CORRECT (Go conventions)
func GetUserByID(userID int) (*User, error) {
    maxConnections := 100
    return userID, nil
}
```

---

## 📋 Code Quality (Language-Agnostic)

### DRY - No Repeated Code
- [ ] Duplicated logic extracted?
- [ ] Reusable functions/modules?

### SOLID Principles (Aplicables a todos)
- [ ] Single Responsibility?
- [ ] Open/Closed?
- [ ] Liskov Substitution?
- [ ] Interface Segregation?
- [ ] Dependency Inversion?

### Small Functions
- [ ] Functions under 20-30 lines?
- [ ] One level of abstraction?
- [ ] Few arguments (max 3-4)?

### Error Handling
- [ ] Exceptions handled?
- [ ] Failures logged?
- [ ] User-friendly error messages?

---

## 🔴 Anti-Patterns to Flag (Multi-Language)

### Magic Numbers (All Languages)

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `if status == 3` | Named constant |
| `sleep(5000)` | Named constant with units |

### Deep Nesting (All Languages)

```typescript
// ❌ WRONG
if (a) {
  if (b) {
    if (c) {
      doSomething();
    }
  }
}

// ✅ CORRECT (early return)
if (!a) return;
if (!b) return;
if (!c) return;
doSomething();
```

### Long Functions (All Languages)

| ❌ | ✅ |
|---|---|
| 100+ lines | Split into smaller functions |

### Any Type (TypeScript/JavaScript specific)

```typescript
// ❌ WRONG
const data: any = ...

// ✅ CORRECT
const data: UserData = ...
```

### Type Safety Issues

```python
# Python: ❌ WRONG (no type hints on public API)
def get_user(id):
    return id

# Python: ✅ CORRECT
def get_user(user_id: int) -> Optional[User]:
    return user_id
```

```rust
// Rust: ❌ WRONG 
fn get_user(id) -> Option<User> {
    Some(User { id })
}

// Rust: ✅ CORRECT
fn get_user(user_id: i32) -> Option<User> {
    Some(User { id: user_id })
}
```

---

## 🛡️ Security Checklist (Language-Agnostic)

```markdown
### Input Validation
- [ ] All inputs validated?
- [ ] Sanitized before use?

### Authentication/Authorization
- [ ] Proper auth checks?
- [ ] No auth bypasses?

### Secrets
- [ ] No hardcoded API keys?
- [ ] No passwords in code?
- [ ] Environment variables used?

### SQL Injection
- [ ] Parameterized queries?
- [ ] ORM used properly?
- [ ] No string concatenation in queries?

### XSS
- [ ] Output encoding?
- [ ] Sanitized HTML?
- [ ] CSRF tokens?
```

---

## 🧪 Testing Review

| Check | Pregunta |
|-------|----------|
| [ ] Unit tests added for new code? | Coverage adequate? |
| [ ] Edge cases tested? | Empty, null, large values? |
| [ ] Tests readable? | Clear intent? |
| [ ] Tests isolated? | No dependencies on external state? |

---

## 🔍 Language-Specific Checks

### Python

| Check | What to look for |
|-------|------------------|
| Type hints | Public functions should have type hints |
| PEP 8 | Use Black/isort for formatting |
| Exceptions | Catch specific exceptions, not bare except |

### C# / .NET

| Check | What to look for |
|-------|------------------|
| PascalCase | All public members PascalCase |
| var usage | Use var when type is obvious |
| LINQ | Prefer LINQ over loops for queries |

### Go

| Check | What to look for |
|-------|------------------|
| Exported/Unexported | PascalCase = exported, snake_case = private |
| Error handling | Always check errors |
| Context usage | Pass context for cancellation |

### Rust

| Check | What to look for |
|-------|------------------|
| Ownership | No unnecessary clones |
| Error handling | Use Result for fallible functions |
| lifetimes | Explicit lifetimes where needed |

---

## 📝 Review Comments Guide

```markdown
// Bloqueadores importantes - 🔴
🔴 BLOCKING: SQL injection vulnerability here

// Sugerencias importantes - 🟡
🟡 SUGGESTION: Consider using useMemo for performance

// Nits menores - 🟢
🟢 NIT: Prefer const over let for immutable variable

// Preguntas - ❓
❓ QUESTION: What happens if user is null here?

// Convenciones de lenguaje - ⚙️
⚙️ CONVENTION: snake_case is used for functions in Python, not camelCase
```

---

## ✅ Review Complete Checklist

| Check | Question |
|-------|----------|
| ✅ | Naming follows language conventions? |
| ✅ | Security issues addressed? |
| ✅ | Error handling in place? |
| ✅ | Tests added/updated? |
| ✅ | No obvious bugs? |
| ✅ | Code is maintainable? |

---

> **Remember:** A good code review adapts to the language's conventions.
> Don't enforce JavaScript conventions on Python code, or vice versa.
> **Follow the idioms of the language being reviewed.**