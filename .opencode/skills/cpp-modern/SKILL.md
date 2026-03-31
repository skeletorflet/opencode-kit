---
name: cpp-modern
description: Modern C++ development principles and decision-making. 
             C++23/C++26, RAII, modern idioms, performance optimization.
---

# C++ Modern - C++23/C++26

> Modern C++ development principles and decision-making.
> **Learn to THINK, not copy-paste C++98 patterns.**

---

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles** for modern C++.

- Use C++20/23 features, not C++98/03
- Prefer RAII and smart pointers
- Don't write C with classes

---

## 1. Standard Selection

### Decision Tree

```
What are you building?
│
├── System/Network Programming
│   ├── C++23/26 (latest features)
│   └── Boost.Asio (async I/O)
│
├── Game Engine / Graphics
│   └── C++23 + GPU compute (CUDA/HIP)
│
├── Embedded
│   ├── C++17 (wide compiler support)
│   └── C++14 (for very constrained)
│
├── Libraries (Reusable)
│   ├── C++20 (modules, concepts)
│   └── Header-only (keep simple)
│
├── Desktop Applications
│   ├── Qt + C++17/20
│   ├── SDL2/ImGui (games/tools)
│   └── wxWidgets
│
└── Web Assembly (WASM)
    └── C++23 compiled to WASM
```

### Compiler Support

| Feature | C++17 | C++20 | C++23 | C++26 |
|---------|-------|-------|-------|-------|
| **Modules** | No | ✅ Partial | ✅ Most | ✅ Full |
| **Concepts** | No | ✅ | ✅ | ✅ |
| **Ranges** | No | ✅ | ✅ | ✅ |
| **Coroutines** | No | ✅ | ✅ | ✅ |
| **static constexpr** | ✅ | ✅ | ✅ | ✅ |

---

## 2. Modern C++ Features

### Concepts (C++20)

```cpp
// OLD: Enable_if SFINAE
template<typename T, typename = std::enable_if_t<
    std::is_integral_v<T>>>
T doubleIt(T val) { return val * 2; }

// MODERN: Concepts (clearer intent)
template<std::integral T>
T doubleIt(T val) { return val * 2; }

// Require clauses
template<typename T>
    requires std::integral<T>
T multiply(T a, T b) { return a * b; }
```

### Ranges (C++20)

```cpp
#include <ranges>

// OLD: Manual loops
std::vector<int> numbers = {1, 2, 3, 4, 5};
std::vector<int> doubled;
std::for_each(numbers.begin(), numbers.end(), 
    [&](int n) { doubled.push_back(n * 2); });

// MODERN: Ranges (C++20)
auto doubled = numbers 
    | std::views::filter([](auto n) { return n > 0; })
    | std::views::transform([](auto n) { return n * 2; });

// Lazy evaluation - doesn't run until iterated
for (auto n : doubled) {
    std::cout << n << " ";
}
```

### std::optional (C++17)

```cpp
#include <optional>

// OLD: Use sentinel values or exceptions
User* findUser(int id) {
    if (/* not found */) return nullptr;
    return &user;
}

// MODERN: std::optional - explicit about nothing
std::optional<User> findUser(int id) {
    if (notFound) return std::nullopt;
    return User{id, "John"};
}

// Usage
auto user = findUser(1);
if (user) {
    std::cout << user->name;
}

// With value or default
std::cout << findUser(99).value_or(User{-1, "Guest"}).name;
```

### std::variant (C++17)

```cpp
#include <variant>

// Type-safe union
struct Error { std::string msg; }
struct Success { int value; }

using Result = std::variant<Error, Success>;

Result process(int input) {
    if (input < 0) return Error{"Negative not allowed"};
    return Success{input * 2};
}

// Pattern matching with std::visit
std::visit([](auto&& r) {
    using T = std::decay_t<decltype(r)>;
    if constexpr (std::is_same_v<T, Error>) {
        std::cerr << "Error: " << r.msg << "\n";
    } else {
        std::cout << "Success: " << r.value << "\n";
    }
}, result);
```

---

## 3. Smart Pointers & RAII

### Ownership Patterns

```cpp
#include <memory>

// unique_ptr - exclusive ownership
auto up = std::make_unique<MyClass>(args);
// Reducción automatizada
// Use: Default for single objects

// shared_ptr - shared ownership (reference counted)
auto sp1 = std::make_shared<MyClass>();
auto sp2 = sp1;  // Both own the object
// Use: When ownership must be shared

// weak_ptr - non-owning reference to shared_ptr
std::weak_ptr<MyClass> wp = sp1;
if (auto locked = wp.lock()) {
    // Use locked copy
}  // expired? check wp.expired()

// DON'T: Raw new/delete
MyClass* p = new MyClass();  // ❌ Dangerous!
// Use: Only when interfacing with C APIs
```

