---
name: systematic-debugging
description: 4-phase systematic debugging methodology that adapts tools to each language.
             Auto-detects language and applies appropriate debugging tools.
---

# Systematic Debugging - Multi-Language

> **IMPORTANT:** This skill auto-detects the project language and applies appropriate debugging tools.
> **Source:** Based on superpowers/debugging methodology

---

## 🔍 Auto-Detección de Lenguaje

```
Detecta automáticamente el lenguaje:
├── .py → Python debugging
├── .java → Java debugging
├── .cs → C# debugging
├── .go → Go debugging
├── .rs → Rust debugging
├── .rb → Ruby debugging
├── .ts/.js → JS/TS debugging
├── .php → PHP debugging
├── .swift → Swift debugging
└── .kt → Kotlin debugging
```

---

## 🔧 Herramientas de Debugging por Lenguaje

### Python

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **pdb** | Debugger interactivo | `python -m pdb script.py` |
| **breakpoint()** | Debugger moderno (Python 3.7+) | `breakpoint()` |
| **pytest --capture** | Debug de tests | `pytest -s` |
| **ipdb** | Mejor debugger | `pip install ipdb; python -m ipdb script.py` |
| **snoop** | Decorator para debug | `pip install snoop` |
| **Pyright** | Type checking | `pyright script.py` |

```python
# Python: Ejemplo de debugging
import pdb

def get_user(user_id):
    breakpoint()  # Entra en modo debug
    user = db.query(user_id)
    pdb.set_trace()  # Alternativa
    return user
```

### JavaScript / TypeScript

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **Chrome DevTools** | Debug en navegador | F12 → Console/Sources |
| **Node debugger** | Debug en Node | `node --inspect script.js` |
| **VS Code** | Debugger integrado | F5 |
| **console.log** | Logging básico | `console.log()` |
| **ndb** | Better Node debug | `npx ndb script.js` |

```javascript
// JavaScript: Debugging
console.log('Debug:', variable);  // Basic
debugger; // Breakpoint en DevTools
```

### Go

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **Delve** | Debugger oficial | `dlv debug ./package` |
| **go test -v** | Verbose testing | `go test -v` |
| **log** | Logging | `import "log"` |
| **fmt.Printf** | Print debugging | `fmt.Printf("%+v", value)` |

```go
// Go: Debugging
import (
    "fmt"
    "log"
)

func main() {
    // Printf con formato
    fmt.Printf("User: %+v\n", user)
    
    // Logging
    log.Printf("Processing user: %d", userID)
}
```

### Rust

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **rust-gdb/rust-lldb** | Debugger | `cargo debug` → GDB/LLDB |
| **rust-analyzer** | IDE integration | VS Code + rust-analyzer |
| **RUST_BACKTRACE** | Stack traces | `RUST_BACKTRACE=1 cargo run` |
| **println! debug** | Print debugging | `println!("{:?}", value)` |

```rust
// Rust: Debugging
println!("Debug: {:?}", value);  // Debug trait
eprintln!("Error: {}", error);   // Error output

// Con Backtrace
RUST_BACKTRACE=1 cargo run
```

### Java

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **jdb** | Debugger命令行 | `jdb -classpath . MyClass` |
| **jConsole** | JMX monitoring | `jconsole` |
| **VisualVM** | Profiling | `jvisualvm` |
| **IntelliJ/Eclipse** | IDE debug | F5/F6 |

### C# / .NET

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **dotnet-sos** | Debugging tools | `dotnet tool install -g dotnet-sos` |
| **VS** | Visual Studio debugger | F5 |
| **VS Code** | C# debugger | F5 |
| **Rider** | JetBrains debugger | F7 |

### Ruby

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **byebug** | Debugger | `require 'byebug'; byebug` |
| **pry** | REPL debugger | `binding.pry` |
| **IRB** | Interactive Ruby | `irb` |

```ruby
# Ruby: Debugging
require 'byebug'
byebug

# or
binding.pry
```

### PHP

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **Xdebug** | Debugger | `xdebug` extension |
| **phpdbg** | Debugger CLI | `phpdbg` |
| **var_dump** | Dump variables | `var_dump($var)` |

---

## 📋 4-Phase Debugging Process

### Phase 1: Reproduce

