---
name: clean-code
description: Coding standards that adapt to each language's conventions. 
             No opinionated rules - follows language-specific standards.
allowed-tools: Read, Write, Edit, Glob, Grep
version: 3.0
priority: CRITICAL
---

# Clean Code - Agnóstico por Lenguaje

> **"Follow the conventions of the language you're using."**
> **IMPORTANT:** This skill auto-detects the project language and adapts conventions accordingly.

---

## 🔍 Auto-Detección de Lenguaje

```
Detecta automáticamente el lenguaje del proyecto:
├── .py → Python conventions (PEP 8)
├── .java → Java conventions (Oracle)
├── .cs → C# conventions (Microsoft .NET)
├── .go → Go conventions (Go Code Review)
├── .rs → Rust conventions (Rust API Guidelines)
├── .rb → Ruby conventions (Ruby Style Guide)
├── .ts/.js → JS/TS conventions (Airbnb/Google)
├── .php → PHP conventions (PSR-12)
├── .swift → Swift conventions (Apple)
├── .kt/.kotlin → Kotlin conventions (JetBrains)
└── .cpp/.c/.h → C/C++ conventions
```

> **Rule:** If conventions already exist in the project, USE THEM. Don't override.

---

## 📋 Convenciones por Lenguaje

### Python → snake_case (PEP 8)

```python
# Functions: snake_case
def get_user_by_id(user_id: int) -> Optional[User]:
    max_connections = 100  # Variables: snake_case
    MAX_RETRY_COUNT = 3    # Constants: UPPER_SNAKE_CASE
    user_list: list[User]  # Type hints: snake_case
    return user_id

# Classes: PascalCase
class UserService:
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        pass

# Files: snake_case
user_service.py
auth_controller.py
```

### C# → PascalCase (Microsoft .NET)

```csharp
// Everything: PascalCase
public class UserService
{
    public int MaxConnections { get; set; }
    public static int MaxRetryCount = 3;
    
    public User GetUserById(int userId)
    {
        var userList = new List<User>();
        return userId;
    }
}

// Files: PascalCase
UserService.cs
AuthController.cs
```

### Go → PascalCase (exported), snake_case (internal)

```go
// Exported (public): PascalCase
func GetUserByID(userID int) (*User, error) {
    maxConnections := 100  // Private: snake_case
    maxRetryCount := 3     // Private constants: snake_case
    
    userList := []User{}   // Variables: snake_case
    
    return &User{ID: userID}, nil
}

// Files: snake_case
user_service.go
auth_controller.go
```

### Rust → snake_case (Rust API Guidelines)

```rust
// Functions: snake_case
fn get_user_by_id(user_id: i32) -> Option<User> {
    let max_connections = 100;  // Variables: snake_case
    const MAX_RETRY_COUNT: i32 = 3;  // Constants: UPPER_SNAKE_CASE
    
    let user_list: Vec<User> = Vec::new();
    
    user_id
}

// Structs/Enums: PascalCase
struct UserService;
enum UserStatus {
    Active,
    Inactive,
}

// Files: snake_case
user_service.rs
auth_controller.rs
```

### JavaScript/TypeScript → camelCase (Airbnb/Google)

```typescript
// Functions/Variables: camelCase
function getUserById(userId: number): User | undefined {
  const maxConnections = 100;
  const MAX_RETRY_COUNT = 3;  // Constants: UPPER_SNAKE_CASE
  
  const userList: User[] = [];
  
  return userId;
}

// Classes/Types: PascalCase
class UserService {
  getUserById(userId: number): User | undefined {
    return userId;
  }
}

// Files: kebab-case (sometimes PascalCase)
user-service.ts
auth-controller.ts
```

### Ruby → snake_case

```ruby
# Methods: snake_case
def get_user_by_id(user_id)
  max_connections = 100
  MAX_RETRY_COUNT = 3
  
  user_list = []
  
  user_id
end

# Classes: PascalCase
class UserService
  def get_user_by_id(user_id)
    # ...
  end
end

# Files: snake_case
user_service.rb
auth_controller.rb
```

### PHP → camelCase o snake_case (depende del framework)

```php
// Laravel (camelCase)
public function getUserById($userId): ?User 
{
    $maxConnections = 100;
    $this->maxRetryCount = 3;
}

// Symfony (snake_case)
public function get_user_by_id(int $userId): ?User
{
    $max_connections = 100;
    $this->max_retry_count = 3;
}

// Classes: PascalCase
class UserService
{
    public function getUserById(int $userId): ?User
    {
        // ...
    }
}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
```

### Swift → camelCase

```swift
// Functions/Variables: camelCase
func getUserById(_ userId: Int) -> User? {
    let maxConnections = 100
    let MAX_RETRY_COUNT = 3  // Constants también UPPER_SNAKE_CASE
    
    var userList: [User] = []
    
    return userId
}

// Classes/Structs: PascalCase
class UserService {
    func getUserById(_ userId: Int) -> User? {
        return userId
    }
}

// Files: snake_case
user_service.swift
auth_controller.swift
```

### Kotlin → camelCase

```kotlin
// Functions/Variables: camelCase
fun getUserById(userId: Int): User? {
    val maxConnections = 100
    val MAX_RETRY_COUNT = 3  // Constants pueden ser UPPER_SNAKE_CASE
    
    val userList: List<User> = emptyList()
    
    return userId
}

// Classes: PascalCase
class UserService {
    fun getUserById(userId: Int): User? {
        return userId
    }
}

// Files: kebab-case (opcional)
user-service.kt
auth-controller.kt
```

