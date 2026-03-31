---
name: naming-conventions
description: Comprehensive naming conventions by programming language. 
             Auto-detects language and provides correct naming guidelines.
---

# Naming Conventions by Language

> **IMPORTANT:** Naming conventions vary by language. This skill provides the correct conventions for each language.
> **Rule:** Use the conventions of the LANGUAGE you're writing, not Java/JavaScript defaults.

---

## 🔍 Auto-Detección

```
Detecta el lenguaje del proyecto:
├── .py → Python (PEP 8)
├── .java → Java (Oracle)
├── .cs → C# (.NET)
├── .go → Go (Go Code Review)
├── .rs → Rust (Rust API)
├── .rb → Ruby
├── .js/.ts → JavaScript/TypeScript
├── .php → PHP (PSR)
├── .swift → Swift
├── .kt → Kotlin
└── .cpp/.c → C/C++
```

---

## 📋 Tabla de Convenciones

| Lenguaje | Métodos/Funciones | Variables | Constantes | Clases/Tipos | Archivos |
|----------|-------------------|-----------|------------|--------------|----------|
| **Python** | snake_case | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **C#** | PascalCase | PascalCase | PascalCase | PascalCase | PascalCase |
| **Go** | PascalCase (exp), snake_case (priv) | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **Rust** | snake_case | snake_case | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **JavaScript** | camelCase | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **TypeScript** | camelCase | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **Ruby** | snake_case | snake_case | UPPER_SNAKE_CASE |PascalCase | snake_case |
| **PHP** | camelCase/snake | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab/snake |
| **Swift** | camelCase | camelCase | UPPER_SNAKE_CASE | PascalCase | snake_case |
| **Kotlin** | camelCase | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **Java** | camelCase | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |
| **Scala** | camelCase | camelCase | UPPER_SNAKE_CASE | PascalCase | kebab-case |

---

## 🐍 Python (PEP 8)

```python
# Functions: snake_case
def get_user_by_id(user_id: int) -> Optional[User]:
    """Get user by ID."""
    pass

# Variables: snake_case
user_list = []
max_connections = 100

# Constants: UPPER_SNAKE_CASE
MAX_CONNECTIONS = 100
DEFAULT_TIMEOUT = 30

# Classes: PascalCase
class UserService:
    pass

# Enums: PascalCase
class UserStatus:
    ACTIVE = "active"
    INACTIVE = "inactive"

# Files: snake_case
user_service.py
auth_controller.py
```

### Tools para Python

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **Black** | Auto-formateo | `black .` |
| **isort** | Import sorting | `isort .` |
| **flake8** | Linting PEP 8 | `flake8 .` |
| **pylint** | Code analysis | `pylint .` |
| **mypy** | Type checking | `mypy .` |

---

## ⚡ C# (.NET Microsoft Conventions)

```csharp
// Methods: PascalCase
public User GetUserById(int userId)
{
    return _repository.GetById(userId);
}

// Properties: PascalCase
public int MaxConnections { get; set; }
public string UserName { get; set; }

// Variables (local): PascalCase
var userList = new List<User>();
var maxConnections = 100;

// Constants: PascalCase
public const int MaxConnections = 100;
public const string DefaultTimeout = "30s";

// Classes: PascalCase
public class UserService
{
    public class UserResponse
    {
    }
}

// Files: PascalCase
UserService.cs
AuthController.cs
```

