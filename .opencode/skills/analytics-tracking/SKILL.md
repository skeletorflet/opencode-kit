---
name: analytics-tracking
description: Analytics and event tracking. Product analytics, Mixpanel, PostHog, Segment, GDPR compliance, event taxonomy.
---

# Analytics & Event Tracking

> Measure what matters. Track events, not pageviews.

---

## 1. Analytics Types

| Type | Question | Tools |
|------|---------|-------|
| **Product analytics** | How do users use the product? | Mixpanel, Amplitude, PostHog |
| **Web analytics** | Traffic, sessions, pages? | Google Analytics, Plausible |
| **Error tracking** | What errors occur? | Sentry, Rollbar |
| **Revenue analytics** | MRR, churn, LTV? | Baremetrics, Stripe Revenue |
| **Infra analytics** | System health? | Datadog, Grafana |

---

## 2. Event Taxonomy

```
Naming convention: {object}_{action}
  user_signed_up
  user_logged_in
  payment_completed
  subscription_upgraded
  feature_clicked
  onboarding_step_completed
  report_exported

Avoid:
  click  (too generic)
  pageview  (too generic)
  button_click  (what button?)
```

---

## 3. PostHog (Self-hosted or Cloud)

```ts
// Server-side
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
  host: "https://app.posthog.com",
  flushAt: 20,
  flushInterval: 10_000,
});

// Track event
posthog.capture({
  distinctId: user.id,
  event: "payment_completed",
  properties: {
    amount: order.total,
    currency: "USD",
    plan: order.plan,
    method: order.paymentMethod,
  },
});

// Identify user (set properties)
posthog.identify({
  distinctId: user.id,
  properties: {
    email: user.email,
    plan: user.plan,
    createdAt: user.createdAt,
    company: user.company,
  },
});

// Shutdown (flush remaining events)
await posthog.shutdown();
```

```tsx
// Client-side React
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest", // Proxy to avoid ad blockers
  person_profiles: "identified_only",
  capture_pageview: false, // Manual for SPAs
});

// Track
posthog.capture("feature_clicked", { feature: "dark-mode" });

// Identify after login
posthog.identify(user.id, { email: user.email, plan: user.plan });

// Page view (SPA)
useEffect(() => {
  posthog.capture("$pageview");
}, [pathname]);
```

---

## 4. Segment (CDP)

```ts
import Analytics from "@segment/analytics-node";

const analytics = new Analytics({ writeKey: process.env.SEGMENT_WRITE_KEY! });

// Track
analytics.track({
  userId: user.id,
  event: "Order Completed",
  properties: {
    orderId: order.id,
    total: order.total,
    products: order.items,
  },
});

// Identify
analytics.identify({
  userId: user.id,
  traits: { email: user.email, plan: user.plan },
});

// Segment routes to: Mixpanel, Amplitude, Salesforce, etc.
```

---

## 5. Event Properties Standard

```ts
// Always include on every event
const baseProperties = {
  userId: user.id,
  sessionId: session.id,
  platform: "web",    // web | ios | android
  appVersion: "1.2.0",
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString(),
};

// Revenue events: include these
const revenueProperties = {
  revenue: order.total,
  currency: "USD",
  orderId: order.id,
};
```

---

## 6. Key Metrics to Track

| Metric | Events Needed |
|--------|--------------|
| Activation rate | user_signed_up + first_key_action |
| Retention (D1/D7/D30) | session_started per day |
| Feature adoption | feature_first_used |
| Conversion funnel | step_1_completed → ... → converted |
| Churn signal | last_active_date |

---

## 7. GDPR Compliance

```ts
// Consent-based tracking
if (user.analyticsConsent) {
  posthog.opt_in_capturing();
} else {
  posthog.opt_out_capturing();
}

// Anonymize if no consent
posthog.capture("page_viewed", {
  path: window.location.pathname,
  // No user ID, no PII
});

// Honor deletion requests
await posthog.deleteUser(userId);
await analytics.deleteUser(userId);
```

---

## 8. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Track everything | Track what drives decisions |
| Inconsistent event names | Enforce naming convention |
| No server-side tracking | Combine client + server |
| Block-able client-only | Proxy analytics through your domain |
| Track PII in events | Use IDs, hash emails |
