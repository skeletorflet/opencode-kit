---
name: java-expert
description: Java development principles and decision-making. 
             Modern Java 21+ patterns, Spring Boot, Quarkus, concurrency, JVM tuning.
allowed-tools: Read, Write, Edit, Glob, Grep
version: 1.0
---

# Java Expert - Modern Java 21+

> Java development principles and decision-making.
> **Learn to THINK, not copy-paste patterns.**

---

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles** for Java development.

- ASK user for framework preference and use case
- Choose modern Java features (records, pattern matching)
- Don't default to old Java patterns

---

## 1. Framework Selection

### Decision Tree

```
What are you building?
│
├── REST API (Main use case)
│   ├── Spring Boot (default, batteries included)
│   ├── Quarkus (fast startup, Kubernetes-native)
│   ├── Micronaut (fast startup, ahead-of-time)
│   └── Javalin (lightweight, simple)
│
├── Full-stack Web
│   └── Spring Boot + Thymeleaf/HTMX
│
├── Microservices
│   ├── Spring Boot
│   ├── Quarkus (if fast startup needed)
│   └── Micronaut (if low memory needed)
│
├── CLI Tool
│   ├── Picocli (rich CLI features)
│   └──jbang (scripting with Java)
│
└── Batch Processing
    └── Spring Batch (complete framework)
```

### Comparison Table

| Factor | Spring Boot | Quarkus | Micronaut | Javalin |
|--------|-------------|---------|-----------|---------|
| **Startup** | Medium | Very Fast | Very Fast | Fast |
| **Memory** | Medium | Low | Low | Very Low |
| **Ecosystem** | Largest | Growing | Growing | Small |
| **Learning Curve** | Medium | Low | Low | Very Low |
| **Best For** | Enterprise | Cloud/K8s | K8s/Microservices | Light APIs |

---

## 2. Modern Java 21+ Features

### Records (Immutable Data Classes)

```java
// ❌ OLD: Lombok @Data (deprecated pattern)
@Data
public class User {
    private Long id;
    private String name;
    private String email;
}

// ✅ MODERN: Java 16+ Records
public record User(Long id, String name, String email) {
    // equals(), hashCode(), toString(), getters auto-generated
    
    // Static factory method
    public static User anonymous() {
        return new User(null, "anonymous", null);
    }
}
```

### Pattern Matching

```java
// OLD
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.toUpperCase());
}

// MODERN: Pattern Matching for instanceof (Java 16+)
if (obj instanceof String s) {
    System.out.println(s.toUpperCase());
}

// PATTERN MATCHING for switch (Java 21+)
public String describe(Object obj) {
    return switch (obj) {
        case Integer i -> "Got integer: " + i;
        case String s -> "Got string: " + s.toUpperCase();
        case User u -> "Got user: " + u.name();
        case null -> "It's null!";
        default -> "Unknown type: " + obj.getClass().getSimpleName();
    };
}
```

### Virtual Threads (Loom - Java 21+)

```java
// OLD: Thread per request (blocking)
@RestController
public class OldController {
    @GetMapping("/users")
    public List<User> getUsers() {
        // Each request = 1 thread = blocking
        return userService.findAll();
    }
}

// MODERN: Virtual Threads (Java 21+)
// Runs ON THE SAME THREAD, no blocking!
@RestController
public class ModernController {
    @GetMapping("/users")
    public CompletableFuture<List<User>> getUsers() {
        return CompletableFuture.supplyAsync(() -> {
            // Automatically uses virtual thread pool
            return userService.findAll();
        });
        // No explicit virtual thread needed - automatic!
    }
}
```

---

## 3. Dependency Injection

### Constructor Injection (Recommended)

```java
// ✅ RECOMMENDED: Constructor injection
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    // Constructor injection (assists testing)
    public UserService(UserRepository userRepository, 
                      EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
}

// Also works with @RequiredArgsConstructor (Lombok)
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
}
```

### Record-based Configuration

```java
// Modern config (Java 16+ record)
public record DatabaseConfig(
    String url,
    String username,
    String password,
    int maxConnections
) {
    // Validation in constructor
    public DatabaseConfig {
        if (maxConnections < 1) {
            throw new IllegalArgumentException(
                "maxConnections must be positive");
        }
    }
}

@Configuration
@ConfigurationProperties(prefix = "database")
@Bean
public DatabaseConfig databaseConfig() {
    return new DatabaseConfig(
        "jdbc:postgresql://localhost:5432/db",
        "user", "pass", 10
    );
}
```

---

## 4. Database Access

### JPA/Hibernate Best Practices