### RAII Pattern

```cpp
// RAII: Resource Acquisition Is Initialization
class FileGuard {
    std::FILE* file;
public:
    explicit FileGuard(const char* path) 
        : file(std::fopen(path, "r")) {}
    
    ~FileGuard() { 
        if (file) std::fclose(file); 
    }
    
    // Non-copyable, non-movable
    FileGuard(const FileGuard&) = delete;
    FileGuard& operator=(const FileGuard&) = delete;
};

// Automatic cleanup - even on exception!
void processFile() {
    FileGuard guard("data.txt");
    // Use file...
} // Automatic cleanup via destructor
```

---

## 4. Modern async

### std::jthread (C++20)

```cpp
#include <thread>

// STOP token - automatic cancellation
std::jthread worker{[](std::stop_token st) {
    while (!st.stop_requested()) {
        doWork();
        std::this_thread::sleep_for(100ms);
    }
}};

// Automatic joining on destruction!
} // Destructor calls request_stop() and join()
```

### Coroutines (C++20)

```cpp
// Async generator (C++23 - simplified)
// NOT modern C++20 coroutines are more verbose

// Instead, use async libraries:
// - Boost.Asio (async I/O)
// - libunifex (Facebook's executor)
// - C++ executors TS

// Using std::future (simple, legacy)
std::future<int> computeAsync(int x) {
    return std::async(std::launch::async, [x]() {
        return x * x;
    });
}
```

---

## 5. Containers & Algorithms

### Container Selection

| Scenario | Best Container | Why |
|----------|----------------|-----|
| Random access | `std::vector` | Cache-friendly |
| Insertions at front | `std::deque` | O(1) front |
| Fast search | `std::unordered_set` | O(1) average |
| Ordered iteration | `std::set` | O(log n) |
| LIFO stack | `std::stack` | Adaptor |
| FIFO queue | `std::queue` | Adaptor |

### Views (C++20) - No Copy!

```cpp
// Views are lazy - NO copying
std::vector<int> data{1,2,3,4,5};

auto v1 = data | std::views::reverse;      // No allocation
auto v2 = v1 | std::views::drop(1);        // Lazy drop
auto v3 = v2 | std::views::transform([](int x) { 
    return x * 2; 
});

for (int x : v3) std::cout << x << " ";
```

---

## 6. Testing Patterns

### Testing Frameworks

```cpp
// GoogleTest (most common)
#include <gtest/gtest.h>

class MathTest : public ::testing::Test {
protected:
    Calculator calc;
};

TEST_F(MathTest, AddTwoNumbers) {
    EXPECT_EQ(calc.add(2, 3), 5);
    EXPECT_NE(calc.add(2, 3), 6);
}

TEST_F(MathTest, DivideByZero) {
    EXPECT_THROW(calc.divide(1, 0), std::invalid_argument);
}
```

### Testing Tools

| Tool | Purpose |
|------|---------|
| **GoogleTest** | Unit testing |
| **Catch2** | Header-only testing |
| **Doctest** | Lightweight |
| **google/benchmark** | Benchmarks |

---

## 7. Safety & Performance

### Bounds Safety

```cpp
// C++23: std::mdspan (multi-dimensional)
std::vector<double> data(9);
std::mdspan<double, std::dextent_t<2, 3>> matrix(data.data(), 3, 3);

// .at() - bounds-checked access
std::vector<int> vec{1, 2, 3};
int x = vec.at(5);  // throws std::out_of_range
```

### Performance Tips

| Don't Do | Do Instead |
|----------|------------|
| `vector` for tiny fixed-size | `std::array` |
| Pass by value for large types | Pass by reference/pointer |
| Premature optimization | Measure first |
| Raw new (except C interop) | `make_unique` / `make_shared` |
| Copying large objects | `std::move` or `std::span` |

---

## 8. Decision Checklist

Before implementing:

- [ ] **C++ standard chosen (what compiler supports)?**
- [ ] **Concepts used instead of SFINAE?**
- [ ] **RAII for resource management?**
- [ ] **Proper smart pointer ownership?**
- [ ] **Testing framework set up?**
- [ ] **Performance requirements analyzed?**

---

## ❌ Anti-Patterns to Avoid

### ❌ DON'T:
- Use C++98 patterns (manual new/delete)
- Use raw pointers for ownership
- Prefer raw arrays (`int arr[10]`)
- Use `using namespace std;` in headers
- Skip const correctness
- Use exception handling for flow control

### ✅ DO:
- Use C++20/23 features where supported
- Use `std::vector` as default container
- Use `constexpr`/`consteval` for compile-time
- Use `std::span` for array views
- Use concepts for constraints
- Use ranges over loops

---

> **Remember:** Modern C++ is about safety and expressiveness.
> Use C++20/23 features and RAII patterns.
> **Think in modern C++.**