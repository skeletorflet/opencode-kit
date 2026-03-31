---
name: react-best-practices
description: React 18+ and Next.js performance optimization from Vercel Engineering. Use when building React components, optimizing performance, eliminating waterfalls, reducing bundle size, reviewing code for performance issues, or implementing server/client-side optimizations.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: frontend
---

# React Best Practices

## What I Do

- Optimize React component rendering and re-renders
- Implement Server Components vs Client Components correctly
- Eliminate render waterfalls and parallelize data fetching
- Reduce bundle size with code splitting and tree shaking
- Apply React 18 features (Suspense, Transitions, useOptimistic)

## When to Use Me

- Building React or Next.js components
- Optimizing rendering performance
- Implementing Server Components
- Reducing bundle size
- Fixing re-render issues

## Key Principles

1. **Server Components by Default**: Use RSC for data fetching and static content
2. **Colocation**: Keep related code together, don't over-abstract
3. **Composition Over Inheritance**: Use children prop and composition
4. **Memo Selectively**: Only memoize when profiling shows benefit
5. **Error Boundaries**: Wrap unstable components with error boundaries

## Common Patterns

### Server/Client Component Split
```tsx
// Page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData(); // Direct async/await in RSC
  return <ClientComponent initialData={data} />;
}

// ClientComponent.tsx (Client Component)
'use client';
export function ClientComponent({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  // Interactive logic here
}
```

### Eliminating Waterfalls
```tsx
// BAD: Sequential fetching
const user = await getUser(id);
const posts = await getPosts(user.id);

// GOOD: Parallel fetching
const [user, posts] = await Promise.all([
  getUser(id),
  getPosts(id),
]);
```

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build  # Check bundle size
```
