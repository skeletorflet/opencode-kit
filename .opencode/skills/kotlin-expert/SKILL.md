---
name: kotlin-expert
description: Kotlin development principles and decision-making. 
             Modern Kotlin 2.0, coroutines, Ktor, Jetpack Compose, Android.
allowed-tools: Read, Write, Edit, Glob, Grep
version: 1.0
---

# Kotlin Expert - Modern Kotlin 2.0+

> Kotlin development principles and decision-making.
> **Learn to THINK, not copy-paste patterns.**

---

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles** for Kotlin development.

- ASK user for platform (JVM, Android, Native, Multiplatform)
- Choose coroutines for async (NOT threads)
- Don't write Java in Kotlin

---

## 1. Platform Selection

### Decision Tree

```
What are you building?
│
├── REST API (JVM)
│   ├── Ktor (lightweight, async-first)
│   ├── Spring Boot (enterprise, familiar)
│   ├── Javalin (simple, similar to Spark)
│   └── Vert.x (reactive, high-performance)
│
├── Android App
│   ├── Jetpack Compose (modern UI)
│   └── XML + View System (legacy)
│
├── Kotlin Multiplatform (KMP)
│   ├── Share logic Android/iOS/WASM
│   └── Kotlin/JS for web
│
├── Desktop
│   ├── Compose for Desktop (TornadoFX deprecated)
│   └── Compose for Mac/Linux/Windows
│
├── Backend Worker
│   ├── Kotlin Coroutines + Redis
│   └── Quarkus (reactive)
│
└── Scripting/Tools
    └── Kotlin Script (.kts) or jbang
```

### Comparison Table

| Factor | Ktor | Spring Boot | Javalin |
|--------|------|-------------|---------|
| **Async** | Native coroutines | Suspend functions | Native coroutines |
| **Size** | Lightweight | Full-stack | Very lightweight |
| **Learning Curve** | Low | Low | Very Low |
| **Best For** | Microservices | Enterprise apps | Simple APIs |

---

## 2. Modern Kotlin Features (2.0+)

### Data Classes & Records

```kotlin
// Data class (auto-generates equals, hashCode, toString, copy)
data class User(
    val id: Int,
    val name: String,
    val email: String
)

// Kotlin 1.9+ - Value classes (no allocation overhead)
@JvmInline
value class UserId(val value: Int)

// Kotlin 2.0 - Algebraic Data Types (sealed classes as exhausts)
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
    data object Loading : Result<Nothing>()
}

fun handle(result: Result<User>) = when (result) {
    is Result.Success -> println("Got user: ${result.data.name}")
    is Result.Error -> println("Error: ${result.message}")
    Result.Loading -> println("Loading...")
    // Compiler knows this covers ALL cases!
}
```

### Coroutines (NOT Threads)

```kotlin
// ❌ WRONG - Using threads in Kotlin
fun fetchUsers() = thread {
    val users = httpClient.get("/users")
    users.forEach { uiThread { display(it) } }
}

// ✅ CORRECT - Using coroutines
suspend fun fetchUsers(): List<User> = client.get("/users")

// Launching coroutines
viewModelScope.launch {
    val users = fetchUsers()  // Suspends, no blocking
    _uiState.value = UiState.Success(users)
}

// Flow for streaming (reactive streams)
fun userUpdates(): Flow<User> = database.userChanges()  // Creates flow
    .filter { it.isActive }
    .map { it.toDto() }
    .catch { emit(User.Guest) }

// Collecting flow
userUpdates()
    .onEach { /* update UI */ }
    .launchIn(viewModelScope)
```

### Null Safety

```kotlin
// Nullable types (Kotlin's killer feature)
var name: String = "John"        // Non-null
var nullableName: String? = null // Nullable

// Safe calls - only access if not null
val length = name?.length        // Int? (might be null)

// Elvis operator - default if null
val len = name?.length ?: 0      // Int (never null)

// Not-null assertion (avoid unlesscertain)
val len2 = name!!.length        // Int (throws if null)

// Smart cast
if (user != null) {
    println(user.name)  // Smart cast to non-null
}
```

---

## 3. Dependency Injection

### Koin (Lightweight)

```kotlin
// Define modules
val appModule = module {
    single { Database() }
    single { UserRepository(get()) }
    factory { GetUserUseCase(get()) }
}

// Start Koin
fun main() {
    startKoin {
        modules(appModule)
    }
}

// Inject
class UserService(private val repo: UserRepository)
```

### Hilt (Android/JVM Standard)

```kotlin
// Define module
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    fun provideUserRepository(db: Database): UserRepository {
        return UserRepositoryImpl(db)
    }
}

// Inject in constructor
class UserService @Inject constructor(
    private val userRepository: UserRepository,
    private val emailService: EmailService
) { }
```

---

## 4. Ktor Framework

### Minimal API

