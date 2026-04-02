---
description: oh-my-opencode main flow — multi-agent orchestration Sisyphus → Prometheus → Atlas
---

# oh-my-opencode Main Flow

This workflow documents the full working cycle with the omo multi-agent system.
**Critical rule:** never use Atlas without a prior plan from Prometheus.

---

## Step 1 — Activate Orchestrator (Sisyphus)

Start opencode normally. Sisyphus is the default agent.

```
opencode
```

For complex tasks, activate maximum performance mode:

```
ultrawork
ulw
```

For tasks that require iteration until 100% complete (Ralph Loop + Ultrawork):

```
/ulw-loop
```

---

## Step 2 — Planning with Prometheus

Prometheus **interviews the user** to clarify scope and generates a detailed plan.
**Never touches code.** Only produces the plan in `.sisyphus/plans/*.md`.

```
@prometheus "build a JWT authentication system with refresh tokens"
```

Prometheus will ask about:
- Technology stack
- Use cases and edge cases
- Existing constraints or dependencies
- Acceptance criteria

The resulting plan is saved in `.sisyphus/plans/` — review it before continuing.

---

## Step 3 — Execution with Atlas

Once the plan is approved, Atlas reads `boulder.json` and executes task by task,
delegating subtasks to specialized sub-agents (Hephaestus, Librarian, Explore, etc.).

```
/start-work
@atlas
```

Atlas works autonomously. To track progress:

```
/status
```

---

## Step 4 — Architecture Consultation (Oracle)

At any point, consult Oracle for architecture decisions.
Oracle **never writes code or executes bash** — advisory only.

```
@oracle "is this microservices structure correct?"
@oracle "should I use event sourcing or CQRS here?"
```

---

## Step 5 — Fast Research

For documentation lookups or codebase exploration without consuming tokens from heavy agents:

```
@librarian "Prisma docs for many-to-many relations"
@explore "how is the service layer structured in this repo"
```

---

## omo Command Reference

| Command | Description |
|---|---|
| `ultrawork` / `ulw` | Maximum parallel orchestration mode |
| `ultrathink` | Extended thinking (32k budget) |
| `search` / `find` | Maximizes search with Explore + Librarian in parallel |
| `analyze` / `investigate` | Deep multi-expert analysis mode |
| `/start-work` | Atlas picks up the Prometheus plan and executes it |
| `/ralph-loop` | Iterates until all TODOs are complete |
| `/ulw-loop` | Ultrawork + Ralph combined |
| `/init-deep` | Generates hierarchical AGENTS.md in subdirectories |
| `npx oh-my-opencode doctor` | omo system diagnostics |

---

## omo Skills to Activate Per Task

These skills come with omo but are activated explicitly:

```
delegate_task(subagent_type="sisyphus", load_skills=["frontend-ui-ux"], prompt="...")
delegate_task(subagent_type="atlas", load_skills=["git-master"], prompt="...")
delegate_task(subagent_type="hephaestus", load_skills=["playwright"], prompt="...")
```

Available skills: `playwright`, `playwright-cli`, `agent-browser`, `dev-browser`,
`git-master`, `frontend-ui-ux`
