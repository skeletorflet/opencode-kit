---
name: lint-and-validate
description: Automatic multi-language quality control, linting, and static analysis. 
             Auto-detects project language and applies appropriate tooling.
             Triggers on: lint, format, check, validate, types, static analysis.
allowed-tools: Read, Glob, Grep, Bash
version: 2.0
---

# Lint and Validate - Multi-Language

> **MANDATORY:** Run appropriate validation tools after EVERY code change.
> **IMPORTANT:** This skill auto-detects the project language and applies the correct linting stack.

---

## 🔍 Auto-Detección de Lenguaje

```
Detecta automáticamente el lenguaje del proyecto:
├── pyproject.toml / requirements.txt → Python (Ruff, mypy)
├── package.json → JavaScript/TypeScript (ESLint, tsc)
├── go.mod → Go (go fmt, golangci-lint)
├── Cargo.toml → Rust (cargo clippy, cargo fmt)
├── pom.xml / build.gradle → Java (Checkstyle)
├── *.csproj → C# (.NET format, StyleCop)
├── Gemfile → Ruby (RuboCop)
├── composer.json → PHP (PHP-CS-Fixer, PHPStan)
├── Package.swift → Swift (SwiftLint)
├── build.gradle.kts → Kotlin (ktlint)
└── CMakeLists.txt → C++ (clang-format)
```

---

## 📋 Herramientas por Lenguaje

### Python

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **Ruff** | Linting rápido | `ruff check . --fix` |
| **Black** | Formateo | `black .` |
| **isort** | Import sorting | `isort .` |
| **MyPy** | Tipos estáticos | `mypy .` |
| **Bandit** | Seguridad | `bandit -r . -ll` |
| **Flake8** | Estilo PEP 8 | `flake8 .` |

```bash
# Python: Full lint pipeline
ruff check . --fix && black . --check && mypy . && bandit -r . -ll
```

### JavaScript / TypeScript

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **ESLint** | Linting | `npx eslint . --fix` |
| **Prettier** | Formateo | `npx prettier . --write` |
| **TypeScript** | Tipos | `npx tsc --noEmit` |
| **npm audit** | Seguridad | `npm audit --audit-level=high` |

```bash
# JavaScript/TypeScript: Full lint pipeline
npx eslint . --fix && npx prettier . --check && npx tsc --noEmit
```

### Go

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **go fmt** | Formateo | `go fmt ./...` |
| **go vet** | Análisis estático | `go vet ./...` |
| **golangci-lint** | Linting completo | `golangci-lint run ./...` |
| **staticcheck** | Análisis estático | `staticcheck ./...` |

```bash
# Go: Full lint pipeline
go fmt ./... && go vet ./... && golangci-lint run ./...
```

### Rust

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **cargo fmt** | Formateo | `cargo fmt --check` |
| **cargo clippy** | Linting | `cargo clippy -- -D warnings` |
| **cargo test** | Tests | `cargo test` |
| **cargo audit** | Seguridad | `cargo audit` |

```bash
# Rust: Full lint pipeline
cargo fmt --check && cargo clippy -- -D warnings && cargo test
```

### Java

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **Checkstyle** | Estilo de código | `mvn checkstyle:check` |
| **SpotBugs** | Análisis estático | `mvn spotbugs:check` |
| **PMD** | Análisis de código | `mvn pmd:check` |
| **Google Java Format** | Formateo | `google-java-format -d .` |

```bash
# Java: Full lint pipeline (Maven)
mvn checkstyle:check spotbugs:check pmd:check
```

### C# / .NET

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **dotnet format** | Formateo | `dotnet format --verify-no-changes` |
| **dotnet build** | Compilación | `dotnet build --no-restore` |
| **StyleCopAnalyzers** | Estilo | `dotnet build` (incluido) |
| **Roslynator** | Análisis | `dotnet build` |

```bash
# C#: Full lint pipeline
dotnet format --verify-no-changes && dotnet build --no-restore
```

### Ruby

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **RuboCop** | Linting | `rubocop -a` |
| **Brakeman** | Seguridad | `brakeman -w 1` |
| **bundler-audit** | Dependencias | `bundler-audit` |

```bash
# Ruby: Full lint pipeline
rubocop -a && brakeman -w 1 && bundler-audit
```

### PHP

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **PHP-CS-Fixer** | Estilo | `php-cs-fixer fix .` |
| **PHPStan** | Análisis estático | `phpstan analyse .` |
| **psalm** | Análisis estático | `psalm .` |
| **PHPUnit** | Tests | `phpunit` |

