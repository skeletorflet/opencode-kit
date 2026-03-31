# SDK

The OpenCode TypeScript SDK for programmatic interaction.

---

## Installation

```bash
npm install @opencode-ai/sdk
```

---

## Overview

The SDK provides a TypeScript client for interacting with OpenCode's HTTP server (`opencode serve`).

---

## Basic Usage

```typescript
import { OpenCode } from "@opencode-ai/sdk";

const client = new OpenCode({
  baseUrl: "http://localhost:4096",
});

// Send a message
const response = await client.chat.send({
  message: "Explain how closures work in JavaScript",
});

console.log(response);
```

---

## Authentication

```typescript
const client = new OpenCode({
  baseUrl: "http://localhost:4096",
  username: "opencode",
  password: process.env.OPENCODE_SERVER_PASSWORD,
});
```

---

## Plugin Context

Plugins receive a `client` instance for SDK access:

```javascript
export const MyPlugin = async ({ client }) => {
  // Use client for AI interaction
  await client.app.log({
    body: {
      service: "my-plugin",
      level: "info",
      message: "Plugin initialized",
    },
  });
};
```

---

## Logging

```typescript
await client.app.log({
  body: {
    service: "my-service",
    level: "info",    // debug, info, warn, error
    message: "Something happened",
    extra: { key: "value" },
  },
});
```

---

## Vercel AI SDK Provider

Use OpenCode with the Vercel AI SDK:

```bash
npm install ai-sdk-provider-opencode-sdk
```

```typescript
import { createOpenCodeProvider } from "ai-sdk-provider-opencode-sdk";

const opencode = createOpenCodeProvider({
  baseUrl: "http://localhost:4096",
});

// Use with Vercel AI SDK
const result = await generateText({
  model: opencode("anthropic/claude-sonnet-4"),
  prompt: "Hello!",
});
```

---

## Use Cases

| Use Case | Description |
|----------|-------------|
| **Custom UIs** | Build alternative frontends |
| **Automation** | Script complex workflows |
| **Integration** | Embed in existing tools |
| **Testing** | Automated testing of AI responses |
| **Plugins** | Access AI from plugin code |
