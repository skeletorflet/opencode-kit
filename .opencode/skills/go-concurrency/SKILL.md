---
name: go-concurrency
description: Go concurrency patterns expert. Covers goroutines, channels, sync primitives, context, and concurrent design patterns.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: backend
---

# Go Concurrency

## What I Do

- Design goroutine patterns with proper lifecycle management
- Implement channel-based communication patterns
- Use sync primitives correctly (Mutex, RWMutex, WaitGroup, Once)
- Handle context cancellation and timeouts
- Prevent goroutine leaks and race conditions

## When to Use Me

- Writing concurrent Go code
- Debugging race conditions
- Implementing worker pools
- Designing producer-consumer patterns
- Optimizing parallel processing

## Key Principles

1. **Share Memory by Communicating**: Prefer channels over shared state
2. **Context is King**: Always pass context for cancellation
3. **No Leaked Goroutines**: Every goroutine must have an exit path
4. **Race Detector**: Always test with `-race` flag
5. **ErrGroup**: Use for managing groups of goroutines

## Common Patterns

### Worker Pool
```go
func workerPool(ctx context.Context, jobs <-chan Job, results chan<- Result, workers int) {
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                select {
                case <-ctx.Done():
                    return
                case results <- process(job):
                }
            }
        }()
    }
    wg.Wait()
    close(results)
}
```

### Fan-Out, Fan-In
```go
func fanOut(ctx context.Context, input <-chan int, n int) []<-chan int {
    outputs := make([]<-chan int, n)
    for i := 0; i < n; i++ {
        outputs[i] = worker(ctx, input)
    }
    return outputs
}
```

## Validation

```bash
go test -race ./...
go vet ./...
```
