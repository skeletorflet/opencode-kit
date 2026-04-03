---
name: load-balancing
description: Load balancing patterns. Algorithms, Nginx, health checks, sticky sessions, blue-green deployment.
---

# Load Balancing

> Distribute traffic across instances. No single point of failure.

---

## 1. Load Balancing Algorithms

| Algorithm | How | When |
|-----------|-----|------|
| **Round Robin** | Requests cycle through servers | Uniform servers, stateless |
| **Least Connections** | Route to server with fewest connections | Long-lived connections |
| **IP Hash** | Client IP → same server | Session persistence (avoid if possible) |
| **Weighted Round Robin** | Distribute by server capacity | Mixed server sizes |
| **Random** | Random server selection | Simple, similar to round robin |
| **Health-check based** | Skip unhealthy servers | Always |

---

## 2. Nginx Load Balancing

```nginx
upstream api_servers {
    least_conn;  # Algorithm

    server api-1:3000 weight=2;   # Gets 2x traffic
    server api-2:3000 weight=1;
    server api-3:3000 backup;     # Only used if others fail

    keepalive 32;  # Reuse connections
}

server {
    listen 80;

    location /api {
        proxy_pass http://api_servers;
        proxy_http_version 1.1;
        proxy_set_header Connection "";  # Required for keepalive
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Health check via max_fails
        # Server removed after 3 failures in 30s
        proxy_next_upstream error timeout invalid_header;
        proxy_connect_timeout 2s;
        proxy_read_timeout 30s;
    }
}
```

---

## 3. Health Checks

```nginx
# Nginx Plus (commercial) - active health checks
upstream backend {
    zone backend 64k;
    server api-1:3000;
    server api-2:3000;
}

match server_ok {
    status 200-399;
    body ~ "ok";
}

server {
    location /api {
        proxy_pass http://backend;
        health_check uri=/health interval=5s fails=2 passes=1 match=server_ok;
    }
}
```

```ts
// App health endpoint
app.get("/health", async (req, res) => {
  const checks = await Promise.allSettled([
    db.$queryRaw`SELECT 1`,
    redis.ping(),
  ]);

  const healthy = checks.every(c => c.status === "fulfilled");
  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    db: checks[0].status,
    redis: checks[1].status,
  });
});
```

---

## 4. Session Handling (Stateless)

```
Prefer stateless applications:
├── Store sessions in Redis (shared across instances)
├── Use JWT (no server-side state)
└── Avoid sticky sessions (single point of failure)

If you must use sticky sessions (WebSockets):
├── IP Hash algorithm
├── Cookie-based persistence
└── Kubernetes: service with sessionAffinity: ClientIP
```

---

## 5. Blue/Green Deployment with LB

```
Blue environment: production (v1)
Green environment: staging (v2)

Steps:
1. Deploy v2 to green (no traffic)
2. Run smoke tests on green
3. Switch LB: 100% → green
4. Monitor for 10min
5. Keep blue as rollback

Rollback: switch LB back to blue (< 30s)

Nginx config reload (zero-downtime):
  nginx -s reload  # Graceful reload, no dropped connections
```

---

## 6. AWS ALB Configuration

```
Target Group settings:
├── Health check: /health, 200 OK required
├── Deregistration delay: 30s (drain connections)
├── Stickiness: disabled (prefer Redis sessions)
└── Protocol: HTTP/2 if supported

Auto Scaling integration:
  ALB → Auto Scaling Group
  Scale out when: CPU > 70% OR request count > 1000/sec
  Scale in when: CPU < 30% for 15min (cooldown)
```

---

## 7. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| No health checks | Active health checks on all instances |
| Server-side sessions without shared store | Redis for sessions |
| Ignore connection draining | Set deregistration delay |
| Single AZ | Multi-AZ deployment |
| LB without rate limiting | Add rate limiting at LB layer |
