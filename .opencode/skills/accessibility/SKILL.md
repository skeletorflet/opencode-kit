---
name: accessibility
description: Web accessibility (a11y). WCAG 2.1, ARIA, keyboard navigation, screen readers, testing tools.
---

# Accessibility (a11y)

> Accessible apps are better apps for everyone.

---

## 1. WCAG 2.1 Core Principles (POUR)

| Principle | Meaning |
|-----------|---------|
| **Perceivable** | Info must be presentable to all senses |
| **Operable** | UI must be keyboard + assistive tech operable |
| **Understandable** | Content and operation must be comprehensible |
| **Robust** | Must work with current + future assistive tech |

**Target: AA conformance** (minimum for most products)

---

## 2. Color & Contrast

| Element | Minimum Ratio | AA+ Ratio |
|---------|-------------|-----------|
| Normal text (< 18px) | 4.5:1 | 7:1 |
| Large text (≥ 18px) | 3:1 | 4.5:1 |
| UI components (borders, icons) | 3:1 | — |
| Disabled state | No requirement | — |

```
Tools:
├── WebAIM Contrast Checker
├── Chrome DevTools → Accessibility panel
└── axe DevTools browser extension
```

---

## 3. Semantic HTML First

```html
\x3C!-- ❌ Bad -->
<div class="button" onclick="submit()">Submit</div>
<div class="heading">Section Title</div>
<div class="nav">...</div>

\x3C!-- ✅ Good -->
<button type="submit">Submit</button>
<h2>Section Title</h2>
<nav aria-label="Main navigation">...</nav>
```

---

## 4. ARIA Patterns

```html
\x3C!-- When to use ARIA:
     Rule 1: Don\'t use ARIA if native HTML works
     Rule 2: Don\'t change native semantics unnecessarily
     Rule 3: All interactive ARIA controls must be keyboard-focusable -->

\x3C!-- Modal Dialog -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
  <h2 id="modal-title">Confirm Delete</h2>
  <p id="modal-desc">This action cannot be undone.</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>

\x3C!-- Live Region (dynamic content) -->
<div aria-live="polite" aria-atomic="true">
  \x3C!-- Updates announced to screen readers -->
  {statusMessage}
</div>

\x3C!-- Icon button -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

\x3C!-- Loading -->
<div role="status" aria-label="Loading users...">
  <Spinner />
</div>
```

---

## 5. Keyboard Navigation

| Key | Expected Behavior |
|-----|------------------|
| `Tab` | Move to next focusable element |
| `Shift+Tab` | Move to previous |
| `Enter` / `Space` | Activate button/link |
| `Escape` | Close modal/dropdown |
| Arrow keys | Navigate within widget (menu, tabs, listbox) |

```tsx
// Focus trap (modals)
import { useFocusTrap } from "@mantine/hooks"; // or write custom

function Modal({ isOpen, onClose, children }) {
  const focusTrapRef = useFocusTrap(isOpen);
  return isOpen ? (
    <div ref={focusTrapRef} role="dialog" aria-modal="true">
      {children}
    </div>
  ) : null;
}

// Skip link (keyboard shortcut to main content)
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

## 6. Images & Media

```html
\x3C!-- Informative image -->
<img src="chart.png" alt="Bar chart showing 40% increase in Q4 revenue" />

\x3C!-- Decorative image -->
<img src="divider.png" alt="" role="presentation" />

\x3C!-- Icon (standalone meaning) -->
<svg aria-label="Settings" role="img">...</svg>

\x3C!-- Video -->
<video>
  <track kind="captions" src="captions.vtt" srclang="en" label="English" />
</video>
```

---

## 7. Form Accessibility

```html
\x3C!-- Always associate label with input -->
<label for="email">Email address</label>
<input id="email" type="email" required
  aria-describedby="email-hint email-error"
  aria-invalid="true" />
<span id="email-hint">We\'ll never share your email.</span>
<span id="email-error" role="alert">Please enter a valid email.</span>

\x3C!-- Fieldset for groups -->
<fieldset>
  <legend>Notification preferences</legend>
  <label><input type="checkbox" name="email"> Email</label>
  <label><input type="checkbox" name="sms"> SMS</label>
</fieldset>
```

---

## 8. Testing Tools

| Tool | Type | Use For |
|------|------|---------|
| **axe DevTools** | Browser ext | Automated scan |
| **Lighthouse** | Chrome DevTools | Audit score |
| **NVDA** | Screen reader (Windows) | Manual testing |
| **VoiceOver** | Screen reader (Mac/iOS) | Manual testing |
| **jest-axe** | Unit test | CI/CD integration |
| **Playwright** | E2E | Keyboard/focus testing |

```ts
// jest-axe
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

it("has no accessibility violations", async () => {
  const { container } = render(<MyForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 9. Quick Checklist

- [ ] Color contrast meets AA (4.5:1 normal text)
- [ ] Keyboard navigable (Tab, Enter, Escape, arrows)
- [ ] All images have meaningful alt text
- [ ] Forms have visible labels (not just placeholders)
- [ ] Focus indicators visible (don\'t `outline: none`)
- [ ] Skip navigation link on every page
- [ ] Error messages associated with fields
- [ ] Page has one `<h1>`, logical heading hierarchy
- [ ] Interactive elements have 44×44px touch target minimum
