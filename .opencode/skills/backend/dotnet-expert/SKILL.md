---
name: dotnet-expert
description: .NET development principles and decision-making. 
             .NET 8, ASP.NET Core, C# 12, dependency injection, best practices.
allowed-tools: Read, Write, Edit, Glob, Grep
version: 1.0
---

# .NET Expert - Modern .NET 8

> .NET development principles and decision-making.
> **Learn to THINK, not copy-paste patterns.**

---

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles** for .NET development.

- ASK user for project type (web API, worker, blazor)
- Choose minimal APIs vs controller-based
- Don't use outdated .NET Framework patterns

---

## 1. Framework Selection

### Decision Tree

```
What are you building?
│
├── REST API
│   ├── Minimal APIs (NEW .NET 6+) - Recommended for simple APIs
│   └── Controller-based - Complex operations, heavy validation
│
├── Full-stack Web
│   ├── Blazor Server - Server-rendered, WebSocket
│   ├── Blazor WebAssembly - Client-side, PWA-ish
│   └── ASP.NET Core MVC - Traditional Razor
│
├── Background Worker
│   └── .NET Worker Services + Quartz/Hangfire
│
├── gRPC Services
│   └── .NET gRPC (protobuf)
│
├── Desktop
│   ├── WPF (.NET 8)
│   ├── WinForms (legacy)
│   └── MAUI (cross-platform)
│
└── Microservices
    └── .NET 8 + Dapr (cloud-native patterns)
```

### Comparison: Minimal APIs vs Controllers

| Factor | Minimal APIs | Controllers |
|--------|--------------|-------------|
| **Boilerplate** | Very Low | Medium |
| **Routing** | Inline/Fluent | Attribute-based |
| **Validation** | Manual/FluentValidation | DataAnnotations |
| **Best For** | Microservices, simple APIs | Enterprise, complex validation |
| **OpenAPI/Swagger** | Built-in | Route-based |

---

## 2. Modern C# 12 Features

### Primary Constructors

```csharp
// C# 12: Primary constructors (NEW!)
public class UserService(
    IUserRepository userRepository,
    IEmailService emailService)
{
    public User? GetById(int id) 
    {
        return userRepository.FindById(id);
    }
}

// Or record with primary constructor (immutable)
public record User(int Id, string Name, string Email);
```

### Collection Expressions

```csharp
// OLD: Array initializer
var list = new List<int> { 1, 2, 3 };
int[] array = new int[] { 1, 2, 3 };

// C# 12: Collection expressions
var list = [1, 2, 3];
int[] array = [1, 2, 3];
var dict = new Dictionary<string, int> { {"a", 1} };
var dict2 = ["a", 1 ];
```

### LINQ Improvements

```csharp
// NEW in .NET: More efficient LINQ
var result = items
    .Where(x => x.IsActive)
    .OrderBy(x => x.Name)
    .Select(x => x.ToDto())
    .ToList();  // Materializes once

// Use CountBy, ChunkBy for better performance
var countByCategory = products.CountBy(p => p.Category);
// Returns: IEnumerable<(Category, int)>
```

### Pattern Matching

```csharp
// Pattern matching with C# 12
public string Describe(object obj) => obj switch
{
    int i => $"Integer: {i}",
    string s => $"String: {s.ToUpper()}",
    User { Name: "Admin" } => "Admin user!",
    User u => $"User: {u.Name}",
    null => "Null!",
    _ => $"Type: {obj.GetType().Name}"
};
```

---

## 3. Dependency Injection

### .NET 8 DI (Built-in)

```csharp
// Configure services (Program.cs)
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddSingleton<IConfigService, ConfigService>();

// Use options pattern
builder.Services.Configure<DatabaseOptions>(
    builder.Configuration.GetSection("Database"));

// Build
var app = builder.Build();

// Minimal API with DI
app.MapGet("/users/{id}", (IUserRepository repo, int id) 
    => repo.FindById(id));
```

### Constructor Injection

```csharp
// ✅ RECOMMENDED in .NET
public class UserService(IUserRepository repository)
{
    private readonly IUserRepository _repo = repository;
    
    public User? GetById(int id) => _repo.FindById(id);
}

// Record-based service (C# 12)
public record EmailService(SmtpConfig Config) : IEmailService
{
    public async Task SendAsync(string to, string subject, string body)
    {
        // Implementation
    }
}
```

---

## 4. Minimal APIs (Recommended)

### Basic Pattern

```csharp
// Program.cs - Minimal API
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

var app = builder.Build();

// Endpoints
app.MapGet("/api/users", async (AppDbContext db) 
    => await db.Users.ToListAsync());

app.MapGet("/api/users/{id}", async (int id, AppDbContext db) 
    => await db.Users.FindAsync(id));

app.MapPost("/api/users", async (User user, AppDbContext db) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Created($"/api/users/{user.Id}", user);
});

app.Run();
```

