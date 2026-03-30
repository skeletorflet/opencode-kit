---
description: Run a security audit on the entire project or a specific path
agent: security-auditor
subtask: true
---

Perform a full security audit on: $ARGUMENTS

!`find ${1:-.} -name "*.ts" -o -name "*.js" -o -name "*.json" | head -30`

Focus on:
- Exposed API keys or secrets in config files
- MCP server configuration safety
- Agent permission escalation risks
- Supply chain vulnerabilities in dependencies
- Input validation in custom tools

Also check: !`cat package.json 2>/dev/null`

Output a structured report with severity: CRITICAL / HIGH / MEDIUM / LOW.
