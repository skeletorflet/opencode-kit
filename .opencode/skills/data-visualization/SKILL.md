---
name: data-visualization
description: Data visualization principles. Chart selection, D3, Recharts, Chart.js, accessibility, performance.
---

# Data Visualization

> Visualizations should reduce cognitive load, not add it.

---

## 1. Chart Selection Matrix

| Question | Chart Type |
|----------|-----------|
| How does X change over time? | Line, Area |
| How do categories compare? | Bar, Column |
| What\'s the distribution? | Histogram, Box plot |
| What\'s the relationship? | Scatter, Bubble |
| What\'s the composition? | Stacked Bar, Donut |
| Where is it? | Map, Choropleth |
| How far from goal? | Gauge, Bullet chart |
| What\'s the flow? | Sankey, Funnel |
| What\'s the hierarchy? | Treemap, Sunburst |

---

## 2. Library Selection

| Library | Best For | Bundle Size |
|---------|----------|------------|
| **Recharts** | React, declarative | ~300kb |
| **Chart.js** | Quick setup, canvas | ~200kb |
| **D3.js** | Custom, complex | ~80kb (modular) |
| **Plotly.js** | Scientific, 3D | ~3MB |
| **Vega-Lite** | Grammar of graphics | ~800kb |
| **Observable Plot** | Exploratory, modern | ~100kb |

---

## 3. Color Principles

### Sequential (single metric intensity)
```
Light → Dark of one hue
#EFF6FF → #1D4ED8  (blue scale)
```

### Diverging (pos/neg from center)
```
Red ← 0 → Blue
Use for: profit/loss, temperature, sentiment
```

### Categorical (distinct groups)
```
Use max 8 colors
Tableau 10 / ColorBrewer are proven palettes
Always test for color blindness (deuteranopia most common)
```

---

## 4. Axes & Labels

```
Axes rules:
├── Always label axes with units
├── Start y-axis at 0 for bar charts
├── Truncated y-axis OK for line charts (show context)
├── Use consistent tick intervals
└── Rotate labels only as last resort

Number formatting:
├── 1,234,567  → 1.2M
├── 0.1234     → 12.3%
├── $1,000,000 → $1M
└── Tooltip shows full precision
```

---

## 5. Interaction Patterns

| Interaction | Implementation |
|-------------|---------------|
| **Hover tooltip** | Show exact values, context |
| **Click to filter** | Highlight selected, gray others |
| **Zoom/pan** | For time series with large ranges |
| **Legend toggle** | Click to show/hide series |
| **Drill-down** | Click segment to see breakdown |
| **Brush select** | Drag to select date range |

---

## 6. Recharts Quick Patterns

```jsx
// Responsive container (always wrap)
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
    <XAxis dataKey="date" tickFormatter={formatDate} />
    <YAxis tickFormatter={v => `$${v/1000}k`} />
    <Tooltip content={<CustomTooltip />} />
    <Legend />
    <Line type="monotone" dataKey="revenue"
      stroke="#3B82F6" strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

---

## 7. Performance

```
Optimization strategies:
├── Canvas over SVG for > 1000 data points
├── Aggregate/bin data server-side
├── Virtualize large datasets
├── Debounce resize handlers
├── Use useMemo for data transformations
└── WebWorkers for heavy computations

Thresholds:
├── SVG: < 500 elements
├── Canvas (Chart.js): < 10,000 points
├── WebGL (Deck.gl): millions of points
```

---

## 8. Accessibility

- Always provide data table alternative
- Use `aria-label` on chart containers
- Don\'t rely on color alone (add patterns/shapes)
- Keyboard-navigable tooltips
- Test with screen readers (NVDA, VoiceOver)

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| 3D charts | Flat 2D |
| Pie with > 5 slices | Bar chart |
| Dual y-axis | Two separate charts |
| Animation on every render | Animate only on data change |
| Unlabeled axes | Always label + units |
| Truncated bar chart y-axis | Start at 0 |
"""