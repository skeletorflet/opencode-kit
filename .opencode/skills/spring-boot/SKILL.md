---
name: spring-boot
description: Spring Boot 3+ expert for building enterprise Java applications. Covers REST APIs, security, data access, and microservices patterns.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: backend
---

# Spring Boot Expert

## What I Do

- Build REST APIs with Spring Web and Spring Data
- Configure Spring Security for authentication and authorization
- Implement reactive programming with WebFlux
- Set up Spring Data JPA with proper entity design
- Configure microservices with Spring Cloud

## When to Use Me

- Creating Spring Boot applications
- Designing RESTful APIs
- Implementing security with Spring Security
- Setting up database access with Spring Data
- Building microservices architectures

## Key Principles

1. **Constructor Injection**: Always prefer constructor over field injection
2. **DTO Pattern**: Never expose entities directly in API responses
3. **Exception Handling**: Use @ControllerAdvice for centralized error handling
4. **Validation**: Use Bean Validation (@Valid) at API boundaries
5. **Profiles**: Use application profiles for environment-specific config

## Common Patterns

### REST Controller
```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.create(request);
    }
}
```

### Global Exception Handler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }
}
```

## Validation

```bash
./mvnw test
./mvnw spring-boot:run
```
