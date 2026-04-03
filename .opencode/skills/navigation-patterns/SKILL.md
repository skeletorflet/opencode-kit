---
name: navigation-patterns
description: Navigation design patterns. Sidebars, top navs, tabs, breadcrumbs, mobile navigation, routing.
---

# Navigation Patterns

> Good navigation is invisible. Bad navigation is all users talk about.

---

## 1. Navigation Types

| Pattern | Items | Use When |
|---------|-------|---------|
| **Top nav** | 3–7 | Marketing sites, simple apps |
| **Left sidebar** | 5–20 | Complex apps, dashboards |
| **Bottom tab bar** | 3–5 | Mobile apps |
| **Tabs** | 2–7 | Section switching, same context |
| **Breadcrumbs** | Dynamic | Deep hierarchy, content sites |
| **Hamburger menu** | Any | Mobile, collapsed nav |
| **Mega menu** | Many | E-commerce, large sites |

---

## 2. Sidebar Navigation

```tsx
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Projects",
    icon: FolderIcon,
    children: [
      { name: "Active", href: "/projects/active" },
      { name: "Archived", href: "/projects/archived" },
    ],
  },
  { name: "Settings", href: "/settings", icon: CogIcon },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-gray-900 min-h-screen p-4">
      {navigation.map(item => (
        item.children ? (
          <CollapsibleNavItem key={item.name} item={item} currentPath={pathname} />
        ) : (
          <NavLink
            key={item.name}
            href={item.href}
            active={pathname.startsWith(item.href)}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        )
      ))}
    </nav>
  );
}
```

---

## 3. Active State Patterns

```tsx
// Active link with exact/prefix matching
function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
```

---

## 4. Breadcrumbs

```tsx
function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-gray-500">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3 h-3" />}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-gray-900">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Auto-generate from pathname
function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, i) => ({
    label: capitalize(segment.replace(/-/g, " ")),
    href: i < segments.length - 1 ? "/" + segments.slice(0, i + 1).join("/") : undefined,
  }));
}
```

---

## 5. Mobile Bottom Tab Bar

```tsx
const tabs = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Search", href: "/search", icon: SearchIcon },
  { name: "Notifications", href: "/notifications", icon: BellIcon, badge: 3 },
  { name: "Profile", href: "/profile", icon: UserIcon },
];

function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t safe-area-bottom">
      <div className="flex">
        {tabs.map(tab => (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "flex-1 flex flex-col items-center py-2 gap-1",
              pathname === tab.href ? "text-blue-600" : "text-gray-500"
            )}
          >
            <div className="relative">
              <tab.icon className="w-6 h-6" />
              {tab.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-xs">{tab.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

---

## 6. Responsive Navigation

```tsx
// Desktop: sidebar | Mobile: hamburger + drawer
function AppNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64">
        <Sidebar />
      </aside>

      {/* Mobile trigger */}
      <button
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
```

---

## 7. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| No active state | Clearly mark current page |
| Hamburger menu on desktop | Visible nav on desktop |
| Deep nesting (4+ levels) | Flatten or redesign IA |
| No keyboard navigation | Tab + Enter + Escape support |
| Missing aria-current | Accessibility attribute on active |
| Nested navigation in navigation | One primary nav |
