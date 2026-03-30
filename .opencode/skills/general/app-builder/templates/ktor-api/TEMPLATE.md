---
name: ktor-api
description: Ktor REST API template principles. Exposed ORM, Serialization, Authentication.
---
# Ktor API Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Ktor 2.3+ |
| Language | Kotlin 2.0+ |
| ORM | Exposed |
| Serialization | Kotlinx.serialization (JSON) |
| DI | Koin (manual also fine) |
| Migrations | Exposed Migrations |
| Auth | JWT |

---

## Directory Structure

```
project-name/
├── src/
│   ├── main/
│   │   ├── kotlin/
│   │   │   └── com/example/project/
│   │   │       ├── Application.kt
│   │   │       ├── config/
│   │   │       │   ├── AppConfig.kt
│   │   │       │   └── DatabaseConfig.kt
│   │   │       ├── handler/
│   │   │       │   ├── auth_handler.kt
│   │   │       │   └── user_handler.kt
│   │   │       ├── middleware/
│   │   │       │   ├── auth_middleware.kt
│   │   │       │   └── logger_middleware.kt
│   │   │       ├── model/
│   │   │       │   ├── user.kt
│   │   │       │   └── post.kt
│   │   │       ├── repository/
│   │   │       │   ├── user_repository.kt
│   │   │       │   └── post_repository.kt
│   │   │       ├── service/
│   │   │       │   ├── auth_service.kt
│   │   │       │   ├── user_service.kt
│   │   │       │   └── post_service.kt
│   │   │       └── dto/
│   │   │       │   ├── request/
│   │   │       │   │   ├── LoginRequest.kt
│   │   │       │   │   └── CreateUserRequest.kt
│   │   │       │   └── response/
│   │   │       │       ├── AuthResponse.kt
│   │   │       │       └── UserResponse.kt
│   │   │       └── exception/
│   │   │       │       └── GlobalExceptionHandler.kt
│   │   └── resources/
│   │       ├── application.conf
│   │       └── logback.xml
│   └── test/
│       └── kotlin/
│           └── com/example/project/
│               ├── handler/
│               └── service/
├── build.gradle.kts
├── Dockerfile
└── README.md
```

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Clean Architecture** | Separation of concerns (handler → service → repository) |
| **Dependency Injection** | Koin (lightweight) or manual |
| **Coroutines** | async/await throughout |
| **Serialization** | Kotlinx.serialization for JSON |
| **Error Handling** | Centralized exception handling |
| **Testing** | Kotest with MockK |

---

## API Structure

| Layer | Responsibility |
|-------|----------------|
| Handler | HTTP request/response handling |
| Middleware | Auth, logging, CORS |
| Service | Business logic |
| Repository | Data access layer |
| Model | Database entities |
| DTO | Request/response objects |
| Config | Application configuration |
| Exception Handling | Centralized error handling |

---

## Setup Steps

### Gradle Kotlin DSL

1. Create project:
   ```
   mkdir project-name && cd project-name
   curl -s https://start.ktor.io/install.sh | bash
   ```
   Or manually create `build.gradle.kts` with:
   ```kotlin
   plugins {
       application
       kotlin("jvm") version "2.0.0"
       kotlin("plugin.serialization") version "2.0.0"
   }

   repositories {
       mavenCentral()
   }

   dependencies {
       implementation("io.ktor:ktor-server-netty:2.3.2")
       implementation("io.ktor:ktor-server-content-negotiation:2.3.2")
       implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.2")
       implementation("org.jetbrains.exposed:exposed-core:0.45.2")
       implementation("org.jetbrains.exposed:exposed-dao:0.45.2")
       implementation("org.jetbrains.exposed:exposed-jdbc:0.45.2")
       implementation("org.postgresql:postgresql:42.7.2")
       implementation("io.insert-kotlin:koin:3.5.0")
       testImplementation("io.kotest:kotest-runner-junit5:5.8.2")
       testImplementation("io.kotest:kotest-assertions-core:5.8.2")
       testImplementation("io.mockk:mockk:1.13.9")
   }

   application {
       mainClass.set("com.example.project.ApplicationKt")
   }
   ```
2. Configure `src/main/resources/application.conf`:
   ```hocon
   ktor {
       deployment {
           port = 8080
       }
       application {
           modules = [ com.example.project.ApplicationKt.main ]
       }
   }
   db {
       driver = "org.postgresql.Driver"
       url = "jdbc:postgresql://localhost:5432/dbname"
       user = "username"
       password = "password"
   }
   ```
3. Initialize database:
   ```kotlin
   // In Application.kt or separate migrator
   Database.connect(
       driver = "org.postgresql.Driver",
       url = "jdbc:postgresql://localhost:5432/dbname",
       user = "username",
       password = "password"
   )
   SchemaUtils.create(UserTable, PostTable) // if not exist
   ```
4. Run the application:
   ```
   ./gradlew run
   ```

---

## Best Practices

- Use coroutines for all I/O (don't block threads)
- Use Ktor content negotiation for automatic JSON serialization
- Use Exposed DAO or DSL for database access
- Separate concerns with clean architecture
- Write tests with Kotest and MockK
- Use environment variables for secrets (via ConfigKOtlin or env)
- Implement graceful shutdown
- Use Ktor logging plugin
- Add health check endpoint
- Use JWT for authentication (with expiration)
- Validate input with DTOs and validation libraries
- Follow RESTful API design principles
- Add OpenAPI/Swagger documentation with ktor-openapi plugin
- Use gofmt equivalent: ktlint for code formatting