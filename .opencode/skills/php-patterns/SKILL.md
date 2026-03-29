---
name: php-patterns
description: PHP development principles and decision-making. 
             Modern PHP 8.3, Laravel 11, Symfony 7, PSR standards.
allowed-tools: Read, Write, Edit, Glob, Grep
version: 1.0
---

# PHP Patterns - Modern PHP 8.3

> PHP development principles and decision-making.
> **Learn to THINK, not copy-paste patterns.**

---

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles** for PHP development.

- ASK user for framework preference
- Use PHP 8.x features (attributes, readonly, etc.)
- Don't write PHP 5/7 style code

---

## 1. Framework Selection

### Decision Tree

```
What are you building?
│
├── REST API
│   ├── Laravel (full-featured, most popular)
│   └── Symfony (enterprise, components)
│
├── CMS / Dashboard
│   ├── Laravel + Filament (fast admin)
│   ├── Laravel + Livewire (interactive)
│   └── Symfony (Symfony UX)
│
├── Simple API / Microservice
│   ├── Laravel (if you need full features)
│   ├── Slim (minimalist)
│   ├── Lumen (lightweight Laravel)
│   └── Flight (very simple)
│
├── CLI Tools
│   ├── Laravel Artisan
│   └── Symfony Console
│
└── Real-time / WebSocket
    ├── Laravel + Reverb (Pusher alternative)
    └── Symfony + Mercure
```

### Comparison Table

| Factor | Laravel | Symfony | Slim |
|--------|---------|---------|------|
| **Ecosystem** | Largest | Very large | Small |
| **Learning Curve** | Low-Medium | Medium | Very Low |
| **Admin Tools** | Filament/Panel | EasyAdmin | None |
| **Flexibility** | Opinionated | Modular | Minimal |
| **Best For** | Full-stack, rapid dev | Enterprise, K8s | Simple APIs |

---

## 2. PHP 8.3 Features

### Attributes (New in PHP 8)

```php
// OLD: Doctrine annotations
/**
 * @Entity
 * @Table(name="users")
 */
class User
{
    /**
     * @Id
     * @GeneratedValue
     */
    private int $id;
}

// NEW: PHP 8 Attributes
#[ORM\Entity]
#[ORM\Table(name: 'users')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    private int $id;
}
```

### Readonly Properties

```php
// Readonly (cannot be changed after construction)
class User
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email
    ) {}
}

// Cannot do this (will error):
$user->name = "Other";  // ❌ Error!
```

### constructor Property Promotion

```php
// Before PHP 8
class User
{
    private int $id;
    private string $name;
    private string $email;
    
    public function __construct(int $id, string $name, string $email)
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
    }
}

// PHP 8: Constructor property promotion
class User
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email
    ) {}
}
```

### Match Expression

```php
// OLD: switch
$status = match ($statusCode) {
    200 => 'success',
    404 => 'not_found',
    500 => 'error',
    default => 'unknown',
};

// With full expression
$result = match ($input) {
    $a => 'a',
    $b => 'b',
    default => 'other',
};
```

---

## 3. Laravel Patterns

### Service Container

```php
// Binding interfaces to implementations
$this->app->bind(
    UserRepositoryInterface::class,
    UserRepository::class
);

// Singleton (one instance)
$this->app->singleton(
    ConfigService::class,
    fn() => new ConfigService(config('app.config'))
);

// Facade pattern (static-like access)
User::find(1);  // Actually: UserRepository::class->find(1)
```

### Eloquent ORM

```php
// Model with relationships
class User extends Model
{
    protected $fillable = ['name', 'email'];
    
    // Relationship
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
    
    // Accessor
    public function getFullNameAttribute(): string
    {
        return "{$this->name} (ID: {$this->id})";
    }
}

// Query scopes
class User extends Model
{
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

// Usage
User::active()->where('role', 'admin')->get();
```

### Controller Patterns

```php
// REST controller
class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::with('posts')->paginate(10);
        return response()->json($users);
    }
    
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users'
        ]);
        
        $user = User::create($validated);
        return response()->json($user, 201);
    }
}
```

---

