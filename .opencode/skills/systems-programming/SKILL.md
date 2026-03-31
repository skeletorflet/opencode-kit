---
name: systems-programming
description: Systems programming patterns for C++, Rust, and low-level development. Covers memory management, concurrency, FFI, and performance optimization.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: backend
---

# Systems Programming

## What I Do

- Design memory-safe systems code patterns
- Implement low-level concurrency primitives
- Write FFI bindings between languages
- Optimize for cache locality and CPU performance
- Apply zero-cost abstraction patterns

## When to Use Me

- Writing performance-critical code
- Implementing custom data structures
- Creating FFI bindings
- Optimizing hot paths
- Working with unsafe code

## Key Principles

1. **RAII**: Resource Acquisition Is Initialization for all resources
2. **Zero-Cost Abstractions**: Abstractions should compile to optimal code
3. **Cache Locality**: Design data structures for CPU cache efficiency
4. **Lock-Free When Possible**: Prefer atomics and lock-free structures
5. **Measure First**: Profile before optimizing

## Common Patterns

### RAII Pattern (C++)
```cpp
class FileHandle {
public:
    explicit FileHandle(const std::string& path)
        : file_(std::fopen(path.c_str(), "r")) {
        if (!file_) throw std::runtime_error("Failed to open file");
    }
    ~FileHandle() { if (file_) std::fclose(file_); }
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
private:
    std::FILE* file_;
};
```

## Validation

```bash
# C++
clang-tidy src/*.cpp -- -std=c++23
valgrind --leak-check=full ./build/app

# Rust
cargo clippy -- -D warnings
cargo test
```
