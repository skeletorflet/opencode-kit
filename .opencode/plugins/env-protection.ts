import type { Plugin } from "@opencode-ai/plugin";

export const EnvProtection: Plugin = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read" && output.args.filePath.includes(".env")) {
        throw new Error("Security Exception: Do not read .env files directly!");
      }
    },
  }
};
