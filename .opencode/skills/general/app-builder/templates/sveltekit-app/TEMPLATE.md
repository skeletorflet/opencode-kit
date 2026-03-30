---
name: sveltekit-app
description: SvelteKit template with TypeScript, TailwindCSS, Prisma.
---

# SvelteKit Application Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | SvelteKit 2.0 |
| Language | TypeScript |
| UI | TailwindCSS + svelte-headlessui |
| State | Svelte stores |
| Database | Prisma + PostgreSQL |
| Auth | Auth.js (NextAuth) |
| Forms | Superforms |
| Deploy | Vercel/Netlify adapter |

---

## Directory Structure

```
project-name/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Input.svelte
│   │   │   │   └── Modal.svelte
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.svelte
│   │   │   │   └── Footer.svelte
│   │   │   └── shared/
│   │   ├── server/
│   │   │   ├── prisma.ts
│   │   │   └── auth.ts
│   │   ├── stores/
│   │   │   ├── user.ts
│   │   │   └── cart.ts
│   │   └── utils/
│   │       ├── api.ts
│   │       └── validation.ts
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +layout.server.ts
│   │   ├── +page.svelte
│   │   ├── +page.server.ts
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── api/
│   │   │   └── v1/
│   │   └── (app)/
│   │       ├── dashboard/
│   │       └── profile/
│   ├── app.html
│   ├── app.d.ts
│   ├── hooks.server.ts
│   └── hooks.client.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── static/
├── tests/
├── .env.example
├── svelte.config.js
├── tailwind.config.js
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

## Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## Auth Configuration

```typescript
// src/lib/server/auth.ts
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import Google from "@auth/sveltekit/providers/google"
import Credentials from "@auth/sveltekit/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "$lib/server/prisma"
import bcrypt from "bcrypt"

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }),
    Google({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !bcrypt.compare(credentials.password, user.password)) return null
        return user
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role
      return session
    }
  }
})
```

---

## Form Actions

```typescript
// src/routes/posts/create/+page.server.ts
import { fail, redirect } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1)
})

export const actions = {
  default: async ({ request, locals }) => {
    const session = await locals.auth()
    if (!session?.user) return fail(401, { message: 'Unauthorized' })

    const formData = await request.formData()
    const title = formData.get('title')
    const content = formData.get('content')

    const result = createPostSchema.safeParse({ title, content })
    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors })
    }

    await prisma.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        authorId: session.user.id
      }
    })

    throw redirect(303, '/posts')
  }
}
```

---

## Loading Data

```typescript
// src/routes/posts/+page.server.ts
import { prisma } from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals }) => {
  const session = await locals.auth()
  
  const page = Number(url.searchParams.get('page')) || 1
  const limit = 10
  
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit
  })

  const total = await prisma.post.count({ where: { published: true } })

  return {
    posts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  }
}
```

---

## Docker Compose

```yaml
services:
  app:
    build: .
    ports:
      - "5173:5173"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
      - AUTH_SECRET=your-secret-here
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Best Practices

- Use Zod for validation
- Use server-side load functions
- Use form actions for mutations
- Use stores for client state
- Use svelte-headlessui for accessible components
- Use optimistic UI updates
- Implement proper error handling
- Use environment variables for secrets