```kotlin
// Application
fun main() = runBlocking {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/users") {
                call.respond(UserService.getAll())
            }
            
            get("/users/{id}") {
                val id = call.parameters["id"]?.toInt()
                val user = UserService.getById(id)
                if (user != null) {
                    call.respond(user)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
            
            post("/users") {
                val user = call.receive<User>()
                val created = UserService.create(user)
                call.respond(HttpStatusCode.Created, created)
            }
        }
    }.waitWait()
}
```

### With DI and Validations

```kotlin
// Install features
install(ContentNegotiation) {
    json()
}

install(Validation) {
    body<UserValidation>()
}

// API with error handling
routing {
    get("/users") {
        try {
            val users = userService.getAll()
            call.respond(users)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError)
        }
    }
}
```

---

## 5. Database Patterns

### Exposed (Kotlin SQL)

```kotlin
// Table definition
object Users : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 50)
    val email = varchar("email", 100).uniqueIndex()
}

// DAO pattern
class UserDao {
    fun findById(id: Int): User? = db.query {
        Users.select { Users.id eq id }
            .map { it.toUser() }
            .singleOrNull()
    }
    
    fun findAll(): List<User> = db.query {
        Users.selectAll()
            .map { it.toUser() }
            .toList()
    }
}
```

### Comparison

| Library | Pros | Cons |
|---------|------|------|
| **Exposed** | Kotlin-idiomatic, typesafe | Query DSL limited |
| **Room** | Android standard | Android only |
| **Ktorm** | Type-safe queries | Less maintained |
| **JDBC/raw** | Full control | Verbose |

---

## 6. Testing Patterns

### Kotest + MockK

```kotlin
// Behavior testing
class UserServiceTest : FreeSpec({
    val mockRepo = mockk<UserRepository>()
    val service = UserService(mockRepo)
    
    "getById" - {
        "returns user when found" {
            every { mockRepo.findById(1) } returns User(1, "test@email.com")
            
            val result = service.getById(1)
            
            result.name shouldBe "test@email.com"
        }
        
        "returns null when not found" {
            every { mockRepo.findById(99) } returns null
            
            val result = service.getById(99)
            
            result shouldBe null
        }
    }
})
```

### Testing Tools

| Tool | Purpose |
|------|---------|
| **Kotest** | BDD-style testing |
| **MockK** | Mocking |
| **Strikt** | Assertions |
| **InMemoryDB** | Test databases |
| **Kotest property-based** | Property testing |

---

## 7. Android Compose Patterns

### State Management

```kotlin
@Composable
fun UserListScreen(
    viewModel: UserViewModel = koinViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    when (val state = uiState) {
        is UiState.Loading -> CircularProgressIndicator()
        is UiState.Success -> UserList(state.users)
        is UiState.Error -> ErrorMessage(state.message)
    }
}

// ViewModel with StateFlow
class UserViewModel(
    private val getUsers: GetUsersUseCase
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    init {
        loadUsers()
    }
    
    private fun loadUsers() = viewModelScope.launch {
        _uiState.value = UiState.Loading
        try {
            val users = getUsers()
            _uiState.value = UiState.Success(users)
        } catch (e: Exception) {
            _uiState.value = UiState.Error(e.message ?: "Unknown error")
        }
    }
}
```

---

## 8. Coroutine Patterns

### Structured Concurrency

```kotlin
// ViewModel coroutine scope
class MyViewModel(
    private val repository: UserRepository
) : ViewModel() {
    
    // Best practice: ViewModelScope
    fun loadData() = viewModelScope.launch {
        try {
            val users = repository.getUsers()  // Suspends correctly
            _state.value = users
        } catch (e: Exception) {
            _error.value = e.message
        }
    }
}

// For testing: runBlockingTest
@Test
fun testLoading() = runTest {
    val viewModel = MyViewModel(mockRepo)
    viewModel.loadData()
    
    advanceUntilIdle()  // Wait for coroutines
    verify(mockRepo).getUsers()
}
```

---

## 9. Decision Checklist

Before implementing:

- [ ] **Selected right platform (JVM/Android/KMP)?**
- [ ] **Framework chosen (Ktor/Spring Boot)?**
- [ ] **Coroutines for async, not threads?**
- [ ] **DI framework selected (Koin/Hilt)?**
- [ ] **Database approach chosen?**
- [ ] **Null safety applied?**
- [ ] **Testing strategy defined?**

---

## ❌ Anti-Patterns to Avoid

### ❌ DON'T:
- Use Java threads with ExecutorService (use coroutines)
- Use lateinit var when you can use nullable/optional
- Use !! operator unless 100% certain
- Write Java-style null checks (`if (x != null)`)
- Use synchronous HTTP in coroutines
- Forget structured concurrency (leaked coroutines)

### ✅ DO:
- Use data classes for DTOs
- Use sealed classes for Result types
- Use Kotlin flow for streaming
- Use Kotlin 2.0 type inference and prints
- Use ktor-client with suspend functions
- Apply Kotlin idioms (extension functions, infix)
- Learn Kotlin Multiplatform for cross-platform

---

> **Remember:** Kotlin is about null safety and coroutines.
> Don't write Java in Kotlin. Use idiomatic patterns.
> **Think in Kotlin.**