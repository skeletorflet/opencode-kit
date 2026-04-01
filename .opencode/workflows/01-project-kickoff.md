---
description: Automated loop to initialize a new project from ideation to initial structural commit.
---

# Project Kickoff Workflow

This workflow uses AI agents to smoothly transition from an idea to a fully planned and scaffolded application directory.

1. Tell the `project-planner` to create a new task plan using the `/plan` command. E.g. `/plan e-commerce dashboard with Stripe`.
2. Review the generated `{task-slug}.md` file. Provide feedback or approve the architecture choice.
3. Once approved, tell the `app-builder` to scaffold the actual application by invoking `/create e-commerce dashboard based on {task-slug}.md`.
4. Run `git init` locally to initialize version control.
// turbo
5. Write an initial commit message using `git add .` and `git commit -m "Initial commit: Scaffolded project from {task-slug}.md"`.
