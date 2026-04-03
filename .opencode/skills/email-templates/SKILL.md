---
name: email-templates
description: Email template design and implementation. React Email, MJML, responsive HTML emails, Resend, deliverability.
---

# Email Templates

> Email HTML is a time machine to 2005. Design accordingly.

---

## 1. Email HTML Constraints

```
What works in email (2024):
├── Tables for layout (still required for Outlook)
├── Inline CSS (most reliable)
├── Web-safe fonts + Google Fonts (partial support)
├── Max width: 600px
└── Images with alt text (images may be blocked)

What doesn\'t work:
├── Flexbox / Grid (Outlook)
├── JavaScript (blocked everywhere)
├── External CSS files (often stripped)
├── CSS animations (limited support)
└── Video (fallback to image+link)
```

---

## 2. React Email

```tsx
import {
  Html, Head, Body, Container, Section,
  Heading, Text, Button, Img, Link, Hr
} from "@react-email/components";

export function WelcomeEmail({ name, confirmUrl }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", padding: "40px" }}>
          <Img src="https://myapp.com/logo.png" width="120" height="36" alt="MyApp" />

          <Heading style={{ fontSize: "24px", color: "#1a1a1a", marginTop: "32px" }}>
            Welcome, {name}!
          </Heading>

          <Text style={{ fontSize: "16px", lineHeight: "24px", color: "#444" }}>
            Thanks for signing up. Confirm your email to get started.
          </Text>

          <Button
            href={confirmUrl}
            style={{
              backgroundColor: "#3B82F6",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "6px",
              fontSize: "16px",
              display: "block",
              textAlign: "center",
              marginTop: "24px",
            }}
          >
            Confirm Email
          </Button>

          <Hr style={{ marginTop: "40px", borderColor: "#e5e7eb" }} />
          <Text style={{ fontSize: "12px", color: "#9ca3af" }}>
            If you didn\'t create an account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## 3. Sending with Resend

```ts
import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "MyApp <noreply@myapp.com>",
  to: [user.email],
  subject: "Welcome to MyApp",
  html: render(<WelcomeEmail name={user.name} confirmUrl={url} />),
  // text: render(<WelcomeEmail ... />, { plainText: true }), // accessibility
});
```

---

## 4. Email Types & Content

| Type | Subject Formula | Key CTA |
|------|----------------|---------|
| **Welcome** | "Welcome to {Product}" | Confirm / Get started |
| **Password reset** | "Reset your password" | Reset password |
| **Order confirmation** | "Your order #{id} is confirmed" | View order |
| **Invoice** | "Invoice #{id} from {company}" | Pay / Download |
| **Trial expiry** | "Your trial ends in 3 days" | Upgrade |
| **Digest** | "Your weekly summary" | View dashboard |
| **Notification** | Specific event | Take action |

---

## 5. Responsive Email

```html
\x3C!-- Mobile-first with media queries -->
<style>
  @media only screen and (max-width: 600px) {
    .container { width: 100% !important; padding: 20px !important; }
    .button { width: 100% !important; }
    .col { display: block !important; width: 100% !important; }
  }
</style>

\x3C!-- Two-column layout (table-based) -->
<table width="600" style="width:600px">
  <tr>
    <td width="280" class="col" style="width:280px;padding-right:20px">
      Left column
    </td>
    <td width="280" class="col" style="width:280px">
      Right column
    </td>
  </tr>
</table>
```

---

## 6. Deliverability Checklist

```
DNS records:
├── SPF: "v=spf1 include:resend.com -all"
├── DKIM: CNAME records from your ESP
└── DMARC: "v=DMARC1; p=quarantine; rua=..."

Content:
├── Text + HTML versions both present
├── Unsubscribe link required (CAN-SPAM / GDPR)
├── Physical mailing address in footer
├── Avoid spam trigger words ("Free!", "Guaranteed")
└── Image-to-text ratio: not image-only

Testing:
├── Mail Tester (mail-tester.com) → aim for 10/10
├── Litmus or Email on Acid → cross-client testing
└── Test with: Gmail, Outlook, Apple Mail, mobile
```

---

## 7. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Image-only emails | Balance text + images |
| No plain text version | Always include plain text |
| No unsubscribe link | Required by law |
| Track pixels without consent | Disclose tracking |
| Send from @gmail.com | Use own domain |
| Huge images | Optimize < 200kb total |
