/**
 * load-env.js — OpenCode Kit · Unified Env Plugin
 *
 * Reads .env at PLUGIN INIT TIME and injects into BOTH:
 *   1. process.env — so other plugins (Daytona, etc.) see the vars immediately
 *   2. shell.env hook — so every AI tool shell also has the vars
 *
 * This is the correct pattern for plugins that must be visible to
 * other plugins during the OpenCode startup sequence.
 *
 * Absorbs: inject-env.ts (PROJECT_ROOT, OPENCODE_KIT_ACTIVE markers)
 */

import { readFileSync, existsSync } from "fs"
import { join } from "path"

export default async function LoadEnvPlugin({ directory }) {
  const envPath = join(directory, ".env")
  const envVars = {}

  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, "utf-8").split(/\r?\n/)

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue

      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue

      const key   = trimmed.slice(0, eqIdx).trim()
      let   value = trimmed.slice(eqIdx + 1).trim()
      value = value.replace(/^["']|["']$/g, "")

      if (key && value) {
        envVars[key] = value
      }
    }
  }

  // ── CRITICAL: set in process.env NOW, at plugin init time ──────────────
  // This ensures Daytona and other plugins can read the vars during THEIR
  // own initialization (before any shell.env hook has fired).
  for (const [key, value] of Object.entries(envVars)) {
    if (!process.env[key]) {   // don't override values already set by the OS
      process.env[key] = value
    }
  }

  return {
    /**
     * shell.env — also inject into every shell OpenCode opens.
     * Belt-and-suspenders: covers tool shells + user terminal.
     */
    "shell.env": async (input, output) => {
      for (const [key, value] of Object.entries(envVars)) {
        output.env[key] = value
      }
      // Kit runtime markers
      output.env.PROJECT_ROOT         = input.cwd
      output.env.OPENCODE_KIT_ACTIVE  = "true"
      output.env.OPENCODE_KIT_VERSION = "1.0"
    },
  }
}