---

## 🔴 Core Principles (LANGUAGE-AGNOSTIC)

| Principle | Rule | Apply to ALL languages |
|-----------|------|------------------------|
| **SRP** | Single Responsibility - each function/class does ONE thing | ✅ |
| **DRY** | Don't Repeat Yourself - extract duplicates, reuse | ✅ |
| **KISS** | Keep It Simple - simplest solution that works | ✅ |
| **YAGNI** | You Aren't Gonna Need It - don't build unused features | ✅ |
| **Boy Scout** | Leave code cleaner than you found it | ✅ |

---

## 🚫 Anti-Patterns (LANGUAGE-AGNOSTIC)

| ❌ Pattern | ✅ Fix | Language Context |
|-----------|--------|------------------|
| Using wrong naming convention | Follow language conventions | Check table above |
| Comment every line | Delete obvious comments | All |
| Helper for one-liner | Inline the code | All |
| utils file with 1 function | Put code where used | All |
| Magic numbers | Named constants | All |
| God functions | Split by responsibility | All |
| Deep nesting | Guard clauses / early returns | All |

---

## 🔴 Before Editing ANY File (THINK FIRST!)

**Before changing a file, ask yourself:**

| Question | Why |
|----------|-----|
| **What imports this file?** | They might break |
| **What does this file import?** | Interface changes |
| **What tests cover this?** | Tests might fail |
| **What language is this?** | Use correct conventions |

**Quick Check:**
```
File to edit: UserService.cs (C#)
└── Conventions: PascalCase (NOT snake_case)
└── Who imports this? → UserController.cs, AuthController.cs
└── Do they need changes too? → Check function signatures
```

> 🔴 **Rule:** Edit the file + all dependent files in the SAME task.
> 🔴 **Never leave broken imports or missing updates.**
> 🔴 **ALWAYS use the correct naming convention for the language.**

---

## Summary by Language

| Language | Methods/Variables | Constants | Classes | Files |
|----------|-------------------|-----------|---------|-------|
| **Python** | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **C#/.NET** | PascalCase | PascalCase | PascalCase | PascalCase |
| **Go** | PascalCase (export), snake_case (private) | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **Rust** | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **Ruby** | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **JavaScript** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **TypeScript** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **PHP** | camelCase o snake_case | UPPER_SNAKE_CASE | PascalCase | kebab/snake |
| **Swift** | camelCase | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **Kotlin** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **Java** | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |

---

## 🔴 Self-Check Before Completing (MANDATORY)

**Before saying "task complete", verify:**

| Check | Question |
|-------|----------|
| ✅ **Goal met?** | Did I do exactly what user asked? |
| ✅ **Files edited?** | Did I modify all necessary files? |
| ✅ **Code works?** | Did I test/verify the change? |
| ✅ **Conventions correct?** | Does the naming follow the language's style? |
| ✅ **No errors?** | Lint and types pass? |

> 🔴 **Rule:** If ANY check fails, fix it before completing.
> 🔴 **IMPORTANT:** Python code with camelCase methods = INCORRECT. C# code with snake_case = INCORRECT.

---

## 🔴 Verification Scripts (MANDATORY)

> 🔴 **CRITICAL:** Each agent runs ONLY their own skill's scripts after completing work.

### Agent → Script Mapping

| Agent | Script | Command |
|-------|--------|---------|
| **frontend-specialist** | UX Audit | `python .agent/skills/frontend-design/scripts/ux_audit.py .` |
| **frontend-specialist** | A11y Check | `python .agent/skills/frontend-design/scripts/accessibility_checker.py .` |
| **backend-specialist** | API Validator | `python .agent/skills/api-patterns/scripts/api_validator.py .` |
| **mobile-developer** | Mobile Audit | `python .agent/skills/mobile-design/scripts/mobile_audit.py .` |
| **database-architect** | Schema Validate | `python .agent/skills/database-design/scripts/schema_validator.py .` |
| **security-auditor** | Security Scan | `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` |
| **test-engineer** | Test Runner | `python .agent/skills/testing-patterns/scripts/test_runner.py .` |
| **Any agent** | Multi-Lang Lint | `python .agent/skills/lint-and-validate/scripts/lint_runner.py .` |

> ❌ **WRONG:** `test-engineer` running `ux_audit.py`
> ✅ **CORRECT:** `frontend-specialist` running `ux_audit.py`

---

## 📖 Reference Tables

### Language Detection by Extension

| Extension | Language | Primary Tool |
|-----------|----------|--------------|
| `.py` | Python | Ruff, Black, mypy |
| `.java` | Java | Checkstyle, SpotBugs |
| `.cs` | .NET/C# | dotnet format, StyleCop |
| `.go` | Go | go fmt, golangci-lint |
| `.rs` | Rust | cargo clippy, cargo fmt |
| `.rb` | Ruby | RuboCop |
| `.ts/.tsx` | TypeScript | ESLint, tsc |
| `.js/.jsx` | JavaScript | ESLint, Prettier |
| `.php` | PHP | PHP-CS-Fixer, PHPStan |
| `.swift` | Swift | SwiftLint |
| `.kt/.kotlin` | Kotlin | ktlint |
| `.cpp/.cc/.cxx` | C++ | clang-format, cppcheck |

---

> **Remember:** The same coding principle (DRY, KISS, SRP) applies to ALL languages. 
> Only the **syntax and conventions** differ. Adapt accordingly.