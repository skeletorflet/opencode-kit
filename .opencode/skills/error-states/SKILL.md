---
name: error-states
description: Error states, empty states, and loading states design patterns. UX for failure and absence of data.
---

# Error States & Empty States

> Empty screens and error screens are features, not edge cases.

---

## 1. State Types

| State | When | Key Action |
|-------|------|-----------|
| **Empty (first-time)** | No data ever created | Onboard user |
| **Empty (filtered)** | Search/filter returns nothing | Clear filter |
| **Loading** | Data being fetched | Show skeleton |
| **Error (network)** | Failed to load | Retry |
| **Error (not found)** | 404 | Go home / search |
| **Error (permission)** | 403 | Request access or explain |
| **Error (server)** | 500 | Retry + contact support |
| **Offline** | No network | Wait / offline mode |

---

## 2. Empty State Anatomy

```
┌─────────────────────────────────────┐
│                                     │
│         [Illustration]              │
│                                     │
│       No projects yet               │ ← Clear headline
│                                     │
│  Create your first project to       │ ← What they\'re missing
│  start tracking your work.          │
│                                     │
│       [Create project]              │ ← Clear CTA
│                                     │
│  Or import from GitHub →            │ ← Secondary action
└─────────────────────────────────────┘
```

---

## 3. First-Time Empty State

```tsx
function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ProjectsIllustration className="w-40 h-40 mb-6 text-gray-300" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No projects yet
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm">
        Create your first project to start organizing tasks and tracking progress.
      </p>
      <Button onClick={() => openNewProjectModal()}>
        Create project
      </Button>
      <Link href="/import" className="mt-3 text-sm text-blue-600">
        Import from GitHub →
      </Link>
    </div>
  );
}
```

---

## 4. Search Empty State

```tsx
function EmptySearch({ query }: { query: string }) {
  return (
    <div className="text-center py-12">
      <SearchIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
      <h3 className="font-medium text-gray-900 mb-1">
        No results for "{query}"
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Try different keywords or check the spelling.
      </p>
      <button onClick={clearSearch} className="text-blue-600 text-sm">
        Clear search
      </button>
    </div>
  );
}
```

---

## 5. Error State

```tsx
function ErrorState({
  title = "Something went wrong",
  message = "We couldn\'t load this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

// Error boundary
class ErrorBoundary extends React.Component<Props, { hasError: boolean; error?: Error }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error({ error, info }, "React error boundary caught error");
  }

  render() {
    if (this.state.hasError) {
      return <ErrorState onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

---

## 6. Loading Skeleton

```tsx
function UserCardSkeleton() {
  return (
    <div className="animate-pulse p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// Usage with TanStack Query
function UserList() {
  const { data, isLoading, isError, refetch } = useUsers();

  if (isLoading) return <>{Array.from({ length: 5 }).map((_, i) => <UserCardSkeleton key={i} />)}</>;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (!data?.length) return <EmptyProjects />;

  return data.map(user => <UserCard key={user.id} user={user} />);
}
```

---

## 7. 404 / 500 Pages

```tsx
// 404: helpful, not apologetic
// - Acknowledge the problem
// - Provide navigation options
// - Maybe a search box
// - Suggest popular pages

// 500: honest, with next steps
// - "We\'re working on it" (if true)
// - Status page link
// - Contact support link
// - Retry option
```

---

## 8. Illustration Guidelines

| Situation | Illustration Tone |
|-----------|------------------|
| First-time empty | Welcoming, optimistic |
| Search empty | Neutral, helpful |
| Error | Empathetic, not scary |
| Permission denied | Calm, informative |
| 404 | Playful or simple |
| 500 | Apologetic but helpful |
