---
name: kotlin-android
description: Kotlin Android template principles. Jetpack Compose, Hilt, Coroutines.
---

# Kotlin Android Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Jetpack Compose |
| Language | Kotlin 1.9+ |
| Architecture | Clean + MVVM |
| DI | Hilt |
| Async | Coroutines + Flow |
| Navigation | Compose Navigation |
| Networking | Retrofit + OkHttp |
| Image Loading | Coil |

---

## Directory Structure

```
project-name/
├── app/
│   └── src/main/
│       ├── java/com/example/project/
│       │   ├── ProjectNameApp.kt
│       │   ├── MainActivity.kt
│       │   ├── di/
│       │   │   └── AppModule.kt
│       │   ├── data/
│       │   │   ├── remote/
│       │   │   │   ├── API.kt
│       │   │   │   └── dto/
│       │   │   ├── repository/
│       │   │   │   └── UserRepositoryImpl.kt
│       │   │   └── local/
│       │   │       └── Database.kt
│       │   ├── domain/
│       │   │   ├── model/
│       │   │   ├── repository/
│       │   │   │   └── UserRepository.kt
│       │   │   └── usecase/
│       │   │       └── GetUserUseCase.kt
│       │   ├── presentation/
│       │   │   ├── navigation/
│       │   │   ├── theme/
│       │   │   ├── user/
│       │   │   │   ├── UserListScreen.kt
│       │   │   │   └── UserViewModel.kt
│       │   │   └── components/
│       │   └── util/
│       └── res/
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties
```

---

## Setup Steps

1. Create project with Android Studio (Kotlin + Compose template)
2. Add Hilt: `plugins { id("com.google.dagger.hilt.android") }`
3. Configure build.gradle.kts with dependencies
4. Run `./gradlew assembleDebug`

---

## Best Practices

- Use Hilt for DI
- Use Coroutines + Flow for async
- Use Clean Architecture layers
- Use Compose Navigation
- Use Coil for images