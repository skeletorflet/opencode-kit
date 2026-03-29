---
name: laravel-app
description: Laravel REST API template principles. Eloquent, Livewire, Sanctum, Horizon.
---

# Laravel Application Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Laravel 11+ |
| Language | PHP 8.2+ |
| ORM | Eloquent |
| Validation | Laravel Validation |
| Migrations | Laravel Migrations |
| Auth | Laravel Sanctum / Jetstream |
| Frontend | Livewire / Blade / Inertia |
| Queue | Laravel Horizon (Redis) |
| Testing | PHPUnit, Pest |

---

## Directory Structure

```
project-name/
├── app/
│   ├── Console/
│   │   └── Kernel.php
│   ├── Exceptions/
│   │   └── Handler.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   ├── Api/
│   │   │   │   └── V1/
│   │   │   │       └── UserController.php
│   │   │   └── Web/
│   │   │       └── HomeController.php
│   │   ├── Middleware/
│   │   │   ├── VerifyCsrfToken.php
│   │   │   └── Authenticate.php
│   │   └── Requests/
│   │       └── CreateUserRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   └── Post.php
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   └── RouteServiceProvider.php
│   └── Services/
│       ├── UserService.php
│       └── PaymentService.php
├── bootstrap/
├── config/
│   ├── app.php
│   ├── database.php
│   └── queue.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── public/
├── resources/
│   ├── css/
│   ├── js/
│   └── views/
├── routes/
│   ├── api.php
│   ├── web.php
│   └── channels.php
├── storage/
├── tests/
│   ├── Feature/
│   └── Unit/
├── .env.example
├── artisan
├── composer.json
├── Dockerfile
└── phpunit.xml
```

---

## API Structure

```php
// app/Http/Controllers/Api/V1/UserController.php
namespace App\Http\Controllers\Api\V1;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('posts')->paginate(10);
        return UserResource::collection($users);
    }

    public function store(CreateUserRequest $request)
    {
        $user = UserService::create($request->validated());
        return (new UserResource($user))->response()->setStatusCode(201);
    }
}

// routes/api.php
Route::prefix('v1')->group(function () {
    Route::apiResource('users', UserController::class);
});
```

---

## Setup Steps

1. `composer create-project laravel/laravel project-name`
2. `composer require laravel/sanctum`
3. `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
4. Configure `.env` database
5. `php artisan migrate`
6. `php artisan serve`

---

## Best Practices

- Use API Resources for transformation
- Use Form Requests for validation
- Use Service Classes for business logic
- Use Policy for authorization
- Use PHP 8 typed properties