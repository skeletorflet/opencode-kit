---
name: logging-observability
description: Logging, monitoring and observability. Structured logging, metrics, tracing, alerting, Grafana, Datadog, OpenTelemetry.
---

# Logging & Observability

> You can\'t fix what you can\'t see.

---

## 1. The Three Pillars

| Pillar | What | Tools |
|--------|------|-------|
| **Logs** | Events, errors, audit trail | Pino, Winston, CloudWatch |
| **Metrics** | Counters, gauges, histograms | Prometheus, Datadog, StatsD |
| **Traces** | Request flow across services | OpenTelemetry, Jaeger, Zipkin |

---

## 2. Structured Logging

```ts
// Use JSON, not unstructured strings
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "api", version: process.env.APP_VERSION },
});

// ❌ Bad
console.log("User logged in: " + user.email);

// ✅ Good
logger.info({ userId: user.id, event: "user.login", ip: req.ip }, "User logged in");

// Error logging
logger.error({ err, userId, requestId }, "Payment failed");
```

---

## 3. Log Levels

| Level | When to Use |
|-------|------------|
| **fatal** | App crash, unrecoverable |
| **error** | Error requiring action (log + alert) |
| **warn** | Degraded state, near-threshold |
| **info** | Normal operations, key events |
| **debug** | Detailed for troubleshooting |
| **trace** | Very verbose (disable in prod) |

---

## 4. What to Log

```
Always log:
├── Requests (method, path, status, duration, userId)
├── Errors (full stack, context)
├── Auth events (login, logout, failure, token refresh)
├── External calls (service, url, duration, status)
├── Background jobs (start, success, fail, duration)
└── State changes (order status, payment, deployment)

Never log:
├── Passwords, secrets, tokens
├── Full credit card numbers
├── PII beyond business necessity
└── Health check endpoints (too noisy)
```

---

## 5. Request Context (Correlation IDs)

```ts
// Express middleware
import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";

const requestContext = new AsyncLocalStorage<{ requestId: string; userId?: string }>();

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] as string ?? randomUUID();
  res.setHeader("x-request-id", requestId);
  requestContext.run({ requestId }, next);
});

// Access anywhere in the call stack
const ctx = requestContext.getStore();
logger.info({ ...ctx, event: "payment.created" }, "Payment created");
```

---

## 6. OpenTelemetry Tracing

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const sdk = new NodeSDK({
  serviceName: "payment-service",
  traceExporter: new OTLPTraceExporter({
    url: "http://otel-collector:4318/v1/traces",
  }),
});

sdk.start();

// Manual span
import { trace } from "@opentelemetry/api";
const tracer = trace.getTracer("my-tracer");

async function processPayment(paymentId: string) {
  const span = tracer.startSpan("processPayment");
  span.setAttribute("payment.id", paymentId);
  try {
    const result = await doProcess();
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw err;
  } finally {
    span.end();
  }
}
```

---

## 7. Key Metrics to Track

| Category | Metrics |
|----------|---------|
| **HTTP** | Request rate, error rate, p50/p95/p99 latency |
| **Business** | Signups, payments, orders/min |
| **Infrastructure** | CPU, memory, disk, network I/O |
| **Database** | Query duration, connection pool, slow queries |
| **Queue** | Depth, processing time, fail rate |
| **Cache** | Hit rate, eviction rate, memory |

---

## 8. Alerting Rules

```
Alert design:
├── Alert on symptoms (high error rate) not causes (CPU spike)
├── Every alert must be actionable
├── Include runbook link in alert
├── Set severity: P1 (wake up), P2 (next hour), P3 (next day)

SLO-based alerts:
├── Error rate > 1% for 5min → P1
├── p95 latency > 2s for 10min → P2
├── Error budget burn rate > 2x → P2
```

---

## 9. Local Development

```ts
// Pretty-print logs locally
import pino from "pino";
import pinoPretty from "pino-pretty";

const logger = pino(
  { level: "debug" },
  process.env.NODE_ENV === "development"
    ? pinoPretty({ colorize: true })
    : process.stdout
);
```
