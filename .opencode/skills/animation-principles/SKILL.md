---
name: animation-principles
description: UI animation patterns. CSS transitions, Framer Motion, GSAP, performance, accessibility.
---

# Animation Principles

> Animation communicates state and guides attention. Use purposefully.

---

## 1. The 12 Principles (UI Subset)

| Principle | UI Application |
|-----------|---------------|
| **Timing** | Duration matches complexity (50–500ms) |
| **Easing** | ease-out for enter, ease-in for exit |
| **Squash & stretch** | Scale feedback on press |
| **Anticipation** | Brief pull-back before launch |
| **Follow-through** | Overshoot + settle (spring) |
| **Staging** | One focus at a time |
| **Secondary action** | Supporting motion reinforces primary |

---

## 2. Duration Guidelines

| Type | Duration | Easing |
|------|---------|--------|
| Micro (icon, toggle) | 50–150ms | ease-out |
| Transition (panel, modal) | 200–350ms | ease-out / spring |
| Page transition | 300–500ms | ease-in-out |
| Loading / skeleton | 1000–2000ms | linear infinite |
| Hero entrance | 400–800ms | ease-out |

**Rule:** Faster is almost always better. If in doubt, cut duration by 30%.

---

## 3. Easing Reference

```css
/* Entrances */
ease-out: cubic-bezier(0, 0, 0.2, 1)

/* Exits */
ease-in: cubic-bezier(0.4, 0, 1, 1)

/* Transitions between states */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)

/* Spring (natural feel) */
spring: use Framer Motion spring config
  { type: "spring", stiffness: 300, damping: 30 }

/* Bounce */
cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## 4. CSS Animations

```css
/* GPU-accelerated properties ONLY */
transform: translateX() translateY() scale() rotate();
opacity: 0 → 1;

/* AVOID animating (causes layout/paint) */
width, height, top, left, margin, padding

/* Entrance utility */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fade-up {
  animation: fadeUp 0.4s ease-out forwards;
}
```

---

## 5. Framer Motion Patterns

```jsx
// Entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
/>

// Stagger children
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 }
}

// Layout animation (automatic)
<motion.div layout /> // animates size/position changes

// Shared layout (page transitions)
<AnimatePresence mode="wait">
  <motion.div key={route} ... />
</AnimatePresence>
```

---

## 6. GSAP Patterns

```js
// Timeline
const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
tl.from(".hero-title", { y: 40, opacity: 0, duration: 0.6 })
  .from(".hero-sub",   { y: 20, opacity: 0, duration: 0.4 }, "-=0.3")
  .from(".hero-cta",   { y: 20, opacity: 0, duration: 0.3 }, "-=0.2");

// ScrollTrigger
gsap.from(".card", {
  scrollTrigger: { trigger: ".card", start: "top 80%" },
  y: 60, opacity: 0, stagger: 0.15
});
```

---

## 7. Accessibility

```css
/* ALWAYS respect this */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

```jsx
// Framer Motion
const prefersReducedMotion = useReducedMotion();
const variants = prefersReducedMotion
  ? { hidden: {}, show: {} }
  : { hidden: { opacity: 0 }, show: { opacity: 1 } };
```

---

## 8. Loading States

| Pattern | When |
|---------|------|
| **Skeleton** | Content replacement (cards, text) |
| **Spinner** | Short wait (< 3s), unknown duration |
| **Progress bar** | Known steps or file upload |
| **Pulse animation** | Background process |

```css
/* Skeleton shimmer */
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Animate everything | Animate meaningfully |
| Long durations (> 500ms) | Keep it snappy |
| Bouncy on serious UI | Match tone to product |
| Animate on every keystroke | Debounce input animations |
| Forget reduced-motion | Always add the media query |
"""