---
name: websocket-patterns
description: WebSocket and real-time patterns. Socket.io, native WebSocket, Server-Sent Events, connection management, rooms.
---

# WebSocket Patterns

> Use the right real-time primitive. Not everything needs a WebSocket.

---

## 1. Real-Time Technology Choice

| Technology | Direction | When |
|-----------|-----------|------|
| **WebSocket** | Bidirectional | Chat, gaming, live collab |
| **Server-Sent Events (SSE)** | Server → Client | Live feeds, notifications |
| **HTTP Polling** | Client-initiated | Simple, compatibility |
| **Long Polling** | Client-initiated | When WebSocket blocked |

```
SSE is simpler than WebSocket for one-way data.
Use WebSocket only when client needs to send data frequently.
```

---

## 2. Socket.io Server

```ts
import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
  pingTimeout: 60_000,
  pingInterval: 25_000,
});

// Authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const user = await verifyToken(token);
    socket.data.user = user;
    next();
  } catch {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  const { user } = socket.data;
  console.log(`${user.id} connected`);

  // Join room
  socket.on("join:room", (roomId: string) => {
    socket.join(roomId);
    socket.to(roomId).emit("user:joined", { userId: user.id });
  });

  // Message
  socket.on("message:send", async ({ roomId, content }) => {
    const message = await db.message.create({
      data: { content, authorId: user.id, roomId },
      include: { author: true },
    });
    io.to(roomId).emit("message:new", message);
  });

  socket.on("disconnect", (reason) => {
    console.log(`${user.id} disconnected: ${reason}`);
  });
});
```

---

## 3. Socket.io Client (React)

```tsx
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const s = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    s.on("connect", () => console.log("Connected"));
    s.on("connect_error", (err) => console.error("Connection error:", err));

    setSocket(s);
    return () => { s.disconnect(); };
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

// Usage in component
function ChatRoom({ roomId }: { roomId: string }) {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join:room", roomId);
    socket.on("message:new", (msg) => setMessages(prev => [...prev, msg]));
    return () => { socket.off("message:new"); socket.emit("leave:room", roomId); };
  }, [socket, roomId]);
}
```

---

## 4. Server-Sent Events (SSE)

```ts
// Express SSE endpoint
app.get("/events", auth, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Send event
  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\\\
data: ${JSON.stringify(data)}\\\
\\\
`);
  };

  // Subscribe to updates
  const unsubscribe = pubSub.subscribe(`user:${req.user.id}`, (event) => {
    send(event.type, event.data);
  });

  // Heartbeat to prevent timeout
  const heartbeat = setInterval(() => res.write(": ping\\\
\\\
"), 30_000);

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});
```

```tsx
// Client SSE
useEffect(() => {
  const es = new EventSource("/events", { withCredentials: true });

  es.addEventListener("notification", (e) => {
    addNotification(JSON.parse(e.data));
  });

  es.onerror = () => setTimeout(() => es.close(), 1000); // reconnect

  return () => es.close();
}, []);
```

---

## 5. Scaling WebSockets

```
Single server: Socket.io in-process
Multiple servers: Need sticky sessions + Redis adapter

Redis adapter (Socket.io):
import { createAdapter } from "@socket.io/redis-adapter";
io.adapter(createAdapter(pubClient, subClient));

→ Events now propagate across all server instances
→ io.to(room).emit() works across servers
```

---

## 6. Connection Management

```
Reconnection:
├── Exponential backoff (1s, 2s, 4s, 8s, max 30s)
├── Stop retry after N attempts
├── Notify user if offline for extended period
└── Re-sync state on reconnect (not just resume)

Presence:
├── Track connected sockets per user in Redis
├── Publish presence events on connect/disconnect
└── Debounce disconnect (user may have briefly lost connection)
```

---

## 7. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| WebSocket for read-only data | SSE (simpler) |
| No auth on WebSocket | Auth in middleware |
| Emit to all clients | Use rooms/namespaces |
| No reconnect logic | Always implement reconnect |
| Store socket connections in DB | Use in-memory + Redis |
