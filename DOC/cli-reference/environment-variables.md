# Environment Variables

Complete reference for all OpenCode environment variables.

---

## Core Variables

| Variable | Type | Description |
|----------|------|-------------|
| `OPENCODE_AUTO_SHARE` | boolean | Automatically share sessions |
| `OPENCODE_CONFIG` | string | Path to config file |
| `OPENCODE_CONFIG_DIR` | string | Path to config directory |
| `OPENCODE_CONFIG_CONTENT` | string | Inline JSON config content |
| `OPENCODE_TUI_CONFIG` | string | Path to TUI config file |
| `OPENCODE_SERVER_PASSWORD` | string | Enable basic auth for serve/web |
| `OPENCODE_SERVER_USERNAME` | string | Override auth username (default: `opencode`) |
| `OPENCODE_CLIENT` | string | Client identifier (default: `cli`) |
| `OPENCODE_MODELS_URL` | string | Custom URL for fetching models |
| `OPENCODE_GIT_BASH_PATH` | string | Path to Git Bash on Windows |
| `OPENCODE_PERMISSION` | string | Inline JSON permissions config |

---

## Feature Toggles

| Variable | Description |
|----------|-------------|
| `OPENCODE_DISABLE_AUTOUPDATE` | Disable automatic update checks |
| `OPENCODE_DISABLE_PRUNE` | Disable pruning of old data |
| `OPENCODE_DISABLE_TERMINAL_TITLE` | Disable automatic terminal title updates |
| `OPENCODE_DISABLE_DEFAULT_PLUGINS` | Disable default plugins |
| `OPENCODE_DISABLE_LSP_DOWNLOAD` | Disable automatic LSP server downloads |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS` | Enable experimental models |
| `OPENCODE_DISABLE_AUTOCOMPACT` | Disable automatic context compaction |
| `OPENCODE_DISABLE_MODELS_FETCH` | Disable fetching models from remote sources |
| `OPENCODE_ENABLE_EXA` | Enable Exa web search tools |

---

## Claude Code Compatibility

| Variable | Description |
|----------|-------------|
| `OPENCODE_DISABLE_CLAUDE_CODE` | Disable reading from `.claude` (prompt + skills) |
| `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT` | Disable reading `~/.claude/CLAUDE.md` |
| `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` | Disable loading `.claude/skills` |

---

## Testing

| Variable | Description |
|----------|-------------|
| `OPENCODE_FAKE_VCS` | Fake VCS provider for testing |
| `OPENCODE_DISABLE_FILETIME_CHECK` | Disable file time checking for optimization |

---

## Provider-Specific Variables

| Variable | Description |
|----------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key (Bedrock) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key (Bedrock) |
| `AWS_PROFILE` | AWS named profile (Bedrock) |
| `AWS_REGION` | AWS region (Bedrock) |
| `AWS_BEARER_TOKEN_BEDROCK` | Bedrock bearer token |
| `AZURE_RESOURCE_NAME` | Azure OpenAI resource name |
| `AZURE_COGNITIVE_SERVICES_RESOURCE_NAME` | Azure Cognitive Services resource name |
| `GOOGLE_CLOUD_PROJECT` | GCP project ID (Vertex AI) |
| `VERTEX_LOCATION` | Vertex AI region (default: `global`) |
| `GOOGLE_APPLICATION_CREDENTIALS` | GCP service account key path |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token |
| `CLOUDFLARE_API_KEY` | Cloudflare Workers AI key |
| `CLOUDFLARE_GATEWAY_ID` | Cloudflare AI Gateway ID |
| `GITLAB_TOKEN` | GitLab personal access token |
| `GITLAB_INSTANCE_URL` | Self-hosted GitLab URL |
| `GITLAB_AI_GATEWAY_URL` | Custom AI Gateway URL |
| `GITLAB_OAUTH_CLIENT_ID` | GitLab OAuth application ID |
| `AICORE_SERVICE_KEY` | SAP AI Core service key JSON |
| `AICORE_DEPLOYMENT_ID` | SAP AI Core deployment ID |
| `AICORE_RESOURCE_GROUP` | SAP AI Core resource group |

---

## Experimental Variables

| Variable | Description |
|----------|-------------|
| `OPENCODE_EXPERIMENTAL` | Enable all experimental features |
| `OPENCODE_EXPERIMENTAL_ICON_DISCOVERY` | Enable icon discovery |
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT` | Disable copy on select in TUI |
| `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS` | Default timeout for bash commands (ms) |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX` | Max output tokens for LLM responses |
| `OPENCODE_EXPERIMENTAL_FILEWATCHER` | Enable file watcher for entire directory |
| `OPENCODE_EXPERIMENTAL_OXFMT` | Enable oxfmt formatter |
| `OPENCODE_EXPERIMENTAL_LSP_TOOL` | Enable experimental LSP tool |
| `OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER` | Disable file watcher |
| `OPENCODE_EXPERIMENTAL_EXA` | Enable experimental Exa features |
| `OPENCODE_EXPERIMENTAL_LSP_TY` | Enable TY LSP for Python files |
| `OPENCODE_EXPERIMENTAL_MARKDOWN` | Enable experimental markdown features |
| `OPENCODE_EXPERIMENTAL_PLAN_MODE` | Enable plan mode |

---

## Usage Examples

### Quick Setup
```bash
OPENCODE_AUTO_SHARE=true opencode
```

### Custom Config
```bash
OPENCODE_CONFIG=/home/user/.opencode-config.json opencode
```

### Experimental Mode
```bash
OPENCODE_EXPERIMENTAL=true opencode
```

### Disable Auto-Updates
```bash
OPENCODE_DISABLE_AUTOUPDATE=true opencode
```

### Enable Web Search
```bash
OPENCODE_ENABLE_EXA=1 opencode
```

### Server with Auth
```bash
OPENCODE_SERVER_PASSWORD=mysecret opencode serve
```

### Multiple Variables
```bash
OPENCODE_AUTO_SHARE=true \
OPENCODE_DISABLE_AUTOUPDATE=true \
OPENCODE_ENABLE_EXA=1 \
opencode
```
