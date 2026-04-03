---
name: payment-integration
description: Payment integration patterns. Stripe, webhooks, subscriptions, one-time payments, PCI compliance.
---

# Payment Integration

> Payments are critical path. Test every failure scenario.

---

## 1. Stripe Architecture

```
Client                Server              Stripe
  │                      │                   │
  ├─ Create PaymentIntent ─→                 │
  │                      ├── POST /payment_intents → │
  │                      │←── { client_secret } ──── │
  │←── { client_secret } ┤                   │
  │                      │                   │
  ├─ Confirm (Stripe.js) ─────────────────────→
  │←────────── redirect / success ────────────┤
  │                      │                   │
  │                 ← webhook ─────────────── │
  │                  (payment_intent.succeeded)
```

---

## 2. One-Time Payment (Checkout Session)

```ts
// Server: create session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [{
    price_data: {
      currency: "usd",
      product_data: { name: "Pro Plan" },
      unit_amount: 2900, // $29.00 in cents
    },
    quantity: 1,
  }],
  mode: "payment",
  success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/cancel`,
  metadata: { userId: user.id },
});

return { url: session.url };
```

---

## 3. Subscriptions

```ts
// Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customer.stripeCustomerId,
  items: [{ price: priceId }],
  payment_behavior: "default_incomplete",
  payment_settings: { save_default_payment_method: "on_subscription" },
  expand: ["latest_invoice.payment_intent"],
});

// DB: store subscription.id, status, current_period_end
```

---

## 4. Webhook Handling

```ts
// ALWAYS verify webhook signature
app.post("/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"]!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch {
      return res.status(400).send("Webhook signature invalid");
    }

    // Idempotency: check if processed
    const exists = await db.webhookEvents.findUnique({ where: { id: event.id } });
    if (exists) return res.json({ received: true });

    await db.webhookEvents.create({ data: { id: event.id, type: event.type } });

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }

    res.json({ received: true });
  }
);
```

---

## 5. Customer Portal

```ts
// Let customers manage billing themselves
const portalSession = await stripe.billingPortal.sessions.create({
  customer: user.stripeCustomerId,
  return_url: `${baseUrl}/dashboard`,
});

redirect(portalSession.url);
```

---

## 6. Key Webhook Events

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Fulfill order |
| `invoice.paid` | Extend subscription |
| `invoice.payment_failed` | Email user, retry |
| `customer.subscription.updated` | Sync plan in DB |
| `customer.subscription.deleted` | Downgrade access |
| `checkout.session.completed` | Provision product |

---

## 7. Database Schema

```prisma
model User {
  stripeCustomerId    String?  @unique
  subscriptionId      String?  @unique
  subscriptionStatus  String?  // active, trialing, past_due, canceled
  currentPeriodEnd    DateTime?
  plan                String   @default("free")
}

model WebhookEvent {
  id          String   @id  // Stripe event ID
  type        String
  processedAt DateTime @default(now())
}
```

---

## 8. PCI Compliance

```
PCI DSS SAQ A (lowest scope) requires:
├── NEVER touch raw card data on your server
├── Use Stripe.js / Elements (tokenize client-side)
├── HTTPS everywhere
├── Store only: last4, brand, exp — NO full card numbers
└── Stripe handles the rest (they are PCI Level 1)
```

---

## 9. Testing

```ts
// Stripe test cards
4242 4242 4242 4242  // Success
4000 0025 0000 3155  // 3D Secure required
4000 0000 0000 9995  // Always declined
4000 0000 0000 0341  // Attach fails

// Test webhooks locally
stripe listen --forward-to localhost:3000/webhooks/stripe
```
"""