```bash
# PHP: Full lint pipeline
php-cs-fixer fix . && phpstan analyse . --level=max
```

### Swift

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **SwiftLint** | Linting | `swiftlint` |
| **SwiftFormat** | Formateo | `swiftformat .` |
| **swift build** | Compilación | `swift build` |

```bash
# Swift: Full lint pipeline
swiftlint && swiftformat . && swift build
```

### Kotlin

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **ktlint** | Linting | `ktlint .` |
| **detekt** | Análisis estático | `detekt .` |
| **kotlinc** | Compilación | `kotlinc -include-runtime -d app.jar` |

```bash
# Kotlin: Full lint pipeline
ktlint . && detekt .
```

### C / C++

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **clang-format** | Formateo | `clang-format -i *.cpp` |
| **cppcheck** | Análisis estático | `cppcheck .` |
| **clang-tidy** | Linting | `clang-tidy .` |

```bash
# C++: Full lint pipeline
clang-format -i *.cpp *.h && cppcheck . && clang-tidy .
```

---

## 🔄 Pipeline Universal

```
INPUT: Proyecto multi-lenguaje
       ├── Carpeta / archivo a validar
       └── Auto-detección de lenguajes presentes

PROCESO:
1. Detectar lenguajes en el proyecto (glob *.{ext})
2. Para cada lenguaje:
   a. Aplicar linting (dependencies/tooling check)
   b. Aplicar formatting
   c. Verificar tipos/análisis estático
3. Agregar warnings de security scan
4. Aggregate results

OUTPUT: Reporte de errores y warnings por lenguaje
```

---

## 📋 Decision Tree

```
¿Qué validación necesito?

├── Necesito verificartypes
│   ├── Python → mypy
│   ├── TypeScript → tsc --noEmit
│   ├── Go → go vet
│   ├── Rust → cargo clippy
│   ├── Java → mvn checkstyle:check
│   └── C# → dotnet build --no-restore

├── Necesito formatear código
│   ├── Python → black
│   ├── JS/TS → prettier
│   ├── Go → go fmt
│   ├── Rust → cargo fmt
│   ├── PHP → php-cs-fixer
│   ├── Swift → swiftformat
│   └── C++ → clang-format

└── Necesito verificar seguridad
    ├── Python → bandit
    ├── JS/TS → npm audit
    ├── Go → golangci-lint
    ├── Ruby → brakeman
    └── PHP → phpstan
```

---

## 🔴 The Quality Loop

1. **Write/Edit Code**
2. **Run Auto-Lint:** Determinar lenguaje y ejecutar tools apropiadas
3. **Analyze Report:** Revisar errores y warnings
4. **Fix & Repeat:** No terminar hasta que esté limpio

> 🔴 **Strict Rule:** No code should be committed or reported as "done" without passing lint checks.
> 🔴 **If no tool is configured:** Check the project root for config files (.eslintrc, pyproject.toml, go.mod) and **suggest/create** appropriate configuration.

---

## 🛠️ Scripts

| Script | Propósito | Comando |
|--------|-----------|---------|
| `scripts/lint_runner.py` | Ejecución multi-lenguaje | `python scripts/lint_runner.py <project_path>` |
| `scripts/type_coverage.py` | Análisis de cobertura de tipos | `python scripts/type_coverage.py <project_path>` |
| `scripts/security_check.py` | Escaneo de seguridad | `python scripts/security_check.py <project_path>` |

---

## 🚨 Ejemplo de Output

```markdown
## Lint Results: /project

### Python (detected via pyproject.toml)
✅ Ruff passed
✅ Black formatted correctly
✅ MyPy: 0 errors, 0 warnings

### TypeScript (detected via package.json)  
✅ ESLint passed
⚠️ Prettier: 2 files needs formatting (run with --write)
❌ TypeScript: 3 errors found

### Errors to fix:
[file1.ts:12] Type error: Argument of type 'string' is not assignable to parameter of type 'number'
[file2.ts:5]  TS2304: Cannot find name 'Undefinec'
[app.ts:45]   TS7006: Parameter 'userId' implicitly has an 'any' type

Should I fix these errors?
```

---

## 📋 Before Running Lint

| Check | Question |
|-------|----------|
| ✅ **Language detected?** | What language(s) is the project? |
| ✅ **Tools available?** | Are the lint tools installed? |
| ✅ **Config exists?** | Does the project have lint config? |
| ✅ **Dependencies installed?** | Did you run npm install / pip install / go mod download? |

> **Tip:** If tools aren't installed, offer to install them or configure them.