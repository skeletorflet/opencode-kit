---
name: state-management
description: State management patterns. Local state, global state, server state. Zustand, Redux, Jotai, TanStack Query, React Context.
---

# State Management

> Use the right tool for the right type of state.

---

## 1. State Classification

| Type | Description | Tool |
|------|-------------|------|
| **Local UI** | Component-only (open/closed, hover) | useState |
| **Shared UI** | Cross-component, no server | Zustand / Jotai / Context |
| **Server/Async** | Data from API, loading/error states | TanStack Query / SWR |
| **URL** | Navigation state, shareable | URLSearchParams / router |
| **Form** | Input values, validation | React Hook Form |
| **Persistent** | Survives page reload | localStorage + store |

---

## 2. Decision Tree

```
Is it server data?
  └─ YES → TanStack Query / SWR

Is it only used in one component?
  └─ YES → useState / useReducer

Is it form data?
  └─ YES → React Hook Form

Is it global app state (auth, theme, cart)?
  └─ YES → Zustand / Jotai

Does it need time-travel / devtools?
  └─ YES → Redux Toolkit

Is it just prop drilling 2-3 levels?
  └─ Use props, not context
```

---

## 3. TanStack Query (Server State)

```tsx
// Fetch
const { data, isLoading, error } = useQuery({
  queryKey: ["users", filters],
  queryFn: () => fetchUsers(filters),
  staleTime: 5 * 60 * 1000, // 5 min
});

// Mutate
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});

// Optimistic update
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    const prev = queryClient.getQueryData(["todos"]);
    queryClient.setQueryData(["todos"], old =>
      old.map(t => t.id === newTodo.id ? newTodo : t)
    );
    return { prev };
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(["todos"], context.prev);
  },
});
```

---

## 4. Zustand (Global Client State)

```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      clear: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);

// Usage: const { items, addItem } = useCartStore();
// Selector (prevents re-render): const items = useCartStore(s => s.items);
```

---

## 5. Jotai (Atomic State)

```tsx
import { atom, useAtom, useAtomValue } from "jotai";

const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);

// Async atom
const userAtom = atom(async () => {
  const res = await fetch("/api/user");
  return res.json();
});

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const double = useAtomValue(doubleAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count} ({double})</button>;
}
```

---

## 6. Context (Simple Sharing)

```tsx
// Use for: theme, locale, auth user (read-mostly)
// AVOID for: frequently updated state (causes all consumers to re-render)

const ThemeContext = createContext<Theme>("light");

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## 7. URL State

```tsx
// For: search, filters, pagination, tabs
// Survives refresh + shareable

const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get("page") ?? "1");
const query = searchParams.get("q") ?? "";

const updateFilter = (key: string, value: string) => {
  setSearchParams(prev => { prev.set(key, value); return prev; });
};
```

---

## 8. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Put server data in Redux/Zustand | Use TanStack Query |
| Context for high-frequency updates | Zustand / Jotai |
| Global state for component UI | Local useState |
| Props drilling > 3 levels | Composition or store |
| Duplicate server state locally | Single source of truth |
"""