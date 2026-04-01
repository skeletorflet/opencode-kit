---
description: Final security, UX, and testing checks before pushing or deploying to production.
---

# Pre-Flight Audit Workflow

// turbo-all

Run this workflow whenever a feature is complete and you are preparing to finalize a Pull Request.
This makes use of the OpenCode Kit's validation suite.

1. Run the `verify_all.py` script: `python .opencode/scripts/verify_all.py .`
2. If any of the checks fail (e.g., *Security Scan*, *Lint Check*), stop and fix the underlying issues automatically.
3. Once all internal OpenCode audits pass, build the project output: `npm run build` or `cargo build --release` or equivalent.
4. Run the suite of tests you generated during the project: `npm run test` or `go test ./...`.
5. Run `git status` to verify which files were modified.
6. Commit the changes using a conventional commit format (e.g., `feat: completed pre-flight audit for feature X`).