### With Validation

```csharp
// Using FluentValidation
public record CreateUserRequest(string Name, string Email);

app.MapPost("/api/users", async (CreateUserRequest request, 
                                   IValidator<CreateUserRequest> validator,
                                   AppDbContext db) =>
{
    var validation = await validator.ValidateAsync(request);
    if (!validation.IsValid)
        return Results.BadRequest(validation.Errors);
    
    var user = new User { Name = request.Name, Email = request.Email };
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Created($"/api/users/{user.Id}", user);
});
```

---

## 5. Database Access

### Entity Framework Core

```csharp
// DbContext
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options) {}
    
    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
}

// Entity (use primary constructor for EF Core 8)
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

// Queries with LINQ
var users = await context.Users
    .Where(u => u.IsActive)
    .OrderBy(u => u.Name)
    .Select(u => new UserDto(u.Id, u.Name))
    .ToListAsync();
```

### Dapper for Performance

```csharp
// Dapper - lightweight ORM
public class UserRepository : IUserRepository
{
    private readonly DbConnection _connection;
    
    public async Task<User?> FindById(int id)
    {
        return await _connection.QueryFirstOrDefaultAsync<User>(
            "SELECT * FROM Users WHERE Id = @Id",
            new { Id = id });
    }
}
```

### Comparison

| Approach | Best For | Performance |
|----------|----------|-------------|
| **EF Core** | Most CRUD, migrations | Good |
| **Dapper** | Raw SQL, high performance | Excellent |
| **ADO.NET** | Minimal overhead | Best |

---

## 6. Testing Patterns

### xUnit with Moq

```csharp
// Unit test
public class UserServiceTest
{
    [Fact]
    public void GetById_WhenExists_ReturnsUser()
    {
        // Arrange
        var mockRepo = new Mock<IUserRepository>();
        mockRepo.Setup(r => r.FindById(1))
            .Returns(new User(1, "test@test.com"));
        
        var service = new UserService(mockRepo.Object);
        
        // Act
        var result = service.GetById(1);
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal("test@test.com", result.Email);
    }
}

// Integration test
public class UserApiTest : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    
    public UserApiTest(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }
    
    [Fact]
    public async Task GetUsers_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/users");
        
        Assert.True(response.IsSuccessStatusCode);
    }
}
```

### Testing Tools

| Tool | Purpose |
|------|---------|
| **xUnit** | Unit/Integration testing |
| **Moq** | Mocking framework |
| **FluentAssertions** | Fluent assertions |
| **Testcontainers.Sqlite** | In-memory DB testing |
| **WireMock** | HTTP mocking |

---

## 7. Configuration

### Options Pattern

```csharp
// Configuration class
public class DatabaseOptions
{
    public string ConnectionString { get; set; } = "";
    public int MaxConnections { get; set; } = 10;
}

// appsettings.json
{
  "Database": {
    "ConnectionString": "Server=.;Database=mydb;",
    "MaxConnections": 20
  }
}

// Registration
builder.Services.Configure<DatabaseOptions>(
    builder.Configuration.GetSection("Database"));

// Usage
public class UserService(
    IOptions<DatabaseOptions> options)
{
    public string ConnString => 
        options.Value.ConnectionString;
}
```

---

## 8. Error Handling

### Global Exception Handler

```csharp
// Program.cs
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(
            "{\"error\": \"An unexpected error occurred\"}");
    });
});

// Problem Details (RFC 7807)
app.MapPost("/api/users", async ([FromBody] User user) =>
{
    try
    {
        // Process
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, 
            statusCode: 400);
    }
});
```

---

## 9. Decision Checklist

Before implementing:

- [ ] **Minimal API or Controller? (match complexity)**
- [ ] **EF Core or Dapper? (match performance needs)**
- [ ] **Async/await for I/O operations?**
- [ ] **Dependency injection configured?**
- [ ] **Validation strategy chosen?**
- [ ] **Testing approach defined?**
- [ ] **Configuration via options pattern?**

---

## ❌ Anti-Patterns to Avoid

### ❌ DON'T:
- Use synchronous I/O in API endpoints
- Configure EF Core without tracking changes awareness
- Use ViewBag/ViewData in minimal APIs
- Skip health checks in microservices
- Use .NET Framework patterns in .NET 8
- Skip connection string encryption for production

### ✅ DO:
- Use Primary Constructors (C# 12)
- Use records for DTOs and responses
- Use Minimal APIs for simple services
- Use IAsyncEnumerable for streaming
- Configure health checks (/healthz)
- Use FluentValidation for complex validation

---

> **Remember:** .NET 8 is modern and productive.
> Use Minimal APIs, records, and primary constructors.
> **Think in modern .NET, not .NET Framework.**