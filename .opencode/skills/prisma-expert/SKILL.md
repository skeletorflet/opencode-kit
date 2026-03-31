---
name: prisma-expert
description: Prisma ORM expert for schema design, migrations, relations, and query optimization. Use for database schema work, Prisma Client queries, and migration management.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: database
---

# Prisma Expert

## What I Do

- Design Prisma schemas with proper relations and types
- Manage migrations safely (create, apply, rollback)
- Optimize queries with includes, selects, and raw SQL
- Handle complex relation patterns (many-to-many, self-referential)
- Configure database connections for different environments

## When to Use Me

- Creating or modifying Prisma schema files
- Writing complex Prisma Client queries
- Troubleshooting migration issues
- Optimizing database query performance
- Setting up database seeding

## Key Principles

1. **Schema First**: Define types and relations before writing queries
2. **Include vs Select**: Use `select` for performance, `include` for convenience
3. **Migration Safety**: Always review generated SQL before applying
4. **Connection Pooling**: Use PgBouncer or Prisma Accelerate for serverless

## Common Patterns

### Many-to-Many Relations
```prisma
model Post {
  id         Int              @id @default(autoincrement())
  categories CategoryOnPost[]
}

model Category {
  id    Int              @id @default(autoincrement())
  posts CategoryOnPost[]
}

model CategoryOnPost {
  post       Post     @relation(fields: [postId], references: [id])
  postId     Int
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId Int
  @@id([postId, categoryId])
}
```

### Query Optimization
```typescript
// Bad: N+1 queries
const posts = await prisma.post.findMany()
for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } })
}

// Good: Single query with include
const posts = await prisma.post.findMany({
  include: { author: true, categories: true }
})
```

## Validation

After schema changes, always run:
```bash
npx prisma validate
npx prisma migrate dev --name <description>
npx prisma generate
```
