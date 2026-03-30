---
description: Review current branch changes before opening a PR
agent: review
subtask: true
---

Review the following changes for a pull request:

!`git diff main...HEAD`

Recent commits:
!`git log main..HEAD --oneline`

Check for:
- Logic errors and edge cases
- Security issues
- Code quality and TypeScript strictness
- Missing tests
- Agent boundary violations (agents writing outside their domain)

Output a structured review with MUST FIX / SHOULD FIX / SUGGESTION sections.
