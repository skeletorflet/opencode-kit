---
name: aspnet-core-api
description: ASP.NET Core REST API template principles. Minimal APIs, EF Core, Dapper.
---
# ASP.NET Core API Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | ASP.NET Core 8.0 |
| Language | C# 12 |
| ORM | Entity Framework Core 8.0 |
| Alternative ORM | Dapper (high performance) |
| Validation | FluentValidation |
| DI | Built-in Microsoft DI |
| Migrations | EF Core Migrations |
| Auth | JWT + ASP.NET Core Identity |
| Build | dotnet CLI |

---

## Directory Structure

```
project-name/
├── src/
│   └── ProjectName/
│       ├── Program.cs
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── appsettings.Production.json
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   └── UserController.cs
│       ├── MinimalApi/
│       │   ├── Endpoints.cs
│       │   └── MappingExtensions.cs
│       ├── DTOs/
│       │   ├── Requests/
│       │   │   ├── LoginRequest.cs
│       │   │   └── CreateUserRequest.cs
│       │   └── Responses/
│       │       ├── AuthResponse.cs
│       │       └── UserResponse.cs
│       ├── Entities/
│       │   ├── User.cs
│       │   └── Post.cs
│       ├── Repositories/
│       │   ├── IUserRepository.cs
│       │   ├── UserRepository.cs
│       │   ├── IPostRepository.cs
│       │   └── PostRepository.cs
│       ├── Services/
│       │   ├── IAuthService.cs
│       │   ├── AuthService.cs
│       │   ├── IUserService.cs
│       │   └── UserService.cs
│       ├── Middleware/
│       │   ├── ErrorHandlingMiddleware.cs
│       │   └── LoggingMiddleware.cs
│       ├── Config/
│       │   ├── DatabaseOptions.cs
│       │   └── JwtOptions.cs
│       ├── Exceptions/
│       │   ├── NotFoundException.cs
│       │   └── ValidationException.cs
│       ├── Extensions/
│       │   ├── ServiceCollectionExtensions.cs
│       │   └── HttpResponseExtensions.cs
│       └── Properties/
│           └── launchSettings.json
├── tests/
│   ├── ProjectName.Tests/
│   │   ├── Unit/
│   │   │   ├── Services/
│   │   │   │   ├── UserServiceTest.cs
│   │   │   │   └── AuthServiceTest.cs
│   │   │   └── Controllers/
│   │   │       ├── UserControllerTest.cs
│   │   │       └── AuthControllerTest.cs
│   │   └── Integration/
│   │       └── ApiTests/
│   │           ├── UserApiTests.cs
│   │           └── AuthApiTests.cs
│   └── ProjectName.IntegrationTests/
│       ├── TestContainers/
│       │   └── PostgresContainer.cs
│       └── CustomWebApplicationFactory.cs
├── ProjectName.csproj
├── Directory.Build.props
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Clean Architecture** | Separation of concerns (API → Service → Repository) |
| **Dependency Injection** | Built-in .NET DI (constructor injection) |
| **Minimal APIs** | Recommended for simple, high-performance endpoints |
| **Controllers** | For complex validation and multiple actions |
| **DTO Pattern** | Data Transfer Objects for API boundaries |
| **Validation** | FluentValidation for complex validation logic |
| **Error Handling** | Centralized exception handling middleware |
| **Configuration** | Options pattern for strongly-typed settings |
| **Testing** | xUnit with Moq and Testcontainers |
| **Database** | EF Core Migrations or Dapper for raw SQL |

---

## API Structure Options

### Option 1: Minimal APIs (Recommended)

```csharp
// Program.cs or Endpoints.cs
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Configure middleware
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<LoggingMiddleware>();

// Minimal API endpoints
app.MapGet("/api/users", async (IUserRepository repo) =>
{
    var users = await repo.GetAllAsync();
    return Results.Ok(users);
})
.WithName("GetUsers")
.Produces<List<UserResponse>>(StatusCodes.Status200OK);

