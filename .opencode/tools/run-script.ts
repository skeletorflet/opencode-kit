import { tool } from "@opencode-ai/plugin"
import path from "path"

export default tool({
  description: "Run a package.json script and return output",
  args: {
    script: tool.schema.string().describe("npm script name, e.g. 'test', 'build', 'lint'"),
  },
  async execute(args, context) {
    const result = await Bun.$`npm run ${args.script}`
      .cwd(context.worktree)
      .text()
    return result
  },
})
