---
name: aspnet-core
description: ASP.NET Core 8+ expert for building modern .NET web APIs and applications. Covers Minimal APIs, MVC, Entity Framework, and authentication.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: backend
---

# ASP.NET Core Expert

## What I Do

- Build APIs with Minimal APIs and MVC controllers
- Configure Entity Framework Core with proper patterns
- Implement authentication with JWT and Identity
- Set up dependency injection and middleware pipelines
- Configure Swagger/OpenAPI documentation

## When to Use Me

- Creating ASP.NET Core applications
- Building REST APIs with .NET
- Setting up Entity Framework Core
- Implementing authentication and authorization
- Configuring middleware and pipelines

## Key Principles

1. **Minimal APIs First**: Use Minimal APIs for simple endpoints
2. **Vertical Slice Architecture**: Organize by feature, not layer
3. **Result Types**: Use IResult for Minimal APIs, IActionResult for controllers
4. **EF Core Tracking**: Use AsNoTracking() for read-only queries
5. **Configuration**: Use IOptions<T> pattern for typed configuration

## Common Patterns

### Minimal API
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

var app = builder.Build();

app.MapGet("/api/users/{id}", async (int id, AppDbContext db) =>
    await db.Users.FindAsync(id) is User user
        ? Results.Ok(user)
        : Results.NotFound());

app.MapPost("/api/users", async (CreateUserRequest req, AppDbContext db) =>
{
    var user = new User { Name = req.Name, Email = req.Email };
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Created($"/api/users/{user.Id}", user);
});

app.Run();
```

## Validation

```bash
dotnet build
dotnet test
dotnet run
```
