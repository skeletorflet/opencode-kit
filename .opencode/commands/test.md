---
description: Generate unit, integration, or E2E tests for the active context
agent: test-engineer
---

Generate tests adhering strictly to the `.opencode/skills/testing-patterns/SKILL.md` guidelines for: $ARGUMENTS

### Testing Requirements:
1. **Determine Test Type:** Is this a unit test (isolated logic), integration test (multiple components), or E2E (browser)?
2. **Find Target File:** Locate the source code you are testing.
3. **Create Test File:** Standardize the naming (e.g., `*.test.ts`, `*_test.go`, `test_*.py`).
4. **Red-Green-Refactor:** Assert edge cases, invalid inputs, and happy paths.
5. **Run Tests:** Execute the test suite automatically to verify your tests pass.
