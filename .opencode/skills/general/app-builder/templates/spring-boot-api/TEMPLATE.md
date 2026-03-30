---
name: spring-boot-api
description: Spring Boot REST API template principles. JPA/Hibernate, Lombok, Validation.
---
# Spring Boot API Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Spring Boot 3.x |
| Language | Java 21 |
| ORM | Spring Data JPA/Hibernate |
| Validation | Bean Validation 3.0 (Jakarta Validation) |
| Lombok | For reducing boilerplate |
| Migrations | Flyway (or Liquibase) |
| Auth | JWT + Spring Security |
| Build | Maven (or Gradle) |

---

## Directory Structure

```
project-name/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/project/
│   │   │       ├── config/
│   │   │       │   └── SecurityConfig.java
│   │   │       ├── controller/
│   │   │       │   ├── AuthController.java
│   │   │       │   └── UserController.java
│   │   │       ├── dto/
│   │   │       │   ├── request/
│   │   │       │   │   ├── LoginRequest.java
│   │   │       │   │   └── CreateUserRequest.java
│   │   │       │   └── response/
│   │   │       │       ├── AuthResponse.java
│   │   │       │       └── UserResponse.java
│   │   │       ├── model/
│   │   │       │   ├── User.java
│   │   │       │   └── Post.java
│   │   │       ├── repository/
│   │   │       │   ├── UserRepository.java
│   │   │       │   └── PostRepository.java
│   │   │       ├── service/
│   │   │       │   ├── AuthService.java
│   │   │       │   ├── UserService.java
│   │   │       │   └── PostService.java
│   │   │       └── exception/
│   │   │           └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── schema.sql
│   │       └── data.sql
│   └── test/
│       ├── java/
│       │   └── com/example/project/
│   │       │       ├── controller/
│   │   │       │       └── UserControllerTest.java
│   │   │       ├── service/
│   │   │       │       └── UserServiceTest.java
│   │   │       └── repository/
│   │   │       │       └── UserRepositoryTest.java
│   └── resources/
│       └── application-test.yml
├── pom.xml
├── Dockerfile
└── README.md
```

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Clean Architecture** | Separation of concerns (controller → service → repository) |
| **Dependency Injection** | Spring DI (constructor injection preferred) |
| **DTO Pattern** | Data Transfer Objects for API boundaries |
| **Validation** | Bean Validation annotations (e.g., @NotBlank) |
| **Error Handling** | @ControllerAdvice for global exception handling |
| **Testing** | JUnit 5 + Mockito + Testcontainers |

---

## API Structure

| Layer | Responsibility |
|-------|----------------|
| Controller | HTTP request/response handling |
| Service | Business logic |
| Repository | Data access layer (Spring Data JPA) |
| Model | Database entities (JPA) |
| DTO | Request/response objects |
| Config | Application configuration |
| Exception Handling | Centralized error handling |

---

## Setup Steps

### Maven

1. Create project with Spring Initializr (start.spring.io) or:
   ```
   mvn archetype:generate \
     -DgroupId=com.example \
     -DartifactId=project-name \
     -DarchetypeArtifactId=maven-archetype-quickstart \
     -DinteractiveMode=false
   ```
2. Add dependencies to pom.xml:
   ```xml
   <dependencies>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-web</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-data-jpa</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-validation</artifactId>
       </dependency>
       <dependency>
           <groupId>org.projectlombok</groupId>
           <artifactId>lombok</artifactId>
           <optional>true</optional>
       </dependency>
       <dependency>
           <groupId>com.h2database</groupId>
           <artifactId>h2</artifactId>
           <scope>runtime</scope>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-test</artifactId>
           <scope>test</scope>
       </dependency>
   </dependencies>
   ```
3. Configure `application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:h2:mem:testdb
       driver-class-name: org.h2.Driver
       username: sa
       password:
     jpa:
       hibernate:
         ddl-auto: update
       show-sql: true
   ```
4. Run the application:
   ```
   mvn spring-boot:run
   ```

### Gradle (Alternative)

1. Create `build.gradle` with similar dependencies
2. Run with `./gradlew bootRun`

---

## Best Practices

- Use constructor injection (not field injection)
- Use DTOs to decouple API from entities
- Add validation annotations to DTOs
- Use @Transactional for service methods
- Implement global exception handling with @ControllerAdvice
- Use Spring Profiles for different environments
- Write unit tests with JUnit 5 and Mockito
- Use Testcontainers for integration tests with real databases
- Add Flyway for database migrations
- Secure endpoints with Spring Security
- Use environment variables for secrets
- Implement graceful shutdown
- Use Lombok to reduce boilerplate (getters, setters, constructors)
- Follow RESTful API design principles
- Add OpenAPI/Swagger documentation with springdoc-openapi