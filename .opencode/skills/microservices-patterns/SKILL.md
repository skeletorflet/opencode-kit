---
name: microservices-patterns
description: Microservices design patterns. Service decomposition, communication, resilience, API gateway, service discovery.
---

# Microservices Patterns

> Microservices solve organizational problems, not technical ones. Size for the team, not the technology.

---

## 1. When to Use Microservices

```
✅ Good fit:
├── Large team (> 10 engineers)
├── Independent deployment needed per domain
├── Different scaling requirements per service
├── Different tech stack requirements
└── Clear domain boundaries (DDD)

❌ Poor fit:
├── Small team (< 5 engineers)
├── Unclear domain boundaries
├── Monolith hasn\'t been built yet
└── Latency budget is very tight
```

---

## 2. Service Decomposition

| Pattern | Description |
|---------|-------------|
| **By business capability** | Orders, Inventory, Users (recommended) |
| **By subdomain (DDD)** | Bounded contexts drive service boundaries |
| **By data store** | Each service owns its data |
| **Strangler Fig** | Migrate monolith incrementally |

---

## 3. Communication Patterns

| Type | Protocol | When |
|------|---------|------|
| **Sync REST** | HTTP/JSON | Simple request-response |
| **Sync gRPC** | HTTP/2 + Protobuf | High performance, internal |
| **Async events** | Kafka, RabbitMQ | Decouple, reliability |
| **Async commands** | Queue (SQS, BullMQ) | Background work |

```
Sync: Service A → HTTP → Service B → response
  Pros: Simple, immediate feedback
  Cons: Tight coupling, cascade failures

Async: Service A → Event → Broker → Service B
  Pros: Decoupled, resilient, scalable
  Cons: Eventual consistency, harder to debug
```

---

## 4. API Gateway Pattern

```
Client
  │
  ▼
API Gateway (Kong / AWS API GW / Traefik)
  ├── Auth / JWT validation
  ├── Rate limiting
  ├── Request routing
  ├── Protocol translation
  ├── Response aggregation
  │
  ├── → Users Service
  ├── → Orders Service
  └── → Inventory Service
```

---

## 5. Resilience Patterns

### Circuit Breaker

```ts
import CircuitBreaker from "opossum";

const options = {
  timeout: 3000,       // 3s timeout
  errorThresholdPercentage: 50,   // Open if 50% fail
  resetTimeout: 30000, // Try again after 30s
};

const breaker = new CircuitBreaker(callExternalService, options);

breaker.on("open", () => logger.warn("Circuit opened"));
breaker.on("close", () => logger.info("Circuit closed"));

const result = await breaker.fire(params);
```

### Retry with Backoff

```ts
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
      await sleep(delay);
    }
  }
  throw new Error("Unreachable");
}
```

---

## 6. Service Discovery

```
DNS-based (Kubernetes):
  orders-service.default.svc.cluster.local

Service mesh (Istio / Linkerd):
  └── sidecar proxy handles: routing, retry, mTLS, tracing

Environment-based (simple):
  USERS_SERVICE_URL=http://users-service:3000
```

---

## 7. Data Management

```
Rules:
├── Each service owns its own database
├── No shared databases between services
├── Use events for cross-service data sync
└── Saga pattern for distributed transactions

Saga Pattern (distributed transaction):
  Order Service → OrderCreated event
    → Inventory Service → InventoryReserved event
      → Payment Service → PaymentCharged event
        → Order Service → OrderConfirmed

Compensating transactions on failure:
  PaymentFailed → ReleaseInventory → CancelOrder
```

---

## 8. Service Mesh

| Feature | Without Mesh | With Mesh (Istio) |
|---------|-------------|-------------------|
| mTLS | Manual | Automatic |
| Retries | Code | Config |
| Timeouts | Code | Config |
| Tracing | Manual | Automatic |
| Traffic split | Code | Config (canary) |

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Shared database | Each service owns data |
| Synchronous chains (A→B→C→D) | Events or BFF |
| Microservice per endpoint | Service per domain |
| Deploy all together | Deploy independently |
| Skip API Gateway | Use gateway for cross-cutting concerns |