## 4. Symfony Patterns

### Dependency Injection

```php
// Services.yaml
services:
    App\Service\UserService:
        arguments:
            $repository: '@App\Repository\UserRepository'

// Service class
class UserService
{
    public function __construct(
        private UserRepository $repository,
        private MailerInterface $mailer
    ) {}
}
```

### Symfony Validation

```php
use Symfony\Component\Validator\Constraints as Assert;

class CreateUserCommand
{
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email;
    
    #[Assert\NotBlank]
    #[Assert\Length(min: 8)]
    public string $password;
}
```

---

## 5. PSR Standards

### PSR-12: PHP Coding Style

```php
<?php

namespace App;

use App\Other\Example;

// Braces on new line, 4 spaces indent
class UserService
{
    private int $id;
    private string $name;
    
    public function __construct(
        int $id,
        string $name
    ) {
        $this->id = $id;
        $this->name = $name;
    }
}
```

### PSR-7: HTTP Messages

```php
use Psr\Http\Message\ServerRequestInterface;

// PSR-7 compatible handlers
function handleRequest(ServerRequestInterface $request)
{
    $method = $request->getMethod();
    $uri = $request->getUri()->getPath();
    
    return new JsonResponse(['method' => $method]);
}
```

---

## 6. Testing Patterns

### PHPUnit with Coverage

```php
// Unit test
class UserServiceTest extends TestCase
{
    public function test_creates_user(): void
    {
        $service = new UserService(new InMemoryUserRepository());
        
        $user = $service->create('test@example.com');
        
        $this->assertNotNull($user->id);
        $this->assertEquals('test@example.com', $user->email);
    }
}

// Feature test with HTTP client
class UserApiTest extends TestCase
{
    public function test_get_users_returns_json(): void
    {
        $response = $this->getJson('/api/users');
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'email']
            ]
        ]);
    }
}
```

### Testing Tools

| Tool | Purpose |
|------|---------|
| **PHPUnit** | Core testing |
| **Pest** | Cleaner syntax, built on PHPUnit |
| **Mockery** | Mocking |
| **Laravel Dusk** | Browser testing |
| **PHPStan** | Static analysis |
| **PHP-CS-Fixer** | Code style |

---

## 7. Error Handling

### Exception Strategy

```php
// Custom exceptions
class UserNotFoundException extends Exception
{
    public function __construct(int $id)
    {
        parent::__construct("User with ID {$id} not found", 404);
    }
}

// Handler in Laravel
class ExceptionHandler extends IlluminateExceptionHandler
{
    public function register(): void
    {
        $this->reportable(function (UserNotFoundException $e) {
            Log::warning("User not found: " . $e->getId());
        });
    }
}

// Using Result/Either pattern
class UserService
{
    public function findUser(int $id): User|UserNotFoundException
    {
        $user = User::find($id);
        
        if (!$user) {
            return new UserNotFoundException($id);
        }
        
        return $user;
    }
}
```

---

## 8. Decision Checklist

Before implementing:

- [ ] **Chosen framework for this project?**
- [ ] **PSR standards applied (PSR-12)?**
- [ ] **PHP 8.x features used (attributes, readonly)?**
- [ ] **Validation strategy chosen?**
- [ ] **Testing with PHPUnit/Pest?**
- [ ] **Static analysis with PHPStan?**
- [ ] **DI container used properly?**

---

## ❌ Anti-Patterns to Avoid

### ❌ DON'T:
- Use old PHP 5/7 style (no attributes, manual getters)
- Skip PSR standards (causes conflicts in teams)
- Use $_GET/$_POST directly (use Request)
- Store passwords as plain text (use bcrypt)
- Write procedural code in classes
- Skip static analysis (PHPStan)

### ✅ DO:
- Use PHP 8 attributes (not Doctrine annotations)
- Use readonly properties
- Use constructor property promotion
- Use Laravel/Symfony best practices
- Add types everywhere (strict)
- Run tests on CI
- Use Pest for cleaner tests

---

> **Remember:** PHP has evolved significantly.
> Use PHP 8+ features and PSR standards.
> **Think in modern PHP.**