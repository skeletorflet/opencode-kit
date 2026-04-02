import type { Plugin } from "@opencode-ai/plugin";

export const InjectEnvPlugin: Plugin = async () => {
  return {
    "shell.env": async (input, output) => {
      output.env.PROJECT_ROOT = input.cwd;
      output.env.OPENCODE_KIT_ACTIVE = "true";
    },
  }
};
