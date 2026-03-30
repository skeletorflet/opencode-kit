---
name: angular-app
description: Angular 18+ template with standalone components, signals, and Tailwind CSS.
---

# Angular Application Template (2026)

## Tech Stack

| Component | Technology | Version / Notes |
|-----------|------------|-----------------|
| Framework | Angular | v18+ (Standalone, Signals) |
| Language | TypeScript | v5+ (Strict Mode) |
| Styling | Tailwind CSS | v4 (CSS-first config) |
| State | Angular Signals | Native reactivity |
| Testing | Vitest + Playwright | Unit + E2E |
| Build | Vite | Fast builds |

---

## Directory Structure

```
project-name/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── models/
│   │   ├── features/
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.routes.ts
│   │   │   │   └── home.spec.ts
│   │   │   └── auth/
│   │   │       ├── login.component.ts
│   │   │       ├── register.component.ts
│   │   │       └── auth.routes.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   └── pipes/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/
│   ├── styles.css
│   └── main.ts
├── public/
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Key Concepts (Angular 18+)

| Concept | Description |
|---------|-------------|
| **Standalone Components** | No NgModules needed, `standalone: true` |
| **Signals** | Fine-grained reactivity with `signal()`, `computed()`, `effect()` |
| **Control Flow** | Built-in `@if`, `@for`, `@switch` (no directives) |
| **Deferred Loading** | `@defer` for lazy loading components |
| **inject()** | Function-based DI instead of constructor |

---

## Modern Component Pattern

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="animate-pulse">Loading...</div>
    } @else {
      @for (user of users(); track user.id) {
        <div class="p-4 border rounded">
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
      } @empty {
        <p>No users found</p>
      }
    }
  `
})
export class UserListComponent {
  private api = inject(ApiService);

  users = signal<User[]>([]);
  loading = signal(true);

  userCount = computed(() => this.users().length);

  async ngOnInit() {
    this.users.set(await this.api.getUsers());
    this.loading.set(false);
  }
}
```

---

## Setup Steps

1. Create project:
   ```bash
   npx @angular/cli@latest new my-app --standalone --style=css --routing
   ```

2. Add Tailwind CSS:
   ```bash
   npm install tailwindcss @tailwindcss/postcss
   ```

3. Configure Tailwind in `styles.css`:
   ```css
   @import "tailwindcss";
   ```

4. Run dev server:
   ```bash
   ng serve
   ```

---

## Best Practices (2026)

- **Standalone by default**: Skip NgModules for new code
- **Signals for state**: Use `signal()` over `@Input()` when possible
- **Control flow**: Use `@if`/`@for` over `*ngIf`/`*ngFor`
- **inject()**: Use function-based DI
- **Lazy routes**: Use `loadComponent` for route-based code splitting
- **Signals + RxJS**: Use `toSignal()` to bridge Observable → Signal

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NG_APP_API_URL` | Backend API URL |
| `NG_APP_ENV` | Environment (dev/staging/prod) |