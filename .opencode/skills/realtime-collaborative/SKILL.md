---
name: realtime-collaborative
description: Engineering patterns for building multiplayer, real-time sync, and collaborative applications using WebSockets, WebRTC, and CRDTs.
---

# Realtime Collaborative Patterns

This skill applies to applications that require instant state synchronization across multiple clients, such as collaborative document editors, live dashboards, or chat applications.

## 1. Conflict-Free Replicated Data Types (CRDTs)

When building collaborative editors (text, canvas, standard fields), use CRDTs to prevent race conditions instead of standard Operational Transformation (OT).
- **Recommended Libraries:** `Yjs`, `Automerge`, or `Liveblocks`.
- **Implementation Rules:** Ensure the source of truth is the CRDT instance, with UI components binding to the CRDT observer methods, not standard local state.

## 2. Scaling WebSockets

For applications requiring massive real-time concurrency:
- **Stateless Services:** Keep WebSocket gateways completely stateless. Push connection state to standard Redis (PubSub) or equivalent managed event busses.
- **Broadcasting:** Target broadcasts to specific channels or namespaces (e.g., `room-id:1234`) to minimize unnecessary client traffic.
- **Heartbeats:** Always implement a rigorous ping/pong heartbeat interval (e.g., 30s) to prune broken, un-closed TCP connections.

## 3. Optimistic UI Updates

Users should feel zero latency.
- Provide immediate UI feedback by locally applying mutations the instant the user interacts.
- Store the original state before the mutation.
- Fire the asynchronous request to the server/socket.
- **Rollback:** If the socket responds with an error, silently revert the UI component state back to the original payload via your state manager.

## 4. Presence and Awareness

- Abstract User Cursors and "User is Typing" features into an `awareness` protocol distinct from your data layer. This traffic runs frequently (often every few ms) and should not clutter persistence databases.
