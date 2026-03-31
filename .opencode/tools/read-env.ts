import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "List environment variable names (NOT values) present in .env files",
  args: {},
  async execute(args, context) {
    try {
      const result = await Bun.$`grep -h '^[A-Z]' ${context.worktree}/.env* 2>/dev/null | cut -d= -f1 | sort -u`.text()
      return `Environment variables defined (names only):\n${result.trim() || "No .env files found"}`
    } catch {
      return "No .env files found or unable to read them"
    }
  },
})
