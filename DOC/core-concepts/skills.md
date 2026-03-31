# Skills

**Agent Skills** are reusable instruction sets that OpenCode discovers on-demand. They let you define domain-specific knowledge and workflows that agents can load when needed.

---

## How Skills Work

1. You create `SKILL.md` files in skill directories
2. OpenCode lists available skills in the `skill` tool description
3. Agents see available skills and load them via the `skill` tool when relevant
4. The full skill content is injected into the conversation

---

## Creating Skills

### File Structure

Create one folder per skill name with a `SKILL.md` inside:

```
.opencode/skills/<name>/SKILL.md
```

### Skill Locations

| Location | Scope |
|----------|-------|
| `.opencode/skills/<name>/SKILL.md` | Project-local |
| `~/.config/opencode/skills/<name>/SKILL.md` | Global |
| `.claude/skills/<name>/SKILL.md` | Claude-compatible (project) |
| `~/.claude/skills/<name>/SKILL.md` | Claude-compatible (global) |
| `.agents/skills/<name>/SKILL.md` | Agent-compatible (project) |
| `~/.agents/skills/<name>/SKILL.md` | Agent-compatible (global) |

### SKILL.md Format

Every skill must start with YAML frontmatter:

```markdown
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---
## What I do
- Draft release notes from merged PRs
- Propose a version bump based on commit history
- Provide a copy-pasteable `gh release create` command

## When to use me
Use this when preparing a tagged release.
Ask clarifying questions if the target versioning scheme is unclear.

## Process
1. Run `git log --oneline` since last tag
2. Categorize changes (feat, fix, breaking)
3. Propose version bump (semver)
4. Generate changelog
5. Provide release command
```

---

## Frontmatter Rules

### Required Fields

| Field | Rules |
|-------|-------|
| `name` | 1-64 chars, lowercase alphanumeric with hyphens, must match directory name |
| `description` | 1-1024 chars, specific enough for agent to choose correctly |

### Optional Fields

| Field | Description |
|-------|-------------|
| `license` | License identifier (e.g., `MIT`) |
| `compatibility` | Compatible platforms (e.g., `opencode`) |
| `metadata` | String-to-string map for custom data |

### Name Validation

Skill names must match:
```regex
^[a-z0-9]+(-[a-z0-9]+)*$
```

Rules:
- Lowercase alphanumeric only
- Single hyphen separators
- No leading/trailing hyphens
- No consecutive `--`
- Must match the containing directory name

---

## Skill Discovery

For project-local paths, OpenCode walks up from the current working directory to the git worktree root, loading skills from `.opencode/skills/`, `.claude/skills/`, and `.agents/skills/` along the way.

Global skills are loaded from `~/.config/opencode/skills/`, `~/.claude/skills/`, and `~/.agents/skills/`.

---

## Using Skills

The agent sees available skills in the `skill` tool description:

```
<available_skills>
  <skill>
    <name>git-release</name>
    <description>Create consistent releases and changelogs</description>
  </skill>
</available_skills>
```

The agent loads a skill by calling:
```
skill({ name: "git-release" })
```

---

## Skill Permissions

### Global Permissions

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

| Permission | Behavior |
|------------|----------|
| `"allow"` | Skill loads immediately |
| `"deny"` | Skill hidden from agent, access rejected |
| `"ask"` | User prompted before loading |

### Per-Agent Permissions

**Custom agents** (in markdown frontmatter):
```markdown
---
permission:
  skill:
    "documents-*": "allow"
---
```

**Built-in agents** (in `opencode.json`):
```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

### Disable Skills Entirely

**Custom agents**:
```markdown
---
tools:
  skill: false
---
```

**Built-in agents**:
```json
{
  "agent": {
    "plan": {
      "tools": { "skill": false }
    }
  }
}
```

---

## Example Skills

### TypeScript Best Practices
```markdown
---
name: ts-best-practices
description: TypeScript coding standards and patterns for this project
---
## TypeScript Standards

### Types
- Use `unknown` instead of `any`
- Narrow with type guards
- Prefer interfaces for object shapes
- Use type aliases for unions

### Error Handling
- Always use Result<T, E> pattern
- Never throw raw Error objects
- Wrap external calls in try/catch

### Naming
- PascalCase for types and interfaces
- camelCase for variables and functions
- UPPER_SNAKE_CASE for constants
```

### Database Migrations
```markdown
---
name: db-migrations
description: Database migration workflow for this project
---
## Migration Workflow

### Creating Migrations
1. Run `npm run db:migrate:create <name>`
2. Edit the generated file in `migrations/`
3. Always include both `up` and `down`
4. Test with `npm run db:migrate:up`

### Conventions
- One table change per migration
- Never modify existing migration files
- Always test down migration
- Add indexes for frequently queried columns
```

---

## Troubleshooting

If a skill doesn't show up:

1. **Verify filename**: `SKILL.md` must be all caps
2. **Check frontmatter**: Must include `name` and `description`
3. **Check uniqueness**: Skill names must be unique across all locations
4. **Check permissions**: Skills with `deny` are hidden from agents
