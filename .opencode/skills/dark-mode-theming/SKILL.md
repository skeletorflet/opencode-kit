---
name: dark-mode-theming
description: Dark mode and theming patterns. CSS variables, Tailwind dark mode, system preference, user toggle, Next.js themes.
---

# Dark Mode & Theming

> Dark mode done right: not just inverting colors.

---

## 1. CSS Variables (Foundation)

```css
/* Light theme (default) */
:root {
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-danger: #ef4444;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
}

/* Dark theme */
[data-theme="dark"],
.dark {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-border: #334155;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-primary: #60a5fa;
  --color-primary-hover: #93c5fd;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
}

/* System preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* same as [data-theme="dark"] */
  }
}
```

---

## 2. Tailwind Dark Mode

```ts
// tailwind.config.ts
export default {
  darkMode: "class", // or "media" for system-only
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
      },
    },
  },
};
```

```tsx
// Component using dark mode classes
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      text-gray-900 dark:text-gray-100
      rounded-xl p-6 shadow-sm dark:shadow-gray-900
    ">
      {children}
    </div>
  );
}
```

---

## 3. Theme Toggle (next-themes)

```tsx
// _app.tsx or layout.tsx
import { ThemeProvider } from "next-themes";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"   // Sets class="dark" on <html>
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

// Toggle component
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />; // Prevent hydration mismatch

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
```

---

## 4. Dark Mode Color Guidelines

```
Don\'t just invert:
├── Dark backgrounds: #0f172a, #1e293b (not pure #000000)
├── Text on dark: #f1f5f9 (not pure #ffffff - too harsh)
├── Reduce saturation of colors in dark mode
├── Increase shadows (they disappear on dark bg)
└── Borders need more contrast (not less)

Elevation in dark mode:
├── Light: shadows create elevation
├── Dark: lighter backgrounds create elevation
├── Level 0: #0f172a
├── Level 1: #1e293b (cards)
├── Level 2: #293548 (modals)
└── Level 3: #334155 (tooltips)
```

---

## 5. Images in Dark Mode

```css
/* Invert logos/icons designed for light backgrounds */
.logo-light-mode {
  display: block;
}
.logo-dark-mode {
  display: none;
}

.dark .logo-light-mode {
  display: none;
}
.dark .logo-dark-mode {
  display: block;
}

/* Or use CSS filter for simple cases */
.dark img.invert-on-dark {
  filter: invert(1) hue-rotate(180deg);
}
```

---

## 6. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Pure #000000 background | Dark navy/slate (#0f172a) |
| Pure #ffffff text on dark | Slightly dimmed white (#f1f5f9) |
| Flash of wrong theme on load | Use next-themes with suppressHydrationWarning |
| Same shadows as light mode | Adjust shadow opacity for dark |
| Ignore images/icons | Provide dark variants |
| No system preference support | Default to `prefers-color-scheme` |
