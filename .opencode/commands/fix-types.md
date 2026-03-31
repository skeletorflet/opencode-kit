---
description: Find and fix TypeScript type errors in the project
agent: debugger
---

Run the TypeScript compiler and fix all type errors:

!`npx tsc --noEmit 2>&1 | head -50`

Fix every error above. Prefer proper types over `any` casts.
After fixing, verify with another tsc run.
