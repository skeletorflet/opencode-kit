---
name: caching-strategies
description: Caching patterns. HTTP caching, Redis, CDN, browser cache, cache invalidation strategies.
---

# Caching Strategies

> A cache hit is the fastest request. The fastest database query is no query.

---

## 1. Cache Hierarchy

```
Browser Cache (ms)
    ↓
CDN / Edge Cache (ms)
    ↓
Load Balancer Cache (ms)
    ↓
Application Cache / Redis (ms)
    ↓
Database Query Cache (ms)
    ↓
Database (ms–s)
```

---

## 2. HTTP Caching Headers

| Header | Purpose | Example |
|--------|---------|---------|
| `Cache-Control` | Directives for browser/CDN | `max-age=3600, s-maxage=86400` |
| `ETag` | Conditional request validation | `"abc123"` |
| `Last-Modified` | Time-based validation | `Wed, 21 Oct 2015 07:28:00 GMT` |
| `Vary` | Cache key variations | `Vary: Accept-Encoding, Cookie` |

```
Cache-Control directives:
├── public          → CDN can cache
├── private         → Browser only (logged-in content)
├── no-cache        → Revalidate before use
├── no-store        → Never cache (sensitive data)
├── max-age=N       → Browser TTL in seconds
└── s-maxage=N      → CDN TTL (overrides max-age for CDN)
```

---

## 3. Cache Invalidation Strategies

| Strategy | Description | Use When |
|----------|-------------|---------|
| **TTL (Time-to-Live)** | Expire after N seconds | Data changes predictably |
| **Write-through** | Update cache on write | Low write volume, strong consistency |
| **Write-behind** | Async cache update | High write throughput |
| **Cache-aside** | App manages cache manually | General purpose |
| **Event-driven** | Invalidate on domain events | Microservices |

```
Cache-aside pattern:
1. Read: check cache → hit → return
2. Read: miss → query DB → store in cache → return
3. Write: update DB → DELETE cache key (not update)
```

---

## 4. Redis Patterns

```python
# Cache-aside (Python)
import json
from redis import Redis

r = Redis()
TTL = 3600  # 1 hour

def get_user(user_id: str):
    key = f"user:{user_id}"
    cached = r.get(key)
    if cached:
        return json.loads(cached)
    
    user = db.query_user(user_id)  # DB call
    r.setex(key, TTL, json.dumps(user))
    return user

def update_user(user_id: str, data: dict):
    db.update_user(user_id, data)
    r.delete(f"user:{user_id}")  # Invalidate
```

```ts
// TypeScript / Node.js
const CACHE_KEY = (id: string) => `user:${id}`;

async function getUser(id: string) {
  const cached = await redis.get(CACHE_KEY(id));
  if (cached) return JSON.parse(cached);
  
  const user = await db.user.findUnique({ where: { id } });
  await redis.setex(CACHE_KEY(id), 3600, JSON.stringify(user));
  return user;
}
```

---

## 5. CDN Caching

| Resource | Strategy | max-age |
|----------|---------|---------|
| HTML pages | `no-cache` or short TTL | 0–300s |
| JS/CSS (hashed names) | Long TTL | 31536000s (1yr) |
| Images (hashed) | Long TTL | 31536000s |
| API responses (public) | Short TTL | 60–300s |
| API responses (private) | `private, no-store` | — |

```
Cache-busting with content hashing:
/assets/main.a3f4b2c.js  ← filename changes on content change
→ Set Cache-Control: max-age=31536000, immutable
```

---

## 6. Application-Level Patterns

| Pattern | Description |
|---------|-------------|
| **Memoization** | Cache function result by args |
| **Request deduplication** | Collapse concurrent identical requests |
| **Stale-while-revalidate** | Return cached + refresh in background |
| **Circuit breaker + cache** | Serve cache when downstream fails |

---

## 7. Cache Key Design

```
Bad:  "users"                 (too broad, cache pollution)
Good: "users:list:page=1:limit=20:sort=name"
Good: "user:{id}:profile"
Good: "org:{orgId}:feature-flags"

Namespace conventions:
  {entity}:{id}:{subresource}
  {entity}:list:{filter-hash}
```

---

## 8. What NOT to Cache

- Passwords, secrets, tokens
- User-specific sensitive data without `private` directive
- Financial transactions (always fresh)
- Real-time data (websocket, SSE)
- Non-idempotent responses (POST results)

---

## 9. Monitoring

- Track **hit rate** (target > 80%)
- Track **eviction rate** (too high = cache too small)
- Alert on cache miss spikes (stampede risk)
- Use **Redis MONITOR** or keyspace notifications
"""