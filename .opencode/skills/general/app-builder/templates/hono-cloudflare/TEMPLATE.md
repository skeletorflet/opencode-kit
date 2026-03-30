---
name: hono-cloudflare
description: Hono + Cloudflare Workers template for ultra-fast edge APIs and full-stack apps.
---

# Hono + Cloudflare Workers Template

## Tech Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | Hono v4+ | Ultra-fast web framework |
| Runtime | Cloudflare Workers | Edge computing |
| Database | Cloudflare D1 | SQLite at edge |
| Storage | Cloudflare R2 | S3-compatible object storage |
| Cache | Cloudflare KV | Key-value at edge |
| Queue | Cloudflare Queues | Async processing |
| Styling | Tailwind CSS v4 | CSS-first |
| Build | Vite | Fast builds |

---

## Directory Structure

```
project-name/
├── src/
│   ├── index.ts           # Main Hono app
│   ├── routes/
│   │   ├── api.ts         # API routes
│   │   └── pages.ts       # SSR pages
│   ├── middleware/
│   │   └── auth.ts        # Auth middleware
│   ├── lib/
│   │   └── db.ts          # D1 database helpers
│   └── types/
│       └── bindings.ts    # Cloudflare bindings types
├── public/
│   └── assets/
├── wrangler.toml          # Cloudflare config
├── drizzle.config.ts      # ORM config
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

## Hono App Setup

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

// API routes
app.get('/api/users', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM users LIMIT 10'
  ).all();
  return c.json(results);
});

app.post('/api/users', async (c) => {
  const body = await c.req.json();
  const { success } = await c.env.DB.prepare(
    'INSERT INTO users (name, email) VALUES (?, ?)'
  ).bind(body.name, body.email).run();

  if (!success) return c.json({ error: 'Failed to create user' }, 500);
  return c.json({ message: 'User created' }, 201);
});

export default app;
```

---

## Setup Steps

1. Create project:
   ```bash
   npm create hono@latest my-app -- --template cloudflare-workers
   cd my-app
   ```

2. Create D1 database:
   ```bash
   wrangler d1 create my-database
   ```

3. Configure wrangler.toml:
   ```toml
   name = "my-app"
   main = "src/index.ts"
   compatibility_date = "2024-12-01"

   [[d1_databases]]
   binding = "DB"
   database_name = "my-database"
   database_id = "your-database-id"

   [[kv_namespaces]]
   binding = "KV"
   id = "your-kv-id"
   ```

4. Run locally:
   ```bash
   npm run dev
   ```

5. Deploy:
   ```bash
   wrangler deploy
   ```

---

## Best Practices

- **Edge-first**: Design for global distribution
- **Cold start**: Keep bundle size minimal
- **D1**: Use prepared statements for performance
- **KV**: Use for caching, not primary data
- **R2**: Use for files, not small data
- **Queues**: Use for async processing
- **Durables**: Use for real-time/WebSocket

---

## Why Hono + Cloudflare?

| Benefit | Description |
|---------|-------------|
| **Speed** | Sub-10ms cold starts |
| **Global** | Runs in 300+ edge locations |
| **Cost** | Free tier generous |
| **DX** | TypeScript-first, familiar Express-like API |
| **Scale** | Auto-scaling, no servers |