```java
// ✅ GOOD: Entity with proper mapping
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Avoid: Eager fetching for collections
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<Order> orders;
}

// ✅ GOOD: Query methods
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE %:name%")
    List<User> searchByName(@Param("name") String name);
    
    @EntityGraph(attributePaths = {"orders"})
    Optional<User> findWithOrdersById(Long id);
}
```

### Performance Tips

| Pattern | Use For | Avoid |
|---------|---------|-------|
| `@Transactional(readOnly = true)` | Read queries | Writes |
| `SELECT FETCH` / `@EntityGraph` | Related entities | Always |
| `@Query` + nativeQuery=false | Complex queries | Simple queries |
| Pagination | Large datasets | All data at once |

---

## 5. Testing Patterns

### Test Structure

```java
// ✅ Unit test with Mockito
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void findById_whenExists_returnsUser() {
        // Given
        User user = new User(1L, "test@test.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // When
        Optional<User> result = userService.findById(1L);
        
        // Then
        assertTrue(result.isPresent());
        assertEquals("test@test.com", result.get().email());
    }
}

// ✅ Integration test with @DataJpaTest
@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void findByEmail_savesAndFinds() {
        User user = new User("test@test.com");
        userRepository.save(user);
        
        Optional<User> found = userRepository.findByEmail("test@test.com");
        
        assertTrue(found.isPresent());
    }
}
```

### Testing Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **JUnit 5** | Core testing | Always |
| **Mockito** | Mocking | Unit tests |
| **AssertJ** | Fluent assertions | All tests |
| **Testcontainers** | Docker databases | Integration tests |
| **MockMvc** | HTTP testing | REST controllers |
| **WebTestClient** | Reactive testing | WebFlux |

---

## 6. Build Tools

### Maven vs Gradle

| Factor | Maven | Gradle |
|--------|-------|--------|
| **Syntax** | XML | DSL (Kotlin/Groovy) |
| **Build Speed** | Good | Faster with daemon |
| **Caching** | Basic | Excellent |
| **Learning Curve** | Lower | Higher |
| **Plugins** | More mature | Flexible |

```xml<!-- Maven pom.xml --></project>
<groupId>com.example</groupId>
<artifactId>myapp</artifactId>
<version>1.0.0-SNAPSHOT</version>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

```groovy
// Gradle build.gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management-plugin'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.jetbrains.kotlin:kotlin-stdlib'
}
```

---

## 7. Performance & JVM Tuning

### JVM Arguments

```bash
# Heap sizing
-Xms512m -Xmx2g          # Initial/Max heap

# G1GC (default in Java 11+)
-XX:+UseG1GC 
-XX:MaxGCPauseMillis=200 # Target pause time

# Logging
-Xlog:gc*:file=gc.log:time,uptime:filecount=5,filesize=10m
```

### Monitoring Tools

| Tool | Purpose |
|------|---------|
| **VisualVM** | CPU/Memory profiling |
| **Async-profiler** | Low-overhead profiling |
| **JMC** (Mission Control) | Flight recorder |
| **Prometheus + Grafana** | Metrics collection |

---

## 8. Error Handling

### Exception Strategy

```java
// ✅ Centralized error handling
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            ValidationException ex) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", ex.getMessage()));
    }
}

// Record for error response (Java 16+)
public record ErrorResponse(String code, String message) {}
```

---

## 9. Decision Checklist

Before implementing:

- [ ] **Chosen framework for this use case?**
- [ ] **Using modern Java features (records, pattern matching)?**
- [ ] **Constructor injection (not @Autowired on fields)?**
- [ ] **Proper transaction management?**
- [ ] **Testing strategy chosen?**
- [ ] **Error handling centralized?**
- [ ] **JVM tuning considered for production?**

---

## ❌ Anti-Patterns to Avoid

### ❌ DON'T:
- Use Lombok @Data on entities (use @Getter/@Setter sparingly)
- Use field injection (@Autowired private XxxService xxx)
- Skip Lazy loading considerations
- Use raw types (List instead of List<User>)
- Catch generic Exception instead of specific
- Forget connection pool configuration
- Use synchronized instead of concurrent collections

### ✅ DO:
- Use Records for DTOs and entities (Java 16+)
- Use Virtual Threads for I/O (Java 21+)
- Use Constructor or Builder injection
- Use Optional for nullable returns
- Use Stream API for processing
- Test with @DataJpaTest for repositories
- Configure HikariCP properly

---

> **Remember:** Java has evolved significantly. 
> Use modern Java (17/21+) features like records and virtual threads.
> **Think in modern Java, not Java 8.**