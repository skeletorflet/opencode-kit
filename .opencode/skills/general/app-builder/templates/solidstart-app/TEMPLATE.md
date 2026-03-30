---
name: solidstart-app
description: SolidStart template with SolidJS signals, fine-grained reactivity, and full-stack capabilities.
---

# SolidStart Application Template

## Tech Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | SolidStart | SolidJS meta-framework |
| UI Library | SolidJS | Fine-grained reactivity |
| Styling | Tailwind CSS v4 | CSS-first config |
| Database | Prisma | ORM |
| Auth | Lucia Auth | Session-based auth |
| Build | Vinxi | Vite-based |

---

## Directory Structure

```
project-name/
├── src/
│   ├── routes/
│   │   ├── index.tsx         # Home page
│   │   ├── api/
│   │   │   └── users.ts      # API route
│   │   └── users/
│   │       └── [id].tsx      # Dynamic route
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── db.ts             # Prisma client
│   │   └── auth.ts           # Auth helpers
│   ├── app.css               # Global styles
│   └── app.tsx               # Root layout
├── prisma/
│   └── schema.prisma
├── public/
├── app.config.ts
├── package.json
└── tsconfig.json
```

---

## Key Concepts

### SolidJS Signals (Core Reactivity)
```tsx
import { createSignal, createEffect, Show, For } from 'solid-js';

export default function Counter() {
  const [count, setCount] = createSignal(0);
  const [users, setUsers] = createSignal<User[]>([]);

  // Effect runs when count changes
  createEffect(() => {
    console.log('Count is:', count());
  });

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count()}
      </button>

      {/* Conditional rendering */}
      <Show when={users().length > 0} fallback={<p>Loading...</p}>
        <ul>
          {/* List rendering */}
          <For each={users()}>
            {(user) => <li>{user.name}</li>}
          </For>
        </ul>
      </Show>
    </div>
  );
}
```

### Server Functions
```tsx
import { createServerAction$ } from 'solid-start/server';

export default function CreateUser() {
  const [, { Form }] = createServerAction$(async (formData: FormData) => {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    await prisma.user.create({ data: { name, email } });
    return redirect('/users');
  });

  return (
    <Form>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit">Create User</button>
    </Form>
  );
}
```

---

## Setup Steps

1. Create project:
   ```bash
   npm init solid@latest my-app
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

3. Run dev server:
   ```bash
   npm run dev
   ```

4. Build:
   ```bash
   npm run build
   ```

---

## Best Practices

- **Signals everywhere**: Use `createSignal()` for state
- **No virtual DOM diffing**: Fine-grained updates
- **Server functions**: Use `createServerAction$` for mutations
- **Streaming**: SolidStart supports streaming SSR
- **No re-renders**: Components run once, signals update DOM directly

---

## Why SolidJS?

| Benefit | React/Svelte | SolidJS |
|---------|-------------|---------|
| **Re-rendering** | Component re-renders | Fine-grained DOM updates |
| **Performance** | Virtual DOM diffing | Direct DOM manipulation |
| **Bundle** | ~40KB (React) | ~7KB (Solid) |
| **Learning** | JSX familiar | JSX + signals |