---
name: offline-first
description: Offline-first patterns. Service Workers, Background Sync, IndexedDB, cache strategies, conflict resolution.
---

# Offline-First

> Design for offline. Online is an enhancement.

---

## 1. Cache Strategies

| Strategy | How | Use For |
|----------|-----|---------|
| **Cache First** | Cache → Network (stale fallback) | Static assets, fonts |
| **Network First** | Network → Cache on fail | API data, dynamic content |
| **Stale While Revalidate** | Cache (immediately) + refresh in bg | Feeds, listings |
| **Cache Only** | Cache only, no network | App shell |
| **Network Only** | Network only, no cache | Real-time, sensitive |

---

## 2. Service Worker Setup

```ts
// sw.ts (Workbox)
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST); // App shell

// Static assets: Cache First
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 86400 })],
  })
);

// API: Network First
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 3,
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 60 * 60 })],
  })
);
```

---

## 3. Background Sync

```ts
// Queue failed requests for later
const bgSyncPlugin = new BackgroundSyncPlugin("mutations-queue", {
  maxRetentionTime: 24 * 60, // 24 hours
});

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/mutations"),
  new NetworkOnly({ plugins: [bgSyncPlugin] }),
  "POST"
);
```

```ts
// Manual background sync
navigator.serviceWorker.ready.then(sw => {
  return sw.sync.register("sync-messages");
});

// In SW
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-messages") {
    event.waitUntil(syncPendingMessages());
  }
});
```

---

## 4. IndexedDB for Local Data

```ts
import { openDB } from "idb";

const db = await openDB("myapp", 1, {
  upgrade(db) {
    const store = db.createObjectStore("todos", { keyPath: "id" });
    store.createIndex("synced", "synced");
  },
});

// Write locally (optimistic)
async function addTodo(todo: Todo) {
  const localTodo = { ...todo, synced: false, localId: crypto.randomUUID() };
  await db.add("todos", localTodo);

  // Sync in background
  if (navigator.onLine) {
    await syncTodo(localTodo);
  }
}

// Get unsynced on reconnect
window.addEventListener("online", async () => {
  const unsynced = await db.getAllFromIndex("todos", "synced", false);
  await Promise.all(unsynced.map(syncTodo));
});
```

---

## 5. Conflict Resolution Strategies

| Strategy | Description | Use When |
|----------|-------------|---------|
| **Last Write Wins** | Latest timestamp wins | Simple, low conflict |
| **Server Wins** | Server always authoritative | Financial, inventory |
| **Client Wins** | Client always wins | User preferences |
| **Manual merge** | Present conflict to user | Documents, collaborative |
| **CRDTs** | Conflict-free data structures | Real-time collab |

```ts
// Last Write Wins with timestamp
type SyncedEntity = {
  id: string;
  data: unknown;
  updatedAt: Date;
  localUpdatedAt: Date;
};

function resolveConflict(server: SyncedEntity, local: SyncedEntity) {
  return local.localUpdatedAt > server.updatedAt ? local : server;
}
```

---

## 6. Offline UX Patterns

```
Status indicators:
├── Online/offline banner (subtle, dismissible)
├── "Changes saved locally" indicator
├── "Syncing..." when reconnected
└── "Sync failed" with retry button

What works offline:
├── Reading cached content
├── Creating/editing (queue for sync)
├── Search (local index)
└── Settings changes

What requires online:
├── Authentication
├── Payment
├── Real-time features
└── Sharing/collaboration
```

---

## 7. Testing Offline

```
Chrome DevTools:
  Network tab → Offline checkbox
  Application → Service Workers → Offline

Simulate slow network:
  Network → Throttling → Slow 3G

Test scenarios:
├── Start offline (nothing cached yet)
├── Go offline after loading (has cache)
├── Create data offline, come back online
└── Conflict: edit on two devices offline
```
