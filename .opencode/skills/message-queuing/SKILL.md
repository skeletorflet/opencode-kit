---
name: message-queuing
description: Message queue patterns. RabbitMQ, Kafka, BullMQ, SQS. Producer/consumer, dead letter queues, retry strategies.
---

# Message Queuing

> Decouple producers from consumers. Build resilient async systems.

---

## 1. When to Use Queues

| Scenario | Reason |
|----------|--------|
| Send email after signup | Don\'t block HTTP response |
| Image processing | CPU-intensive, long-running |
| Payment webhooks | Retry on failure, audit trail |
| Fan-out notifications | Send to many consumers |
| Rate-limited external APIs | Throttle request flow |
| Order processing pipeline | Sequential guaranteed steps |

---

## 2. Library/Service Selection

| Tool | Best For | Guarantees |
|------|----------|------------|
| **BullMQ** (Redis) | Node.js, simple queues | At-least-once |
| **RabbitMQ** | Complex routing, multi-language | At-least-once / exactly-once |
| **Apache Kafka** | High-throughput event streaming | At-least-once |
| **AWS SQS** | Serverless, managed | At-least-once |
| **AWS SQS FIFO** | Ordered, dedup | Exactly-once |
| **pg-boss** | Postgres-backed, simple | At-least-once |

---

## 3. BullMQ Patterns (Node.js)

```ts
import { Queue, Worker, QueueEvents } from "bullmq";
import { redis } from "./redis";

// Producer
const emailQueue = new Queue("emails", { connection: redis });

await emailQueue.add("welcome", {
  to: "user@example.com",
  userId: "123",
}, {
  attempts: 3,
  backoff: { type: "exponential", delay: 2000 },
  removeOnComplete: 100,
  removeOnFail: 500,
});

// Consumer
const worker = new Worker("emails", async (job) => {
  await sendEmail(job.data);
}, {
  connection: redis,
  concurrency: 10,
});

worker.on("failed", (job, err) => {
  logger.error(`Job ${job?.id} failed: ${err.message}`);
});
```

---

## 4. RabbitMQ Patterns

```
Exchange types:
├── direct   → Route by exact routing key
├── topic    → Route by pattern (user.*, *.created)
├── fanout   → Broadcast to all queues
└── headers  → Route by message headers

Pattern: Dead Letter Exchange (DLX)
  Queue → max retries → DLX → Dead Letter Queue → manual review
```

---

## 5. Retry Strategies

| Strategy | Formula | Use When |
|----------|---------|---------|
| **Fixed** | delay = N | Simple, predictable |
| **Exponential** | delay = base^attempt | Network errors |
| **Exponential + jitter** | delay = random(0, base^attempt) | Distributed systems |
| **Linear** | delay = attempt * N | Gradual backoff |

```ts
// Exponential backoff with jitter
function backoff(attempt: number): number {
  const base = 1000; // 1s
  const max = 30000; // 30s cap
  const delay = Math.min(base * Math.pow(2, attempt), max);
  return delay * (0.5 + Math.random() * 0.5); // ±50% jitter
}
```

---

## 6. Dead Letter Queue (DLQ)

```
Flow:
  Main Queue
    → Job fails max retries
    → Moves to DLQ automatically
    → Alert fires
    → Engineer reviews + replays or discards

DLQ principles:
├── Every queue should have a DLQ
├── Alert on DLQ depth > threshold
├── Store full job payload + error history
├── Provide replay mechanism
└── Set DLQ retention (e.g., 14 days)
```

---

## 7. Idempotency

```
Always design consumers to be idempotent:
  - Processing a job twice should have same result as once
  - Use deduplication ID: check DB before processing
  - Use DB upsert instead of insert
  - Track processed message IDs in Redis/DB

Example:
  if (await db.processedMessages.exists(job.id)) return;
  await db.processedMessages.create({ id: job.id });
  await actuallyProcess(job);
```

---

## 8. Monitoring Metrics

| Metric | Alert Threshold |
|--------|----------------|
| Queue depth | > 1000 (depends on SLA) |
| Consumer lag | > target processing time |
| Failed job rate | > 1% |
| DLQ depth | > 0 |
| Processing time | > p99 SLA |

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| No retry logic | Always configure retries |
| No DLQ | Every queue needs a DLQ |
| Non-idempotent consumers | Design for at-least-once |
| Queuing in the DB naively | Use pg-boss or dedicated tool |
| Huge message payloads | Store payload in S3, pass reference |
"""