app.MapGet("/api/users/{id}", async (int id, IUserRepository repo) =>
{
    var user = await repo.GetByIdAsync(id);
    return user is not null ? Results.Ok(user) : Results.NotFound();
})
.WithName("GetUserById")
.Produces<UserResponse>(StatusCodes.Status200OK)
.Produces(StatusCodes.Status404NotFound);

app.MapPost("/api/users", async (CreateUserRequest request, IUserService service) =>
{
    var user = await service.CreateUserAsync(request);
    return Results.Created($"/api/users/{user.Id}", user);
})
.WithName("CreateUser")
.Accepts<CreateUserRequest>("application/json")
.Produces<UserResponse>(StatusCodes.Status201Created)
.Produces<ValidationProblemDetails>(StatusCodes.Status400BadRequest);

app.Run();
```

### Option 2: Controller-Based (For Complex Scenarios)

```csharp
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;
    
    public UserController(IUserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetAll()
    {
        try {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        } catch (Exception ex) {
            _logger.LogError(ex, "Error getting users");
            return StatusCode(500, "Internal server error");
        }
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserResponse>> GetById(int id)
    {
        try {
            var user = await _userService.GetByIdAsync(id);
            return user is not null ? Ok(user) : NotFound();
        } catch (Exception ex) {
            _logger.LogError(ex, "Error getting user {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
    
    [HttpPost]
    public async Task<ActionResult<UserResponse>> Create([FromBody] CreateUserRequest request)
    {
        try {
            var user = await _userService.CreateUserAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        } catch (ValidationException vex) {
            return BadRequest(new ValidationProblemDetails(vex.Errors));
        } catch (Exception ex) {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, "Internal server error");
        }
    }
}
```

---

## Setup Steps

### 1. Create Project

```bash
dotnet new web -n ProjectName
cd ProjectName
```

### 2. Add Dependencies

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package FluentValidation.AspNetCore
dotnet add package Swashbuckle.AspNetCore  # For Swagger/OpenAPI
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

### 3. Configure appsettings.json

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=myapp;Username=myuser;Password=mypassword"
  },
  "JwtSettings": {
    "Secret": "your-super-secret-key-here-min-32-chars",
    "Issuer": "myapp",
    "Audience": "myapp-users",
    "ExpiryMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### 4. Create Database Context

```csharp
// Data/AppDbContext.cs
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options) { }
    
    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure relationships, indexes, etc.
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
            
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Author)
            .WithMany(a => a.Posts)
            .HasForeignKey(p => p.AuthorId);
    }
}
```

### 5. Register Services

```csharp
// Program.cs (continued)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPostRepository, PostRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtOptions>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings.Secret))
    };
});

builder.Services.AddAuthorization();
```

### 6. Run Migrations

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 7. Run Application

```bash
dotnet run
```

Or for development with hot reload:
```bash
dotnet watch run
```

---

## Best Practices

- Use Minimal APIs for simple endpoints (better performance, less boilerplate)
- Use Controllers for complex validation and multiple related actions
- Always use constructor injection, never property injection
- Add validation with FluentValidation for complex scenarios
- Implement global error handling middleware
- Use options pattern for configuration (strongly typed)
- Add health checks endpoint (`/healthz`)
- Use environment variables for secrets (never commit to repo)
- Implement graceful shutdown handling
- Add request/response logging middleware
- Use async/await for all I/O operations
- Configure CORS properly for your environment
- Add rate limiting for public APIs
- Implement proper logging (structured logging preferred)
- Use Serilog for structured logging
- Add OpenAPI/Swagger documentation for API discovery
- Use Testcontainers for integration tests with real databases
- Implement circuit breaker pattern for external services
- Add distributed tracing (OpenTelemetry)
- Use health checks for Kubernetes liveness/readiness probes
- Implement graceful shutdown with IHostApplicationLifetime
- Use environment-specific configuration (appsettings.Development.json, etc.)
- Add API versioning when needed
- Use response caching for appropriate endpoints
- Implement compression middleware (Gzip/Deflate)
- Add security headers middleware
- Use EF Core migrations for schema changes
- Consider Dapper for high-performance read-heavy scenarios
- Add distributed caching (Redis) for session/store
- Implement proper CORS policy
- Add API documentation examples in Swagger
- Use problem details format for error responses (RFC 7807)