### Links oficiales
- [Microsoft Naming Conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- [StyleCop](https://github.com/StyleCop/StyleCop/)

---

## 🔷 Go (Go Code Review Comments)

```go
// Exported functions (public): PascalCase
func GetUserByID(userID int) (*User, error) {
    // Exported: PascalCase
    UserList := []User{}     // Only for export
    return &User{ID: userID}, nil
}

// Unexported functions (private): snake_case
func get_user_by_id(user_id int) (*User, error) {
    user_list := []User{}    // Private: snake_case
    return nil, errors.New("not found")
}

// Variables: snake_case
userList := []User{}
maxConnections := 100

// Constants: UPPER_SNAKE_CASE
const MAX_CONNECTIONS = 100

// Types/Structs: PascalCase
type UserService struct{}
type User struct{}

// Files: snake_case
user_service.go
auth_controller.go
```

### Links oficiales
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- [Effective Go](https://go.dev/doc/effective_go#names)

---

## 🦀 Rust (Rust API Guidelines)

```rust
// Functions: snake_case
fn get_user_by_id(user_id: i32) -> Option<User> {
    let max_connections = 100;
    let user_list: Vec<User> = vec![];
    user_id
}

// Variables: snake_case
let user_list: Vec<User> = vec![];

// Constants: UPPER_SNAKE_CASE
const MAX_CONNECTIONS: i32 = 100;

// Structs/Enums: PascalCase
struct UserService;
enum UserStatus {
    Active,
    Inactive,
}

// Files: snake_case
user_service.rs
auth_controller.rs

// Modules: snake_case
mod user_service;
mod auth_controller {
    pub mod handlers;
}
```

### Links oficiales
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [Rust Style Guide](https://github.com/rust-dev-tools/fmt-rfcs)

---

## 📦 JavaScript (Airbnb Style)

```javascript
// Functions: camelCase
function getUserById(userId) {
  const maxConnections = 100;
  const userList = [];
  return userId;
}

// Variables: camelCase
let userList = [];
const maxConnections = 100;

// Constants (true, exported): UPPER_SNAKE_CASE
const MAX_CONNECTIONS = 100;
const DEFAULT_TIMEOUT = '30s';

// Arrow functions
const getUserById = (userId) => {
  return userId;
};

// Classes: PascalCase
class UserService {
  constructor() {
    this.maxConnections = 100;
  }
  
  getUserById(userId) {
    return userId;
  }
}

// Files: kebab-case or PascalCase (also accepted)
user-service.js
UserService.js (for components)
auth-controller.js
```

### Links oficiales
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)

---

## 🔵 TypeScript

```typescript
// Functions: camelCase
function getUserById(userId: number): User | undefined {
  const maxConnections: number = 100;
  const userList: User[] = [];
  return userId;
}

// Variables: camelCase
let userList: User[] = [];
const maxConnections: number = 100;

// Constants: UPPER_SNAKE_CASE
const MAX_CONNECTIONS = 100;

// Interfaces/Types: PascalCase
interface User {
  id: number;
  name: string;
}

type UserResponse = {
  data: User;
  error: null;
};

// Classes: PascalCase
class UserService {
  getUserById(userId: number): User | undefined {
    return userId;
  }
}

// Enums: PascalCase
enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

// Files: kebab-case
user-service.ts
auth-controller.ts
types.ts
```

---

## 💎 Ruby

```ruby
# Methods: snake_case
def get_user_by_id(user_id)
  max_connections = 100
  user_list = []
  user_id
end

# Variables: snake_case
user_list = []
max_connections = 100

# Constants: UPPER_SNAKE_CASE
MAX_CONNECTIONS = 100
DEFAULT_TIMEOUT = 30

# Classes: PascalCase
class UserService
  def get_user_by_id(user_id)
    # ...
  end
end

# Modules: PascalCase
module Api
  module V1
    class UsersController
    end
  end
end

# Files: snake_case
user_service.rb
auth_controller.rb
```

### Links oficiales
- [Ruby Style Guide](https://github.com/rubocop/ruby-style-guide)

---

## 🐘 PHP (PSR Standards)

```php
// Methods: camelCase (PSR-12)
public function getUserById(int $userId): ?User
{
    $maxConnections = 100;
    $this->maxRetryCount = 3;
    
    return $userId;
}

// Properties: camelCase
private $userList = [];
protected $maxConnections = 100;

// Constants: UPPER_SNAKE_CASE
const MAX_CONNECTIONS = 100;
const DEFAULT_TIMEOUT = 30;

// Classes: PascalCase
class UserService
{
    public function getUserById(int $userId): ?User
    {
        return $userId;
    }
}

// Interfaces: PascalCase + "Interface"
interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
}

// Traits: PascalCase + "Trait"
trait AuthenticationTrait
{
    // ...
}

// Files: kebab-case (PSR-4 autoloading accepts both)
user-service.php
auth-controller.php
```

### Links oficiales
- [PSR-12 Extended Coding Style](https://www.php-fig.org/psr/psr-12/)
- [PHP-FIG](https://www.php-fig.org/)

---

## 🏃 Swift (Apple Swift API Design)

```swift
// Functions: camelCase
func getUserById(_ userId: Int) -> User? {
    let maxConnections = 100
    let maxRetryCount = 3
    var userList: [User] = []
    return userId
}

// Variables/Constants: camelCase
var userList: [User] = []
let maxConnections = 100

// Type Properties: camelCase
static let maxRetryCount = 3

// Types/Classes/Structs: PascalCase
class UserService {
    struct User {
        let id: Int
    }
}

// Enums: PascalCase
enum UserStatus {
    case active
    case inactive
}

// Protocols: PascalCase + "Protocol" (optional)
protocol UserRepositoryProtocol {
    func findById(_ id: Int) -> User?
}

// Files: snake_case
user_service.swift
auth_controller.swift
```

### Links oficiales
- [Swift API Design Guidelines](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/swift chaper/APIDesign/)

---

## ☕ Kotlin (Kotlin Coding Conventions)

```kotlin
// Functions: camelCase
fun getUserById(userId: Int): User? {
    val maxConnections = 100
    val userList: List<User> = emptyList()
    return userId
}

// Properties: camelCase
val userList: List<User> = emptyList()
var maxConnections = 100

// Constants: UPPER_SNAKE_CASE (for vals in companion object)
companion object {
    const val MAX_CONNECTIONS = 100
    const val DEFAULT_TIMEOUT = 30
}

// Classes: PascalCase
class UserService {
    class User(
        val id: Int,
        val name: String
    ) {
        fun getUserById(userId: Int): User? = null
    }
}

// Objects: PascalCase
object UserConfig {
    const val MAX_CONNECTIONS = 100
}

// Files: kebab-case (recommended)
user-service.kt
auth-controller.kt
```

### Links oficiales
- [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html)

---

## ☕ Java (Oracle Code Conventions)

```java
// Methods: camelCase
public User getUserById(int userId) {
    int maxConnections = 100;
    List<User> userList = new ArrayList<>();
    return null;
}

// Variables: camelCase
private int maxConnections = 100;
private List<User> userList = new ArrayList<>();

// Constants: UPPER_SNAKE_CASE
public static final int MAX_CONNECTIONS = 100;
private static final int DEFAULT_TIMEOUT = 30;

// Classes: PascalCase
public class UserService {
    private static final int MAX_CONNECTIONS = 100;
    public User getUserById(int userId) {
        return null;
    }
}

// Interfaces: PascalCase + sometimes "Interface"
interface UserRepository {
    User findById(int id);
}

// Enums: PascalCase
enum UserStatus {
    ACTIVE,
    INACTIVE
}

// Files: kebab-case (or PascalCase for classes)
user-service.java
UserService.java
AuthController.java
```

### Links oficiales
- [Java Code Conventions](https://www.oracle.com/java/technologies/javase/codeconvtoc.html)

---

## 🎯 Decision Tree: ¿Cuál convención usar?

```
START: ¿Qué estás nombrando?
│
├── Función/Método
│   ├── Python → snake_case
│   ├── C# → PascalCase
│   ├── Go → PascalCase (exported) / snake_case (private)
│   ├── Rust → snake_case
│   ├── JavaScript → camelCase
│   └── Java → camelCase
│
├── Variable
│   ├── Python → snake_case
│   ├── C# → PascalCase
│   ├── Go → snake_case
│   ├── Rust → snake_case
│   ├── JavaScript → camelCase
│   └── Java → camelCase
│
├── Constante
│   ├── Python → UPPER_SNAKE_CASE
│   ├── C# → PascalCase
│   ├── Go → UPPER_SNAKE_CASE
│   ├── Rust → UPPER_SNAKE_CASE
│   ├── JavaScript → UPPER_SNAKE_CASE
│   └── Java → UPPER_SNAKE_CASE
│
├── Clase/Tipo
│   ├── Todos → PascalCase
│
└── Archivo
    ├── Python → snake_case
    ├── C# → PascalCase
    ├── Go → snake_case
    ├── Rust → snake_case
    ├── JavaScript → kebab-case o PascalCase
    └── Java → kebab-case o PascalCase
```

---

## ❌ Errores comunes a evitar

| Lenguaje | ERROR | CORRECTO |
|----------|-------|----------|
| Python | `def getUserById()` | `def get_user_by_id()` |
| C# | `var user_list = []` | `var userList = []` |
| Go | `func get_user_by_id()` (exported) | `func GetUserByID()` |
| Rust | `fn GetUserById()` | `fn get_user_by_id()` |
| JavaScript | `const User_List = []` | `const userList = []` |
| Ruby | `def GetUserById` | `def get_user_by_id` |

---

## 🔧 Linters por Lenguaje

| Lenguaje | Linter | Auto-fix |
|----------|--------|----------|
| Python | Ruff, flake8, pylint | ✅ |
| C# | StyleCop, ReSharper | ⚠️ |
| Go | golangci-lint, go fmt | ✅ |
| Rust | cargo clippy, cargo fmt | ✅ |
| JavaScript | ESLint, Prettier | ✅ |
| TypeScript | ESLint, Prettier | ✅ |
| Ruby | RuboCop | ✅ |
| PHP | PHP-CS-Fixer, PHPStan | ✅ |
| Swift | SwiftLint | ⚠️ |
| Kotlin | ktlint, detekt | ✅ |

---

> **Remember:** There is NO universal coding standard.
> **Follow the conventions of the LANGUAGE you're using.**
> When in doubt, run the language's linter - it will tell you the correct convention.