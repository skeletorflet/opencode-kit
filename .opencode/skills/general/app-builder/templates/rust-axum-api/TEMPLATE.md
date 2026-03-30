---
name: rust-axum-api
description: Rust Axum REST API template principles. Tokio, SQLx, Tower, Serde.
---

# Rust Axum API Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Axum |
| Runtime | Tokio |
| Database | SQLx |
| Validation | Validator |
| Auth | JWT (jsonwebtoken) |
| Serialization | Serde |

---

## Directory Structure

```
project-name/
├── src/
│   ├── main.rs
│   ├── app.rs
│   ├── config.rs
│   ├── db.rs
│   ├── error.rs
│   ├── handler/
│   │   ├── mod.rs
│   │   ├── auth.rs
│   │   └── user.rs
│   ├── middleware/
│   │   ├── mod.rs
│   │   └── auth.rs
│   ├── model/
│   │   ├── mod.rs
│   │   ├── user.rs
│   │   └── post.rs
│   ├── repository/
│   │   ├── mod.rs
│   │   ├── user_repo.rs
│   │   └── post_repo.rs
│   ├── service/
│   │   ├── mod.rs
│   │   ├── auth_service.rs
│   │   └── user_service.rs
│   ├── router.rs
│   └── schema.rs
├── migrations/
├── tests/
├── Cargo.toml
├── Dockerfile
└── .env.example
```

---

## Setup Steps

1. `cargo new project-name --bin`
2. Add to Cargo.toml:
   ```toml
   axum = "0.7"
   tokio = { version = "1", features = ["full"] }
   sqlx = { version = "0.7", features = ["runtime-tokio-native-tls", "postgres"] }
   serde = { version = "1", features = ["derive"] }
   tower = "0.4"
   tower-http = { version = "0.5", features = ["cors", "trace"] }
   ```
3. `cargo run`

---

## Best Practices

- Use Result for error handling
- Use async/await with Tokio
- Use tower for middleware
- Use SQLx for type-safe queries