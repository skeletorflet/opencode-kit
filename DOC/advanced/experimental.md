# Experimental Features

Unstable features that may change or be removed.

---

## Enabling Experimental Features

### Enable All
```bash
OPENCODE_EXPERIMENTAL=true opencode
```

### Enable Individually
```bash
OPENCODE_EXPERIMENTAL_LSP_TOOL=true opencode
```

Or in config:
```json
{
  "experimental": {}
}
```

---

## Available Experimental Features

### LSP Tool
```bash
OPENCODE_EXPERIMENTAL_LSP_TOOL=true
```
Adds LSP operations (go-to-definition, find references, hover info) as a tool the AI can use.

### TY LSP for Python
```bash
OPENCODE_EXPERIMENTAL_LSP_TY=true
```
Enables the TY language server specifically for Python files.

### File Watcher
```bash
OPENCODE_EXPERIMENTAL_FILEWATCHER=true
```
Enables file watcher for entire directory (not just tracked files).

### Disable File Watcher
```bash
OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER=true
```
Completely disables the file watcher.

### Exa Web Search
```bash
OPENCODE_EXPERIMENTAL_EXA=true
```
Enables experimental Exa web search features.

### Icon Discovery
```bash
OPENCODE_EXPERIMENTAL_ICON_DISCOVERY=true
```
Enables icon discovery in the UI.

### Disable Copy on Select
```bash
OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT=true
```
Disables automatic copy when selecting text in TUI.

### Bash Timeout
```bash
OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS=30000
```
Sets default timeout for bash commands in milliseconds.

### Output Token Limit
```bash
OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX=4096
```
Limits maximum output tokens for LLM responses.

### oxfmt Formatter
```bash
OPENCODE_EXPERIMENTAL_OXFMT=true
```
Enables the oxfmt code formatter.

### Markdown Features
```bash
OPENCODE_EXPERIMENTAL_MARKDOWN=true
```
Enables experimental markdown rendering features.

### Plan Mode
```bash
OPENCODE_EXPERIMENTAL_PLAN_MODE=true
```
Enables the plan mode feature (may be built-in in newer versions).

---

## Stability Warning

> ⚠️ Experimental features are **not stable**. They may:
> - Change behavior without notice
> - Be removed in future versions
> - Have bugs or performance issues
> - Not be fully tested

Use experimental features at your own risk. Do not rely on them in production environments.

---

## Reporting Issues

If you encounter issues with experimental features:
1. Check if it's a known issue on [GitHub](https://github.com/anomalyco/opencode/issues)
2. Include the experimental flag in your bug report
3. Specify your OpenCode version
