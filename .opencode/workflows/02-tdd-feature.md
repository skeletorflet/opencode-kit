---
description: Test-Driven Development core loop for new feature construction.
---

# TDD Feature Workflow (Red-Green-Refactor)

Use this workflow when creating an isolated piece of business logic or isolated component.

1. Tell the `test-engineer` to define failing tests for your new component using the `/test` command. E.g. `/test MyNewFeature.tsx`. Validate the expected inputs/outputs are correct.
// turbo
2. Run your testing framework (e.g. `npm run test` or `pytest`) to verify tests explicitly fail (The RED phase). 
3. Direct your execution agent (like `backend-specialist` or `frontend-specialist`) to write the minimal code to pass the tests.
// turbo
4. Re-run your testing framework to verify tests now pass (The GREEN phase). If they fail, return to step 3.
5. Once tests pass, run the `/enhance` command on the implemented file to optimize its complexity or clean up the code.
// turbo
6. Run the tests one final time to verify regressions were not introduced (The REFACTOR phase).
