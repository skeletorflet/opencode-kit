---
name: push-notifications
description: Push notification patterns. Web Push, FCM, APNs, notification design, opt-in flows, delivery strategies.
---

# Push Notifications

> Notifications that help users are features. Notifications that annoy are bugs.

---

## 1. Platform Overview

| Platform | Service | Library |
|----------|---------|---------|
| **Web** | Web Push API | `web-push` npm |
| **Android** | Firebase Cloud Messaging (FCM) | Firebase SDK |
| **iOS** | Apple Push Notification service (APNs) | Firebase SDK / APNs direct |
| **Unified** | FCM (handles both Android + web) | Firebase Admin SDK |

---

## 2. Web Push Implementation

```ts
// Server: generate VAPID keys (once)
import webpush from "web-push";

const vapidKeys = webpush.generateVAPIDKeys();
// Store PUBLIC_VAPID_KEY and PRIVATE_VAPID_KEY in env

webpush.setVapidDetails(
  "mailto:admin@myapp.com",
  process.env.PUBLIC_VAPID_KEY!,
  process.env.PRIVATE_VAPID_KEY!,
);

// Send notification
async function sendWebPush(subscription: PushSubscription, payload: object) {
  await webpush.sendNotification(
    subscription,
    JSON.stringify(payload),
    { TTL: 60 * 60 * 24 } // 24h TTL
  );
}
```

```ts
// Client: Service Worker registration
const registration = await navigator.serviceWorker.register("/sw.js");

async function subscribeToPush() {
  const sub = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
  });

  // Send to server
  await fetch("/api/push/subscribe", {
    method: "POST",
    body: JSON.stringify(sub),
    headers: { "Content-Type": "application/json" },
  });
}
```

```js
// Service Worker (sw.js)
self.addEventListener("push", (event) => {
  const data = event.data?.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/badge-72.png",
      data: { url: data.url },
      actions: [
        { action: "view", title: "View" },
        { action: "dismiss", title: "Dismiss" },
      ],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "view") {
    clients.openWindow(event.notification.data.url);
  }
});
```

---

## 3. FCM (Android + Web)

```ts
import { initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

initializeApp({ credential: cert(serviceAccount) });
const messaging = getMessaging();

// Single device
await messaging.send({
  token: deviceFcmToken,
  notification: {
    title: "New message",
    body: "You have 3 unread messages",
  },
  data: { url: "/messages", type: "chat" },
  android: {
    priority: "high",
    notification: { channelId: "messages", sound: "default" },
  },
  apns: {
    payload: { aps: { sound: "default", badge: 3 } },
  },
});

// Multiple devices (up to 500)
await messaging.sendEachForMulticast({
  tokens: deviceTokens,
  notification: { title: "...", body: "..." },
});
```

---

## 4. Opt-in Flow Design

```
Best practices:
├── Don\'t request permission immediately on load
├── Show value first: "Get notified when your order ships"
├── Use custom in-app prompt before browser prompt
├── Store preference in DB even if denied
└── Provide easy opt-out in profile/settings

Timing:
├── After user completes meaningful action
├── When notification value is clear
└── NEVER before any engagement
```

---

## 5. Notification Types & Priority

| Type | Priority | When |
|------|---------|------|
| **Transactional** | High | Order shipped, payment failed |
| **Alert** | High | Security event, system down |
| **Social** | Medium | Comment, like, follow |
| **Promotional** | Low | Sale, newsletter |
| **Digest** | Low | Weekly summary |

---

## 6. Delivery Strategy

```
Smart delivery:
├── Quiet hours (don\'t send 2am local time)
├── Frequency cap (max 3/day per user)
├── Dedup (don\'t send same notification twice)
├── Batch similar (1 notification for 10 likes)
└── Respect user preferences per type

Retry on failure:
├── 429 (rate limited) → exponential backoff
├── 410 (token expired) → remove subscription from DB
└── 5xx → retry with backoff, max 3 attempts
```

---

## 7. Database Schema

```prisma
model PushSubscription {
  id          String   @id @default(cuid())
  userId      String
  endpoint    String   @unique
  p256dh      String
  auth        String
  platform    String   // web | android | ios
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

model NotificationPreference {
  userId      String   @id
  orderUpdates Boolean @default(true)
  messages     Boolean @default(true)
  marketing    Boolean @default(false)
  quietStart   Int     @default(22)  // 10pm
  quietEnd     Int     @default(8)   // 8am
}
```
