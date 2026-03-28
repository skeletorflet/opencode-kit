# Antigravity Kit for Opencode

A comprehensive AI agent capability expansion toolkit designed to enhance your development workflow with specialized agents, skills, and workflows.

## Overview

Antigravity Kit is a modular system consisting of:
- **20 Specialist Agents** - Role-based AI personas for different development domains
- **36 Skills** - Domain-specific knowledge modules that agents can load on-demand
- **11 Workflows** - Slash command procedures for common development tasks
- **Rules & Scripts** - Validation and configuration files

This kit has been adapted from the original Antigravity Kit to work seamlessly with Opencode.

## Directory Structure

```
.opencode/
├── ARCHITECTURE.md          # This documentation file
├── agents/                  # 20 Specialist Agents
├── skills/                  # 36 Skills
├── workflows/               # 11 Slash Commands
├── rules/                   # Global Rules
├── scripts/                 # Master Validation Scripts
├── mcp_config.json          # MCP Server Configuration
└── package.json             # Dependencies
```

## Specialist Agents (20)

Each agent is a specialized AI persona designed for specific development domains:

| Agent | Focus | Key Skills |
|-------|-------|------------|
| `orchestrator` | Multi-agent coordination | parallel-agents, behavioral-modes |
| `project-planner` | Discovery, task planning | brainstorming, plan-writing, architecture |
| `frontend-specialist` | Web UI/UX | frontend-design, react-best-practices, tailwind-patterns |
| `backend-specialist` | API, business logic | api-patterns, nodejs-best-practices, database-design |
| `database-architect` | Schema, SQL | database-design, prisma-expert |
| `mobile-developer` | iOS, Android, RN | mobile-design |
| `game-developer` | Game logic, mechanics | game-development |
| `devops-engineer` | CI/CD, Docker | deployment-procedures, docker-expert |
| `security-auditor` | Security compliance | vulnerability-scanner, red-team-tactics |
| `penetration-tester` | Offensive security | red-team-tactics |
| `test-engineer` | Testing strategies | testing-patterns, tdd-workflow, webapp-testing |
| `debugger` | Root cause analysis | systematic-debugging |
| `performance-optimizer` | Speed, Web Vitals | performance-profiling |
| `seo-specialist` | Ranking, visibility | seo-fundamentals, geo-fundamentals |
| `documentation-writer` | Manuals, docs | documentation-templates |
| `product-manager` | Requirements, user stories | plan-writing, brainstorming |
| `product-owner` | Strategy, backlog, MVP | plan-writing, brainstorming |
| `qa-automation-engineer` | E2E testing, CI pipelines | webapp-testing, testing-patterns |
| `code-archaeologist` | Legacy code, refactoring | clean-code, code-review-checklist |
| `explorer-agent` | Codebase analysis | - |

## Skills (36)

Modular knowledge domains that agents can load on-demand based on task context:

### Frontend & UI
- `react-best-practices` - React & Next.js performance optimization
- `web-design-guidelines` - Web UI audit for accessibility, UX, performance
- `tailwind-patterns` - Tailwind CSS v4 utilities
- `frontend-design` - UI/UX patterns, design systems
- `ui-ux-pro-max` - 50 styles, 21 palettes, 50 fonts

### Backend & API
- `api-patterns` - REST, GraphQL, tRPC
- `nestjs-expert` - NestJS modules, DI, decorators
- `nodejs-best-practices` - Node.js async, modules
- `python-patterns` - Python standards, FastAPI

### Database
- `database-design` - Schema design, optimization
- `prisma-expert` - Prisma ORM, migrations

### TypeScript/JavaScript
- `typescript-expert` - Type-level programming, performance

### Cloud & Infrastructure
- `docker-expert` - Containerization, Compose
- `deployment-procedures` - CI/CD, deploy workflows
- `server-management` - Infrastructure management

### Testing & Quality
- `testing-patterns` - Jest, Vitest, strategies
- `webapp-testing` - E2E, Playwright
- `tdd-workflow` - Test-driven development
- `code-review-checklist` - Code review standards
- `lint-and-validate` - Linting, validation

### Security
- `vulnerability-scanner` - Security auditing, OWASP
- `red-team-tactics` - Offensive security

