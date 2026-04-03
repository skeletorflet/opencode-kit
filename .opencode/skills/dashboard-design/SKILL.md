---
name: dashboard-design
description: Dashboard UI patterns. Layout, widgets, KPIs, data density, navigation for admin panels and analytics.
---

# Dashboard Design

> Dashboards communicate the state of a system at a glance.

---

## 1. Dashboard Types

| Type | Purpose | Examples |
|------|---------|---------|
| **Operational** | Monitor real-time metrics | DevOps, support queues |
| **Analytical** | Explore historical data | Business intelligence |
| **Strategic** | High-level KPIs for decisions | Executive dashboards |
| **Tactical** | Day-to-day task management | Project trackers |

---

## 2. Layout Grid

```
┌──────────────────────────────────────────────┐
│ Sidebar │  Top bar (breadcrumb + actions)     │
│         ├──────┬──────┬──────┬───────────────┤
│  Nav    │ KPI  │ KPI  │ KPI  │  KPI          │
│         ├──────┴──────┴──────┴───────────────┤
│         │  Chart (large)    │  Secondary     │
│         │                   │  widget        │
│         ├───────────────────┴────────────────┤
│         │  Data Table                        │
└─────────┴────────────────────────────────────┘
```

### Grid Rules
- Use 12-column grid
- KPI cards: 3 or 4 per row
- Primary chart: 8 cols; secondary: 4 cols
- Tables: full width

---

## 3. KPI Card Anatomy

```
┌─────────────────────────┐
│ Label          [icon]   │
│ $124,500                │
│ ↑ 12.4% vs last month   │
└─────────────────────────┘
```

| Element | Purpose |
|---------|---------|
| **Label** | Metric name (short) |
| **Value** | Current number (large, prominent) |
| **Delta** | Change vs period (color-coded) |
| **Icon** | Visual cue for quick scanning |
| **Sparkline** | Mini trend (optional) |

---

## 4. Chart Selection

| Data Type | Best Chart |
|-----------|-----------|
| Trend over time | Line chart |
| Category comparison | Bar chart |
| Part of whole (< 5 items) | Donut chart |
| Distribution | Histogram |
| Correlation | Scatter plot |
| Geographical | Choropleth map |
| Funnel / conversion | Funnel chart |
| Single metric progress | Gauge / progress bar |

---

## 5. Data Table Patterns

| Feature | Implementation |
|---------|---------------|
| **Sorting** | Clickable column headers with indicator |
| **Filtering** | Inline filter row or filter panel |
| **Pagination** | Show page X of Y, rows per page |
| **Row actions** | Hover-reveal or always-visible icons |
| **Bulk actions** | Checkbox column + action bar |
| **Empty state** | Illustration + CTA, not blank |
| **Loading** | Skeleton rows, not spinner |

---

## 6. Navigation Patterns

| Pattern | Use When |
|---------|---------|
| **Left sidebar** | 5-15 nav items, complex app |
| **Top nav** | 3-7 items, content-first |
| **Collapsible sidebar** | Dense data, need max width |
| **Tabs** | Same-level sections within a page |
| **Breadcrumbs** | Deep hierarchy navigation |

---

## 7. Color Usage

```
Status colors (use consistently):
├── Green   → Success, positive trend, active
├── Red     → Error, negative trend, critical
├── Yellow  → Warning, pending, at risk
├── Blue    → Info, neutral, primary actions
└── Gray    → Disabled, empty, secondary

Chart palette:
├── Use 4-6 colors max
├── Colorblind-safe: avoid red+green alone
└── Ensure 3:1 contrast ratio on backgrounds
```

---

## 8. Density Modes

| Mode | Row Height | Font Size | Padding |
|------|-----------|-----------|---------|
| **Compact** | 32px | 12px | 4px |
| **Default** | 44px | 14px | 8px |
| **Comfortable** | 56px | 16px | 16px |

Let users choose or auto-detect based on device.

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| 3D pie charts | Flat bar charts |
| Too many KPIs on one screen | Max 6 KPIs above fold |
| No loading states | Skeleton placeholders |
| Truncated numbers (1.2M no context) | Tooltips with full value |
| Auto-refresh without warning | Indicate live refresh rate |
| Mixed date formats | Consistent ISO or locale |
"""