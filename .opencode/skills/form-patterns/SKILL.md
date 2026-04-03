---
name: form-patterns
description: Form design and validation patterns. UX, accessibility, React Hook Form, Zod, error handling.
---

# Form Patterns

> Forms are where users do work. Remove every obstacle.

---

## 1. Form Anatomy

```
Label (above input, never placeholder-only)
Input / Select / Checkbox / Radio
Helper text (optional guidance below)
Error message (replaces helper text on error)
```

---

## 2. Input Types Reference

| Data | Input Type |
|------|-----------|
| Short text | `<input type="text">` |
| Email | `<input type="email">` |
| Password | `<input type="password">` + show toggle |
| Number | `<input type="number">` or text + mask |
| Long text | `<textarea>` |
| Date | Native `date` or custom picker |
| One of few options | Radio group (≤5) or Select (>5) |
| Many options | Multi-select or Combobox |
| Boolean | Checkbox or Toggle |
| File | `<input type="file">` with drag zone |

---

## 3. Validation Strategy

```
When to validate:
├── On blur (field loses focus) → best UX
├── On submit → acceptable
├── On change → only after first error shown (revalidate)
└── NEVER on keypress for first validation

Server-side:
├── Always re-validate server-side regardless of client
├── Return field-level errors { field: "email", message: "..." }
└── Show server errors inline next to fields
```

---

## 4. React Hook Form + Zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await loginUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email} />
        {errors.email && (
          <span id="email-error" role="alert">{errors.email.message}</span>
        )}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
```

---

## 5. Error Message Guidelines

| ❌ Bad | ✅ Good |
|--------|---------|
| "Invalid input" | "Email must include @" |
| "Error 422" | "This email is already registered" |
| "Required" | "Please enter your name" |
| "Password wrong" | "Incorrect password. Forgot it?" |

**Rules:**
- Tell what\'s wrong AND how to fix it
- Place error directly under the field
- Use `role="alert"` for screen readers
- Red text with icon; never red alone (color blindness)

---

## 6. Multi-Step Forms

```
Progress indicator:
  Step 1: Account   Step 2: Profile   Step 3: Review

Rules:
├── Show step X of Y
├── Allow back navigation without data loss
├── Persist state (localStorage / URL params)
├── Validate step before proceeding
└── Show summary on final step before submit
```

---

## 7. Accessibility Checklist

- [ ] Every input has associated `<label>` (not just placeholder)
- [ ] Error messages linked via `aria-describedby`
- [ ] Invalid fields have `aria-invalid="true"`
- [ ] Required fields marked with `required` attr + visual indicator
- [ ] Form submittable via keyboard (Enter)
- [ ] Focus moves to first error after failed submit
- [ ] Autocomplete attributes set (`autocomplete="email"` etc.)

---

## 8. UX Patterns

| Pattern | Description |
|---------|-------------|
| **Inline validation** | Validate on blur, not keypress |
| **Password strength** | Visual meter + requirements list |
| **Input masks** | Phone, credit card, date formatting |
| **Autofocus** | First field on page load (not modals unless modal-only) |
| **Smart defaults** | Pre-fill from account, geolocation |
| **Disable submit** | Only while submitting (not on invalid) |
| **Success feedback** | Clear confirmation, not just form reset |

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Placeholder as label | Visible label always |
| Validate on every keypress | Validate on blur |
| Generic "form error" at top only | Field-level inline errors |
| Password confirm field | Show/hide toggle instead |
| Disable browser autocomplete | Allow it |
| Asterisk without explanation | "(required)" in legend or label |
"""