### Architecture & Planning
- `app-builder` - Full-stack app scaffolding
- `architecture` - System design patterns
- `plan-writing` - Task planning, breakdown
- `brainstorming` - Socratic questioning

### Mobile
- `mobile-design` - Mobile UI/UX patterns

### Game Development
- `game-development` - Game logic, mechanics

### SEO & Growth
- `seo-fundamentals` - SEO, E-E-A-T, Core Web Vitals
- `geo-fundamentals` - GenAI optimization

### Shell/CLI
- `bash-linux` - Linux commands, scripting
- `powershell-windows` - Windows PowerShell

### Other
- `clean-code` - Coding standards (Global)
- `behavioral-modes` - Agent personas
- `parallel-agents` - Multi-agent patterns
- `mcp-builder` - Model Context Protocol
- `documentation-templates` - Doc formats
- `i18n-localization` - Internationalization
- `performance-profiling` - Web Vitals, optimization
- `systematic-debugging` - Troubleshooting

## Workflows (11)

Slash command procedures that can be invoked with `/command`:

| Command | Description |
|---------|-------------|
| `/brainstorm` | Socratic discovery |
| `/create` | Create new features |
| `/debug` | Debug issues |
| `/deploy` | Deploy application |
| `/enhance` | Improve existing code |
| `/orchestrate` | Multi-agent coordination |
| `/plan` | Task breakdown |
| `/preview` | Preview changes |
| `/status` | Check project status |
| `/test` | Run tests |
| `/ui-ux-pro-max` | Design with 50 styles |

## Getting Started

### Prerequisites

- Opencode installed on your system
- Node.js (for running validation scripts)
- Python 3.x (for running validation scripts)

### Installation

1. Clone this repository to your local machine
2. Ensure the `.opencode` directory is in your project root
3. Install dependencies:
   ```bash
   npm install
   ```

### Using Agents

To invoke a specific agent for a task:

```bash
opencode run --agent frontend-specialist "Create a responsive navbar component"
```

Or specify the agent in your prompt:

```bash
opencode run "I need help designing a database schema for an e-commerce application" --agent database-architect
```

### Using Workflows

Invoke workflows with slash commands:

```bash
opencode run "/plan Create a user authentication system"
```

```bash
opencode run "/debug Fix the login error on the staging environment"
```

```bash
opencode run "/test Run all unit tests and generate coverage report"
```

## Skill Loading Protocol

Agents automatically load relevant skills based on task context:

```
User Request → Skill Description Match → Load SKILL.md
                                              ↓
                                      Read references/
                                              ↓
                                      Read scripts/
```

## Validation Scripts

The kit includes master validation scripts for code quality assurance:

### Quick Validation (Development)
```bash
python .opencode/scripts/checklist.py .
```

### Comprehensive Validation (Pre-deployment)
```bash
python .opencode/scripts/verify_all.py . --url http://localhost:3000
```

## Configuration

### MCP Servers

The kit includes pre-configured MCP (Model Context Protocol) servers in `.opencode/mcp_config.json`:

- Context7 - For up-to-date documentation
- Shadcn - For UI component generation
- Netlify - For deployment capabilities

To use these servers, you'll need to provide your API keys in the configuration file.

## Best Practices

1. **Always clarify requirements first** - Agents are designed to ask clarifying questions before proceeding with implementation
2. **Use the right agent for the task** - Match the agent specialty to your specific need
3. **Leverage workflows for repeatable tasks** - Slash commands streamline common development procedures
4. **Run validation regularly** - Use the checklist script during development and verify_all before deployment
5. **Combine agents for complex tasks** - Use the orchestrator agent for multi-faceted problems requiring different expertise

## Customization

You can extend the kit by:
- Adding new agent definitions to `.opencode/agents/`
- Creating new skill directories in `.opencode/skills/`
- Adding custom workflows to `.opencode/workflows/`
- Modifying validation scripts in `.opencode/scripts/`

## License

This kit is adapted from the Antigravity Kit and is available for use with Opencode.

## Support

For issues or questions, please refer to the documentation in each agent's markdown file or consult the ARCHITECTURE.md for detailed information about each component.