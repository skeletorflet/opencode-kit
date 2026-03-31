---
name: laravel-patterns
description: Laravel 11+ patterns and conventions. Covers Eloquent, API design, queues, testing, and modern Laravel architecture.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: backend
---

# Laravel Patterns

## What I Do

- Build Laravel 11+ applications with modern patterns
- Design Eloquent models with proper relationships
- Implement API resources and validation
- Set up queues and job processing
- Write tests with PHPUnit and Pest

## When to Use Me

- Creating or extending Laravel applications
- Designing Eloquent models and relationships
- Building REST APIs with Laravel
- Setting up queue workers and scheduled tasks
- Writing comprehensive tests

## Key Principles

1. **Form Requests**: Validate in FormRequest classes, not controllers
2. **API Resources**: Transform models with API Resources for responses
3. **Eloquent Events**: Use model events for side effects
4. **Service Container**: Leverage DI and service providers
5. **Queues**: Offload slow operations to queue workers

## Common Patterns

### Form Request
```php
class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'confirmed'],
        ];
    }
}
```

### API Resource
```php
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
```

## Validation

```bash
php artisan migrate
php artisan test
php artisan pint
```
