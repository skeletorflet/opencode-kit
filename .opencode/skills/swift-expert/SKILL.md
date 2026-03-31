---
name: swift-expert
description: Swift development principles and decision-making. 
             Swift 5.9+, SwiftUI, Swift Concurrency (async/await, actors).
---

# Swift Expert - Modern Swift 5.9+

> Swift development principles and decision-making.
> **Learn to THINK, not copy-paste patterns.**

---

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles** for Swift development.

- ASK user for platform (iOS, macOS, Linux, Server)
- Use Swift Concurrency (async/await), not completion handlers
- Don't mix UIKit patterns in SwiftUI apps

---

## 1. Platform Selection

### Decision Tree

```
What are you building?
│
├── iOS/tvOS/watchOS App
│   ├── SwiftUI (modern UI - RECOMMENDED)
│   └── UIKit (legacy, complex animations)
│
├── macOS Desktop App
│   ├── SwiftUI + AppKit (best of both)
│   └── AppKit (full control)
│
├── Cross-Platform CLI Tool
│   └── Swift Package + swift build
│
├── Server-Side API
│   ├── Vapor (most popular)
│   ├── Hummingbird (lighter)
│   └── Fast (async/)
│
├── Web (Swift->WASM)
│   └── SwiftWasm (experimental)
│
└── Library/Framework
    └── Swift Package Manager
```

### Comparison Table

| Factor | SwiftUI | UIKit | SwiftUI + UIKit |
|--------|---------|-------|-----------------|
| **Learning Curve** | Lower | Higher | Mixed |
| **Declarative** | ✅ Yes | ❌ No | ✅ Partial |
| **Reuse across platforms** | ✅ Best | ❌ No | ✅ Good |
| **Animations** | Built-in | Manual | Via UIViewRepresentable |

---

## 2. Swift Concurrency (Modern)

### async/await (Swift 5.5+)

```swift
// OLD: Completion handlers
func fetchUser(id: Int, completion: @escaping (User?) -> Void) {
    // ...
    completion(user)
}

// Usage
fetchUser(id: 1) { user in
    print(user?.name)
}

// NEW: async/await (Swift 5.5+)
func fetchUser(id: Int) async throws -> User {
    let url = URL(string: "https://api.com/users/\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

// Usage (simple)
Task {
    do {
        let user = try await fetchUser(id: 1)
        print(user.name)
    } catch {
        print(error)
    }
}
```

### Actors (Thread Safety)

```swift
// OLD: Manual thread safety with locks
class BankAccount {
    private var balance: Double = 0
    private let lock = NSLock()
    
    func deposit(_ amount: Double) {
        lock.lock()
        balance += amount
        lock.unlock()
    }
}

// MODERN: Actors (Swift 5.7+)
actor BankAccount {
    private var balance: Double = 0
    
    func deposit(_ amount: Double) {
        balance += amount  // Thread-safe automatically
    }
    
    func withdraw(_ amount: Double) -> Double {
        if balance >= amount {
            balance -= amount
            return amount
        }
        return 0
    }
}

// Usage
let account = BankAccount()
await account.deposit(100)  // await when accessing
```

### AsyncSequence

```swift
// Streaming data
func numbers() -> AsyncStream<Int> {
    AsyncStream { continuation in
        Task {
            for i in 1...5 {
                continuation.yield(i)
                try await Task.sleep(for: .milliseconds(500))
            }
            continuation.finish()
        }
    }
}

// Usage
Task {
    for await number in numbers() {
        print(number)  // Prints 1, 2, 3, 4, 5
    }
}
```

---

## 3. SwiftUI Patterns

### State Management

```swift
// StateObject for reference types (persists)
class UserViewModel: ObservableObject {
    @Published var users: [User] = []
    
    func loadUsers() async {
        // async load
    }
}

struct UserListView: View {
    @StateObject private var viewModel = UserViewModel()  // Creates once
    
    var body: some View {
        List(viewModel.users) { user in
            Text(user.name)
        }
    }
}

// @Binding for two-way binding
struct EditView: View {
    @Binding var user: User
    
    var body: some View {
        TextField("Name", text: $user.name)  // Two-way binding!
    }
}
```

### Dependency Injection with @Environment

```swift
// Define a key
struct DatabaseKey: EnvironmentKey {
    static var defaultValue: Database = {
        fatalError("Set Database in app")
    }()
}

// Add to environment
ContentView()
    .environment(\.database, Database())

// Use in views
struct UserListView: View {
    @Environment(\.database) var database
    
    var body: some View {
        // Use database
    }
}
```

