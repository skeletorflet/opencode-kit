---
name: graphql-expert
description: GraphQL API design. Schema design, resolvers, N+1 problem, subscriptions, federation, Apollo, Pothos.
---

# GraphQL Expert

> GraphQL: ask for exactly what you need, nothing more.

---

## 1. Schema Design Principles

```graphql
# Think in graphs, not resources
# Good: model the domain
type User {
  id: ID!
  name: String!
  email: String!
  posts(first: Int, after: String): PostConnection!
  role: UserRole!
}

# Connections for pagination (Relay spec)
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# Input types for mutations
input CreatePostInput {
  title: String!
  content: String!
  published: Boolean! = false
}
```

---

## 2. Resolver Pattern

```ts
// GraphQL Yoga + Pothos (type-safe schema builder)
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
}>({
  plugins: [PrismaPlugin],
  prisma: { client: db },
});

builder.queryField("user", (t) =>
  t.prismaField({
    type: "User",
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _, { id }, { user }) => {
      if (!user) throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHORIZED" } });
      return db.user.findUniqueOrThrow({ ...query, where: { id } });
    },
  })
);
```

---

## 3. N+1 Problem & DataLoader

```ts
// ❌ N+1: resolves author for each post individually
posts.map(post => db.user.findUnique({ where: { id: post.authorId } }));
// = 1 query for posts + N queries for authors

// ✅ DataLoader: batch + dedupe
import DataLoader from "dataloader";

const userLoader = new DataLoader<string, User>(async (ids) => {
  const users = await db.user.findMany({ where: { id: { in: ids as string[] } } });
  return ids.map(id => users.find(u => u.id === id)!);
});

// In resolver: now batches into single query
const author = await userLoader.load(post.authorId);

// Create per-request (in context)
function createContext() {
  return {
    userLoader: new DataLoader(batchUsers),
    postLoader: new DataLoader(batchPosts),
  };
}
```

---

## 4. Mutations Pattern

```graphql
type Mutation {
  createPost(input: CreatePostInput!): CreatePostPayload!
  updatePost(id: ID!, input: UpdatePostInput!): UpdatePostPayload!
  deletePost(id: ID!): DeletePostPayload!
}

# Always return payload type (not raw object)
# Allows adding fields later without breaking change
type CreatePostPayload {
  post: Post
  errors: [UserError!]!
}

type UserError {
  field: [String!]
  message: String!
}
```

---

## 5. Subscriptions

```ts
// GraphQL Yoga subscription
builder.subscriptionField("messageAdded", (t) =>
  t.field({
    type: "Message",
    args: { channelId: t.arg.id({ required: true }) },
    subscribe: async function* (_, { channelId }) {
      const sub = pubSub.subscribe(`channel:${channelId}`);
      for await (const message of sub) {
        yield message;
      }
    },
    resolve: (message) => message,
  })
);
```

---

## 6. Error Handling

```ts
import { GraphQLError } from "graphql";

// Typed error codes for clients
throw new GraphQLError("Post not found", {
  extensions: {
    code: "NOT_FOUND",
    http: { status: 404 },
  },
});

// Error codes
enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}
```

---

## 7. Security

```ts
// Query depth limit
import depthLimit from "graphql-depth-limit";

const server = createYoga({
  schema,
  validationRules: [depthLimit(10)],
});

// Query complexity
import { createComplexityLimitRule } from "graphql-validation-complexity";
validationRules: [createComplexityLimitRule(1000)]

// Disable introspection in production
introspection: process.env.NODE_ENV === "development"

// Persisted queries (only allow known queries)
// → Major security improvement for production
```

---

## 8. Federation (Apollo)

```graphql
# users-service
type User @key(fields: "id") {
  id: ID!
  name: String!
}

# posts-service extends User type
extend type User @key(fields: "id") {
  id: ID! @external
  posts: [Post!]!
}
```

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| REST-like schema (getUserById) | Graph-centric (user(id:)) |
| Return raw objects from mutations | Return payload types |
| Resolve N+1 without DataLoader | Always use DataLoader |
| Enable introspection in prod | Disable + use persisted queries |
| No depth/complexity limits | Protect against DoS |
