---
name: swiftui-app
description: SwiftUI app template principles. Swift 5.9+, Swift Concurrency, MVVM.
---

# SwiftUI Application Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | SwiftUI |
| Language | Swift 5.9+ |
| Architecture | MVVM |
| Networking | URLSession / Alamofire |
| Local Storage | SwiftData |
| DI | @Environment |

---

## Directory Structure

```
project-name/
├── App/
│   └── ProjectNameApp.swift
├── Views/
│   ├── ContentView.swift
│   ├── UserListView.swift
│   ├── UserDetailView.swift
│   └── Components/
│       ├── LoadingView.swift
│       └── ErrorView.swift
├── ViewModels/
│   ├── UserViewModel.swift
│   └── AuthViewModel.swift
├── Models/
│   ├── User.swift
│   └── Post.swift
├── Services/
│   ├── APIClient.swift
│   └── AuthService.swift
├── Repositories/
│   └── UserRepository.swift
├── Utilities/
│   ├── NetworkError.swift
│   └── Extensions/
└── Preview Content/
```

---

## Setup Steps

1. `xcrun simctl list devices` (check simulators)
2. Create project in Xcode
3. Add dependencies via SPM
4. `xcodebuild`

---

## Best Practices

- Use @Observable (iOS 17+) or @StateObject
- Use async/await for networking
- Use SwiftData for persistence