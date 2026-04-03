---
name: hero-page
description: Hero section design and implementation. Above-the-fold UX, CTAs, headlines, visual hierarchy for landing pages.
---

# Hero Page Patterns

> The first screen a user sees. Make it count.

---

## 1. Hero Anatomy

```
┌─────────────────────────────────────────┐
│  Navbar                                 │
├─────────────────────────────────────────┤
│                                         │
│  [Eyebrow label]                        │
│  H1: Main Value Proposition             │
│  Subheadline supporting copy            │
│                                         │
│  [Primary CTA]  [Secondary CTA]         │
│                                         │
│  Social proof (logos / avatars / stars) │
│                                         │
│  Hero visual (image / video / 3D / UI)  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 2. Headline Formulas

| Formula | Example |
|---------|---------|
| **Outcome** | "Ship features 10× faster" |
| **Problem → Solution** | "Stop losing customers. Start retaining them." |
| **Who + What** | "The CRM built for remote sales teams" |
| **Superlative** | "The fastest way to build internal tools" |
| **Question** | "What if your deployment took 30 seconds?" |

### Copywriting Rules
- Lead with outcome, not feature
- One idea per headline
- Under 10 words is ideal
- Sub-headline expands with HOW

---

## 3. CTA Hierarchy

| Level | Purpose | Style |
|-------|---------|-------|
| **Primary** | Main conversion | Filled, brand color, large |
| **Secondary** | Low-commitment | Outline or ghost |
| **Tertiary** | Learn more | Text link with arrow |

### CTA Copy Patterns
- "Get started free" (removes friction)
- "Start building" (action-oriented)
- "See it in action" (low commitment)
- Avoid: "Submit", "Click here", "Learn more"

---

## 4. Visual Types

| Type | Best For | Complexity |
|------|----------|------------|
| **Product screenshot** | SaaS, apps | Low |
| **Illustration** | Abstract concepts | Medium |
| **Video/loop** | Motion products | High |
| **3D model** | Hardware, games | High |
| **Live UI demo** | Developer tools | High |
| **Before/after** | Transformation products | Medium |

---

## 5. Social Proof Patterns

```
Tier 1: Logo bar (brand recognition)
  "Trusted by teams at [Google] [Stripe] [Airbnb]"

Tier 2: Metric + context
  "10,000+ developers · 4.9★ on Product Hunt"

Tier 3: Testimonial avatar strip
  [photo] [photo] [photo] "Join 5,000+ happy users"
```

---

## 6. Layout Variants

| Layout | Description | Use When |
|--------|-------------|----------|
| **Centered** | Content centered, full-width bg | Brand storytelling |
| **Split** | Text left, visual right (50/50) | Product clarity |
| **Full-bleed** | Background image/video | Emotional impact |
| **Gradient** | Soft bg gradient | Modern SaaS |
| **Dark** | Dark background | Dev tools, gaming |

---

## 7. Animation Principles

```
Entrance animations:
├── Fade-up (0.4s ease-out) for headlines
├── Stagger children (0.1s delay each)
├── Parallax scroll on background
└── NO auto-play video with audio

Performance rules:
├── Animate opacity + transform only (GPU)
├── Avoid animating width/height/top/left
└── Respect prefers-reduced-motion
```

---

## 8. Performance Checklist

- [ ] LCP element (hero image/text) loads < 2.5s
- [ ] Hero image uses `<img loading="eager" fetchpriority="high">`
- [ ] No layout shift (reserve space for images)
- [ ] Mobile hero tested at 375px
- [ ] CTA visible without scrolling on mobile

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Auto-playing video with sound | Muted loop or user-triggered |
| Generic "Welcome to our platform" | Specific value proposition |
| 3 primary CTAs | 1 primary + 1 secondary max |
| Tiny CTA button on mobile | 44px min touch target |
| Carousel/slider as hero | Static or simple fade |
| No social proof | At minimum show logo bar |
"""