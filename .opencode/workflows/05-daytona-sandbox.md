---
description: Create a Daytona sandbox, deploy a project inside it, and get a live preview URL
---

# Workflow: Daytona Sandbox → Live Preview

Use this workflow to run code in an isolated Daytona sandbox and get a shareable preview link.

## Prerequisites
- `DAYTONA_API_KEY` must be set in `.env`
- `@daytonaio/opencode` plugin must be active in `opencode.json`

---

## Steps

1. **Verify environment**
   Ask the agent to confirm Daytona credentials are loaded:
   ```
   Check that DAYTONA_API_KEY and DAYTONA_API_URL are set and valid.
   ```

2. **Scaffold the project in the sandbox**
   Tell the agent what to build. The Daytona plugin will automatically
   create a sandbox for this session:
   ```
   Create a simple Next.js hello-world page inside the Daytona sandbox.
   Install dependencies and start the dev server.
   ```

3. **Get the preview URL**
   Once the server starts inside the sandbox, Daytona will expose a
   public URL. Ask the agent:
   ```
   What is the preview URL for the running server?
   ```

4. **Iterate inside the sandbox**
   All code changes the agent makes will happen inside the isolated sandbox.
   Git changes sync to a local `opencode/` branch automatically.

5. **Review & merge**
   When satisfied, merge the `opencode/<session>` branch to your main branch:
   ```
   git checkout main
   git merge opencode/<session-id>
   ```

---

## Notes
- Sandboxes auto-stop after 15 min of inactivity (configurable in Daytona dashboard)
- Sandboxes persist until you delete the OpenCode session
- To run without a sandbox (local only), disable the `@daytonaio/opencode` plugin
