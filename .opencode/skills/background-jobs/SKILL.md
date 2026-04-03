---
name: background-jobs
description: Background job patterns. Cron jobs, queued jobs, scheduling, BullMQ, pg-boss, Sidekiq patterns.
---

# Background Jobs

> Move slow, unreliable, or heavy work out of the request lifecycle.

---

## 1. Job Types

| Type | Description | Examples |
|------|-------------|---------|
| **Queued** | Triggered by event, run ASAP | Send email, process image |
| **Scheduled (cron)** | Run on time interval | Daily report, cleanup |
| **Delayed** | Run after a delay | Trial expiry reminder |
| **Recurring** | Repeating job per user | Weekly digest |
| **Chained** | Job triggers next job | Pipeline: upload → resize → notify |
| **Batch** | Process many items | Bulk export, bulk email |

---

## 2. BullMQ Comprehensive Setup

```ts
// queues/index.ts
import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

const defaultJobOptions = {
  attempts: 3,
  backoff: { type: "exponential" as const, delay: 2000 },
  removeOnComplete: { count: 100, age: 24 * 3600 },
  removeOnFail: { count: 500 },
};

export const emailQueue = new Queue("emails", {
  connection: redis,
  defaultJobOptions,
});

export const imageQueue = new Queue("images", {
  connection: redis,
  defaultJobOptions: { ...defaultJobOptions, attempts: 2 },
});

// workers/email.worker.ts
import { Worker, Job } from "bullmq";

const worker = new Worker("emails", async (job: Job) => {
  switch (job.name) {
    case "welcome": return await sendWelcomeEmail(job.data);
    case "invoice": return await sendInvoiceEmail(job.data);
    case "reset":   return await sendPasswordReset(job.data);
    default: throw new Error(`Unknown job: ${job.name}`);
  }
}, {
  connection: redis,
  concurrency: 5,
  limiter: { max: 100, duration: 60_000 }, // 100 jobs/min
});

worker.on("completed", (job) => logger.info(`Job ${job.id} done`));
worker.on("failed", (job, err) => logger.error({ job: job?.id, err }, "Job failed"));
```

---

## 3. Cron Jobs (BullMQ)

```ts
import { QueueScheduler, Queue } from "bullmq";

const reportQueue = new Queue("reports", { connection: redis });

// Add repeatable job
await reportQueue.add("daily-report", { type: "daily" }, {
  repeat: { pattern: "0 9 * * *", tz: "America/New_York" }, // 9am daily
});

// One-time delayed
await reportQueue.add("trial-expiry-reminder", { userId }, {
  delay: 13 * 24 * 60 * 60 * 1000, // 13 days
});
```

---

## 4. Cron Expression Reference

```
┌──────── minute (0–59)
│ ┌────── hour (0–23)
│ │ ┌──── day of month (1–31)
│ │ │ ┌── month (1–12)
│ │ │ │ ┌ day of week (0–6, Sun=0)
│ │ │ │ │
* * * * *

Examples:
0 * * * *       Every hour at :00
0 9 * * 1-5    Weekdays at 9am
*/15 * * * *   Every 15 minutes
0 0 1 * *      First day of month at midnight
0 2 * * *      Every day at 2am
```

---

## 5. Job Design Principles

```
Design jobs to be:
├── Idempotent (safe to run twice)
├── Atomic (fully succeeds or fails cleanly)
├── Independent (no shared state between jobs)
├── Observable (log start, end, error)
└── Bounded (time limit / timeout)

Job size:
├── Small jobs (< 30s) → simpler error handling
├── Large jobs → break into smaller jobs
└── Never: infinite loops without exit condition
```

---

## 6. Progress Tracking

```ts
// Update job progress
const worker = new Worker("exports", async (job) => {
  const items = await fetchItems(job.data.filter);

  for (let i = 0; i < items.length; i++) {
    await processItem(items[i]);
    await job.updateProgress(Math.round((i + 1) / items.length * 100));
  }
});

// Client: poll progress
const job = await exportQueue.getJob(jobId);
console.log(await job.progress); // 0–100
```

---

## 7. Graceful Shutdown

```ts
// Handle SIGTERM (Kubernetes, Heroku)
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, closing workers...");
  await worker.close(); // Wait for current job to finish
  await redis.quit();
  process.exit(0);
});
```

---

## 8. Monitoring Dashboard

```ts
// Bull Board (UI dashboard)
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullMQAdapter(emailQueue), new BullMQAdapter(imageQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());
```

---

## 9. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| HTTP requests in cron without retry | Queue-based with retry |
| Blocking the main thread | Always async |
| Jobs without timeout | Set job timeout |
| No monitoring | Bull Board + alerts |
| Non-idempotent jobs | Design for at-least-once |