**Before fixing, reliably reproduce the issue.**

```markdown
## Reproduction Steps
1. [Exact step to reproduce]
2. [Next step]
3. [Expected vs actual result]

## Reproduction Rate
- [ ] Always (100%)
- [ ] Often (50-90%)
- [ ] Sometimes (10-50%)
- [ ] Rare (<10%)
```

**Language-specific commands:**

```bash
# Python: Reproduce with error
python script.py 2>&1

# Go: Reproduce with stack trace
RACE_DETECTION_ENABLED=1 go run -race main.go

# Rust: Reproduce with backtrace
RUST_BACKTRACE=full cargo run
```

### Phase 2: Isolate

**Narrow down the source.**

```markdown
## Isolation Questions
- When did this start happening?
- What changed recently?
- Does it happen in all environments?
- Can we reproduce with minimal code?
- What's the smallest change that triggers it?
```

**Techniques by language:**

```python
# Python: Reduce to minimal case
def test_minimal():
    # Isolate the failing path
    pass
```

```go
// Go: Isolate with isolated unit test
func Test_isolated(t *testing.T) {
    // Test only the failing function
}
```

### Phase 3: Understand

**Find the root cause, not just symptoms.**

```markdown
## Root Cause Analysis
### The 5 Whys
1. Why: [First observation]
2. Why: [Deeper reason]
3. Why: [Still deeper]
4. Why: [Getting closer]
5. Why: [Root cause]
```

### Phase 4: Fix & Verify

**Fix and verify it's truly fixed.**

```markdown
## Fix Verification
- [ ] Bug no longer reproduces
- [ ] Related functionality still works
- [ ] No new issues introduced
- [ ] Test added to prevent regression
```

---

## 🛠️ Debugging Checklist

```markdown
## Before Starting
- [ ] Can reproduce consistently?
- [ ] Have minimal reproduction case?
- [ ] Understand expected behavior?
- [ ] Know what language/runtime?

## During Investigation (Language-adapted)
- [ ] Check recent changes (git log)
- [ ] Check logs for errors
- [ ] Add logging/debug statements
- [ ] Use language-appropriate debugger

## After Fix
- [ ] Root cause documented?
- [ ] Fix verified?
- [ ] Regression test added?
- [ ] Similar code checked?
```

---

## 🔧 Common Debugging Commands (Multi-Language)

### Recent Changes

```bash
# All languages
git log --oneline -20
git diff HEAD~5
```

### Search for Errors

```bash
# Python
grep -r "Error" --include="*.py" .

# TypeScript
grep -r "throw new Error" --include="*.ts" .

# Go
grep -r "error" --include="*.go" .
```

### Check Logs

```bash
# System
pm2 logs app-name --err --lines 100      # Node.js
journalctl -u service -n 50               # Linux systemd
docker logs container-name --tail 50      # Docker
```

---

## 🚫 Anti-Patterns (Language-Agnostic)

❌ **Random changes** - "Maybe if I change this..."
❌ **Ignoring evidence** - "That can't be the cause"
❌ **Assuming** - "It must be X" without proof
❌ **Not reproducing first** - Fixing blindly
❌ **Stopping at symptoms** - Not finding root cause

---

## 📋 Error Patterns by Language

| Language | Common Errors |
|----------|---------------|
| **Python** | TypeError, NameError, ImportError |
| **JavaScript** | TypeError, undefined is not a function |
| **Go** | nil pointer dereference, race conditions |
| **Rust** | borrow checker errors, Option/Result |
| **Java** | NullPointerException, ClassNotFoundException |
| **C#** | NullReferenceException, StackOverflowException |
| **Ruby** | NoMethodError, TypeError |
| **PHP** | Undefined index, Call to undefined function |

---

## 🧪 Quick Debug Commands by Language

```bash
# Python - Verbose error trace
python -v script.py

# Node.js - Debug mode
NODE_DEBUG=模块 node script.js

# Go - Race detector
go run -race main.go

# Rust - Full backtrace
RUST_BACKTRACE=full cargo test

# Ruby - Debug mode
ruby -d script.rb

# PHP - Xdebug
php -d xdebug.mode=debug script.php
```

> **Remember:** The debugging methodology is the same for all languages.
> Only the **tools and commands** differ. Adapt accordingly.