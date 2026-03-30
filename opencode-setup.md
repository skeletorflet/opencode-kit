# OpenCode Full Setup Plan

## Goal
Wire the existing `.opencode/` kit (33 agents, 57 skills, 12 scripts) to OpenCode's runtime by creating the missing hub files: `opencode.json`, `AGENTS.md`, commands, tools, and prompts.

## Current State
- ✅ `.opencode/agents/` — 33 agents (no changes needed)
- ✅ `.opencode/skills/` — 57 skills (no changes needed)
- ✅ `.opencode/rules/` — RULES.md, GEMINI.md
- ✅ `.opencode/scripts/` — 12 validation scripts
- ✅ `.opencode/package.json` — `@opencode-ai/plugin` v1.2.26 installed
- ⚠️ `.opencode/mcp_config.json` — MCP config exists but separate from hub
- ❌ `opencode.json` — MISSING (the hub that connects everything)
- ❌ `AGENTS.md` — MISSING (project rules injected into every session)
- ❌ `.opencode/commands/` — MISSING (slash-commands)
- ❌ `.opencode/prompts/` — MISSING (reusable prompt files)
- ❌ `.opencode/tools/` — MISSING (custom callable tools)

---

## Tasks

### Task 1: Create `opencode.json` at project root
- [ ] Create the hub config with all sections:
  - `provider` — API key via env vars
  - `model` / `small_model` — Claude Sonnet + Haiku
  - `instructions` — point to AGENTS.md + rules/*.md
  - `permission` — global defaults (edit=ask, bash=ask, webfetch=allow, skill=allow)
  - `agent` — configure `build` (primary, default) and `plan` (read-only)
  - `command` — register inline deploy-check command
  - `mcp` — migrate context7, shadcn, netlify from mcp_config.json
  - `lsp` — typescript-language-server
  - `formatter` — prettier
  - `default_agent` — "build"
- **Verify:** `cat opencode.json` → valid JSON, all sections present

### Task 2: Create `AGENTS.md` at project root
- [ ] Write project rules file with:
  - Project overview (antigravity-kit-opencode)
  - Stack description
  - Critical rules (agent routing, skill loading, clean code)
  - Code standards
  - Reference to `.opencode/rules/RULES.md`
- **Verify:** `cat AGENTS.md` → file exists at root, non-empty

### Task 3: Create `.opencode/prompts/` directory + prompt files
- [ ] Create `prompts/` directory
- [ ] Create `.opencode/prompts/build.txt` — build agent system prompt
- [ ] Create `.opencode/prompts/review.txt` — review agent system prompt
- **Verify:** `ls .opencode/prompts/` → 2 .txt files present

### Task 4: Create `.opencode/commands/` directory + slash-commands
- [ ] Create `commands/` directory
- [ ] Create `.opencode/commands/review-pr.md` — code review before PR
- [ ] Create `.opencode/commands/fix-types.md` — find/fix TS errors
- [ ] Create `.opencode/commands/audit-security.md` — security audit
- [ ] Create `.opencode/commands/deploy-check.md` — deployment readiness
- [ ] Create `.opencode/commands/gen-docs.md` — generate documentation
- **Verify:** `ls .opencode/commands/` → 5 .md files present

### Task 5: Create `.opencode/tools/` directory + custom tools
- [ ] Create `tools/` directory
- [ ] Create `.opencode/tools/run-script.ts` — run package.json scripts
- [ ] Create `.opencode/tools/read-env.ts` — list env var names
- **Verify:** `ls .opencode/tools/` → 2 .ts files present

### Task 6: Verify OpenCode TUI loads correctly
- [ ] Run `opencode` and confirm:
  - Agents load (Tab cycles through primary agents)
  - `/review-pr` and other commands appear in autocomplete
  - Skills are listed in agent context
  - MCP servers connect (context7, shadcn, netlify)
  - No config errors in startup
- **Verify:** `opencode` starts without errors, Tab shows agents

---

## Done When
- [ ] `opencode.json` exists at root with all sections (provider, model, instructions, permissions, agent, command, mcp, lsp, formatter)
- [ ] `AGENTS.md` exists at root with project rules
- [ ] `.opencode/prompts/` has 2 prompt files (build.txt, review.txt)
- [ ] `.opencode/commands/` has 5 slash-commands
- [ ] `.opencode/tools/` has 2 custom tools
- [ ] `opencode` TUI starts without errors
