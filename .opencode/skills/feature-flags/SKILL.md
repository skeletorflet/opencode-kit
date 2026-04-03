---
name: feature-flags
description: Feature flag patterns. Gradual rollouts, A/B testing, kill switches, LaunchDarkly, environment flags.
---

# Feature Flags

> Ship safely. Separate deployment from release.

---

## 1. Types of Feature Flags

| Type | Purpose | Lifetime |
|------|---------|---------|
| **Release toggle** | Gradual rollout, hide incomplete | Days–weeks |
| **Experiment toggle** | A/B testing | Duration of test |
| **Ops toggle** | Kill switch, circuit breaker | Indefinite |
| **Permission toggle** | Feature per plan/role | Indefinite |
| **Config flag** | Dynamic configuration | Indefinite |

---

## 2. Implementation Approaches

| Approach | When |
|----------|------|
| Environment variables | Simple, per-deployment |
| Database flags | Dynamic, no redeploy |
| Redis flags | Fast reads, dynamic |
| Managed service (LaunchDarkly, Unleash) | Complex targeting |

---

## 3. Simple Implementation (DB + Redis)

```ts
// Schema
model FeatureFlag {
  key        String   @id
  enabled    Boolean  @default(false)
  rolloutPct Int      @default(0)   // 0-100
  allowList  String[] @default([])  // User IDs
  updatedAt  DateTime @updatedAt
}

// Flag evaluation
async function isEnabled(flagKey: string, userId?: string): Promise<boolean> {
  const cached = await redis.get(`flag:${flagKey}`);
  const flag: FeatureFlag = cached ? JSON.parse(cached) : await loadFromDB(flagKey);

  if (!flag || !flag.enabled) return false;

  // Allow list
  if (userId && flag.allowList.includes(userId)) return true;

  // Percentage rollout (consistent per user)
  if (flag.rolloutPct > 0 && userId) {
    const hash = murmurhash(`${flagKey}:${userId}`) % 100;
    return hash < flag.rolloutPct;
  }

  return flag.rolloutPct === 100;
}
```

---

## 4. LaunchDarkly Integration

```ts
import { init } from "launchdarkly-node-server-sdk";

const client = init(process.env.LAUNCHDARKLY_SDK_KEY!);
await client.waitForInitialization();

// Evaluate flag with user context
const enabled = await client.variation("new-checkout", {
  key: user.id,
  email: user.email,
  country: user.country,
  plan: user.plan,
}, false); // default value

if (enabled) {
  return <NewCheckout />;
} else {
  return <OldCheckout />;
}
```

---

## 5. React Hook

```tsx
function useFeatureFlag(key: string): boolean {
  const { data } = useQuery({
    queryKey: ["flags", key],
    queryFn: () => fetchFlag(key),
    staleTime: 60_000, // 1 min
  });
  return data?.enabled ?? false;
}

// Usage
function Checkout() {
  const newCheckout = useFeatureFlag("new-checkout");
  return newCheckout ? <NewCheckout /> : <OldCheckout />;
}
```

---

## 6. Gradual Rollout Strategy

```
Rollout stages:
  0%  → Deployed but hidden (dark launch)
  1%  → Canary (catch crashes)
  10% → Limited beta
  25% → Wider test
  50% → Half users
  100% → Full release
  Flag deleted → Code cleaned up

Monitor per stage:
  - Error rate
  - Latency
  - Business metrics
  - User feedback
```

---

## 7. Flag Management Rules

```
Lifecycle rules:
├── Every flag has an owner + expiry date
├── Release flags: delete after 2 weeks of 100% rollout
├── Experiment flags: delete after analysis
├── Name: {domain}.{feature} (e.g. checkout.new-flow)
└── Document purpose in flag description

Tech debt prevention:
├── Track flags in JIRA/Linear ticket
├── PR to remove flag after release
└── Alert when flag older than 90 days
```

---

## 8. Kill Switch Pattern

```ts
// Ops toggle for circuit breaker
const USE_STRIPE = isEnabled("payments.stripe");
const USE_PAYPAL_FALLBACK = isEnabled("payments.paypal-fallback");

async function processPayment(order: Order) {
  if (USE_STRIPE) {
    return await stripeCharge(order);
  }
  if (USE_PAYPAL_FALLBACK) {
    return await paypalCharge(order);
  }
  throw new Error("No payment provider available");
}
```

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Nested flag conditions | One flag, one decision |
| Flags forever | Set expiry, clean up |
| No monitoring | Track flag evaluation metrics |
| Flag in wrong layer | Evaluate server-side for security |
| Hardcoded user lists | Use targeting rules |
