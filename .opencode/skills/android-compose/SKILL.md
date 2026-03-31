---
name: android-compose
description: Jetpack Compose expert for modern Android UI development. Covers composables, state management, navigation, and Material 3 design.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: mobile
---

# Jetpack Compose Expert

## What I Do

- Build UI with Jetpack Compose declarative patterns
- Manage state with StateFlow, ViewModel, and Compose state
- Implement navigation with Compose Navigation
- Apply Material 3 design system
- Optimize recomposition and performance

## When to Use Me

- Building Android UI with Jetpack Compose
- Migrating from XML to Compose
- Implementing Material 3 design
- Managing UI state in Compose
- Creating custom composables

## Key Principles

1. **Unidirectional Data Flow**: State flows down, events flow up
2. **State Hoisting**: Lift state to the caller for reusability
3. **Remember + MutableState**: Use for local composable state
4. **ViewModel for Screen State**: Use ViewModel for screen-level state
5. **Key for Lists**: Always provide stable keys in LazyColumn/LazyRow

## Common Patterns

### State Hoisting
```kotlin
@Composable
fun GreetingScreen(viewModel: GreetingViewModel = viewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    GreetingContent(
        state = state,
        onNameChange = { viewModel.onNameChange(it) },
        onGreet = { viewModel.greet() }
    )
}

@Composable
private fun GreetingContent(
    state: GreetingState,
    onNameChange: (String) -> Unit,
    onGreet: () -> Unit
) {
    Column(modifier = Modifier.padding(16.dp)) {
        OutlinedTextField(
            value = state.name,
            onValueChange = onNameChange,
            label = { Text("Name") }
        )
        Button(onClick = onGreet, modifier = Modifier.padding(top = 8.dp)) {
            Text("Greet")
        }
        if (state.greeting.isNotEmpty()) {
            Text(state.greeting, modifier = Modifier.padding(top = 16.dp))
        }
    }
}
```

## Validation

```bash
./gradlew assembleDebug
./gradlew test
./gradlew connectedAndroidTest
```
