import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "List environment variable names (NOT values) present in .env files",
  args: {},
  async execute(args, context) {
    const result = await Bun.$`grep -h '^[A-Z]' ${context.worktree}/.env* 2>/dev/null | cut -d= -f1 | sort -u`.text()
    return `Environment variables defined (names only):\n${result || "No .env files found"}`
  },
})
