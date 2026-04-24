---
description: Full-stack feature build — scaffold, build, test, and optionally deploy
---

# Workflow: Full-Stack Build

End-to-end feature development: from idea to deployed code.

## Steps

1. **Plan** — use the `plan` agent to define scope
   ```
   /plan Build a [feature description]
   ```

2. **Scaffold** — use `frontend-specialist` or `backend-specialist`
   ```
   Scaffold the [feature]. Follow clean-code and naming-conventions skills.
   ```

3. **Implement** — iterate with the appropriate specialist agent
   - Frontend → `frontend-specialist`
   - Backend → `backend-specialist`
   - Full-stack → `orchestrator`

4. **Test** — use the `test-engineer` agent
   ```
   /test
   ```

5. **Review** — security + code quality check
   ```
   /audit-security
   /review-pr
   ```

6. **Deploy** — if using Daytona sandbox, run workflow `05-daytona-sandbox`
   Or deploy directly:
   ```
   /deploy-check
   ```

---

## Agent routing
| Task               | Agent                  |
|--------------------|------------------------|
| Architecture       | `orchestrator`         |
| UI components      | `frontend-specialist`  |
| API / DB           | `backend-specialist`   |
| Tests              | `test-engineer`        |
| Security review    | `security-auditor`     |
| Performance        | `performance-optimizer`|
