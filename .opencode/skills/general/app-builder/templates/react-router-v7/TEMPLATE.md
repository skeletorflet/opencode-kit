---
name: react-router-v7
description: React Router v7 template with file-based routing, server rendering, and type-safe loaders.
---

# React Router v7 Template (Remix v2)

## Tech Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | React Router v7 | Successor to Remix |
| UI | React 19 | Server components |
| Routing | File-based | Convention over config |
| Styling | Tailwind CSS v4 | CSS-first |
| Database | Prisma | ORM |
| Auth | Remix Auth | Session-based |
| Build | Vite | Fast HMR |

---

## Directory Structure

```
project-name/
├── app/
│   ├── routes/
│   │   ├── _index.tsx          # Home page
│   │   ├── _auth.login.tsx     # Auth layout + login
│   │   ├── _auth.register.tsx  # Register page
│   │   ├── dashboard._index.tsx # Dashboard
│   │   ├── users._index.tsx    # Users list
│   │   ├── users.$id.tsx       # User detail
│   │   └── api.users.ts        # API route
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   ├── lib/
│   │   ├── db.ts
│   │   └── auth.ts
│   ├── root.tsx
│   ├── routes.ts               # Route config
│   └── app.css
├── prisma/
├── public/
├── package.json
└── tsconfig.json
```

---

## Route Configuration (v7)

```typescript
// app/routes.ts
import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),

  layout("routes/_auth.tsx", [
    route("login", "routes/_auth.login.tsx"),
    route("register", "routes/_auth.register.tsx"),
  ]),

  layout("routes/dashboard.tsx", [
    route("dashboard", "routes/dashboard._index.tsx"),
    route("users", "routes/users._index.tsx"),
    route("users/:id", "routes/users.$id.tsx"),
  ]),

  route("api/users", "routes/api.users.ts"),
] satisfies RouteConfig;
```

---

## Loader + Action Pattern

```tsx
// app/routes/users._index.tsx
import { useLoaderData, Form } from "react-router";
import { prisma } from "~/lib/db";

export async function loader() {
  const users = await prisma.user.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
  });
  return { users };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  await prisma.user.create({ data: { name, email } });
  return { success: true };
}

export default function Users() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Users</h1>
      <Form method="post">
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <button type="submit">Add User</button>
      </Form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Setup Steps

1. Create project:
   ```bash
   npx create-react-router@latest my-app
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install prisma @prisma/client
   ```

3. Run dev server:
   ```bash
   npm run dev
   ```

4. Build:
   ```bash
   npm run build
   npm run start
   ```

---

## Best Practices

- **File conventions**: Follow v7 naming (`.tsx`, `_layout`, `$param`)
- **Type safety**: Use `typeof loader` for type-safe data
- **Progressive enhancement**: Forms work without JS
- **Streaming**: Use defer() for slow data
- **Error boundaries**: Every route has error handling

---

## Key Differences from v6

| Feature | v6 | v7 |
|---------|----|----|
| **Routing** | `<Routes>` JSX | File-based routes.ts |
| **Config** | Nested objects | Convention-based |
| **Type safety** | Manual | Automatic |
| **Data** | useLoaderData | useLoaderData + types |
| **SSR** | Separate config | Built-in |