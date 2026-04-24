---
description: Security review workflow — run before merging any branch to main
---

# Workflow: Security Review (Pre-Merge)

Run this before merging to catch vulnerabilities, secrets leaks, and auth issues.

## Steps

1. **Static security scan**
   ```
   /audit-security
   ```

2. **Dependency audit**
   Ask the `security-auditor` agent:
   ```
   Check for known CVEs in package.json dependencies.
   Run: npm audit --audit-level=moderate
   ```

3. **Secrets scan** — verify no secrets are hardcoded
   ```
   Search all source files for patterns like API keys, tokens, or passwords
   that should not be committed.
   ```

4. **Auth & input validation review**
   Use the `security-auditor` agent + `input-sanitization` skill:
   ```
   Review all user-input handling for SQL injection, XSS, and CSRF risks.
   ```

5. **Final checklist**
   ```
   python .opencode/scripts/security_scan.py
   python .opencode/scripts/checklist.py
   ```

---

## Agents & Skills
- Agent: `security-auditor`, `penetration-tester`
- Skills: `secrets-management`, `input-sanitization`, `encryption-patterns`, `vulnerability-scanner`
