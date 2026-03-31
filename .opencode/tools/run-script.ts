import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Run a package.json script and return output",
  args: {
    script: tool.schema
      .string()
      .describe("npm script name, e.g. 'test', 'build', 'lint'")
      .regex(/^[a-zA-Z0-9:_-]+$/),
  },
  async execute(args, context) {
    try {
      const result = await Bun.$`npm run ${args.script}`
        .cwd(context.worktree)
        .text()
      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      const stderr =
        error instanceof Bun.$.ShellError
          ? error.stderr.toString().trim()
          : undefined
      return `Script "${args.script}" failed:\n${stderr || message}`
    }
  },
})
