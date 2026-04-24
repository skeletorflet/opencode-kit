import type { Plugin } from "@opencode-ai/plugin";

/**
 * env-protection.ts — OpenCode Kit security guard
 *
 * Intercepts `read` tool calls targeting .env files.
 * Instead of throwing (which could break legitimate flows), it logs
 * a structured warning. Allows .env.example reads (safe template files).
 *
 * Hook: tool.execute.before
 */
export const EnvProtection: Plugin = async ({ client }) => {
  return {
    "tool.execute.before": async (input, output) => {
      const filePath: string = output?.args?.filePath ?? ""

      const isSensitive =
        filePath.includes(".env") &&
        !filePath.includes(".env.example") &&
        !filePath.includes(".env.template")

      if (input.tool === "read" && isSensitive) {
        // Log a structured warning instead of throwing
        await client.app.log({
          body: {
            service: "env-protection",
            level: "warn",
            message: `[Security] Agent attempted direct read of: ${filePath}. Env vars are pre-injected via shell.env hook.`,
          },
        }).catch(() => {})

        // Optionally block — comment out the throw to allow reads if needed
        throw new Error(
          `[OpenCode Kit] Direct .env reads are blocked. ` +
          `All secrets are pre-injected into the shell environment. ` +
          `Use process.env.VAR_NAME instead.`
        )
      }
    },
  }
};
