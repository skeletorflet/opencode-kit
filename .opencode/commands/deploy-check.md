---
description: Verify project is ready to deploy or publish
agent: project-planner
---

Check if the project is ready to deploy.

Current status:
!`git status --short`
!`git log --oneline -5`

Verify:
1. opencode.json has valid JSON syntax
2. All agents in .opencode/agents/ have valid frontmatter
3. All skills in .opencode/skills/ have SKILL.md files
4. No uncommitted breaking changes
5. AGENTS.md exists and is non-empty

List any blockers clearly.