---

## 4. Server-Side Swift

### Vapor Routing

```swift
import Vapor

func configureRoutes(_ app: Application) throws {
    // GET /users
    app.get("users") { req async throws -> [User] in
        try await User.query.all()
    }
    
    // GET /users/:id
    app.get("users", ":id") { req async throws -> User in
        guard let user = try await User.find(
            req.parameters.get("id"), 
            on: req.db
        ) else {
            throw Abort(.notFound)
        }
        return user
    }
    
    // POST /users
    app.post("users") { req async throws -> User in
        let user = try req.content.decode(User.self)
        try await user.save(on: req.db)
        return user
    }
}
```

### Comparison

| Framework | Best For | Performance |
|-----------|----------|-------------|
| **Vapor** | Full-featured APIs | Good |
| **Hummingbird** | Lightweight, high performance | Better |
| **Fast** | io_uring, async-first | Best |

---

## 5. Value Types & Structs

### Choose Wisely

```swift
// Use struct for: Values, Data without identity
struct User: Identifiable, Codable {
    let id: UUID
    var name: String
    var email: String
}

// Use class for: Reference types, shared identity, UI state
class UserManager: ObservableObject {
    @Published var currentUser: User?
    // Shared identity!
}

// Use actor for: Thread-safe state
actor Cache {
    private var store: [String: Data] = [:]
    
    func get(_ key: String) -> Data? {
        store[key]
    }
    
    func set(_ key: String, value: Data) {
        store[key] = value
    }
}
```

---

## 6. Error Handling

### Result Type & throws

```swift
// Using throws (Swift 5.0+)
enum MyError: Error {
    case notFound
    case invalidInput(String)
    case network(Error)
}

func fetchUser(id: Int) async throws -> User {
    guard id > 0 else {
        throw MyError.invalidInput("ID must be positive")
    }
    
    do {
        let user = try await api.call(id)
        return user
    } catch let error as MyError {
        throw error  // Re-throw domain errors
    } catch {
        throw MyError.network(error)  // Wrap
    }
}

// Usage with Result type
let result = await Result { try await fetchUser(id: 1) }
result.get()  // Throws if error

result.map { user in user.name }
    .flatMap { /* chain */ }
```

---

## 7. Testing Patterns

### XCTest + @MainActor

```swift
import XCTest

@MainActor
class UserViewModelTests: XCTestCase {
    var viewModel: UserViewModel!
    
    override func setUp() {
        viewModel = UserViewModel()
    }
    
    func test_loadUsers_updatesState() async {
        // Given
        let mockService = MockUserService()
        
        // When
        await viewModel.loadUsers()
        
        // Then
        XCTAssertFalse(viewModel.users.isEmpty)
    }
}

// Blueprints for readable tests
// GWT: Given -> When -> Then
```

### Testing Tools

| Tool | Purpose |
|------|---------|
| **XCTest** | Built-in testing |
| **Quick/Nimble** | BDD style (more readable) |
| **XCTAsyncUtils** | Async testing utilities |
| **SnapshotTesting** | UI snapshot tests |

---

## 8. Package Management

### Swift Package Manager

```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0"),
    .package(url: "https://github.com/SwiftUIX/SwiftUIX.git", branch: "main"),
]
```

---

## 9. Decision Checklist

Before implementing:

- [ ] **Platform (iOS, macOS, Linux)?**
- [ ] **SwiftUI selected for UI?**
- [ ] **Swift Concurrency used (async/await, actors)?**
- [ ] **Dependency injection via Environment?**
- [ ] **Value types vs reference types chosen?**
- [ ] **Testing strategy defined?**

---

## ❌ Anti-Patterns to Avoid

### ❌ DON'T:
- Use completion handlers when async/await exists
- Use class for everything (over-use reference types)
- Use ! for force unwrapping (use guard/if let)
- Use CocoaPods when SPM exists
- Skip @MainActor for UI code

### ✅ DO:
- Use Swift Concurrency (async/await everywhere)
- Use actors for thread-safe state
- Use structs + SwiftUI whenever possible
- Use async/await + AsyncSequence for streams
- Use @Environment for DI in SwiftUI
- Use Swift Package Manager

---

> **Remember:** Swift is designed for safety and concurrency.
> Use Swift Concurrency natively, not completion handlers.
> **Think in Swift.**