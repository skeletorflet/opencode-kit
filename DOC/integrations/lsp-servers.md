# LSP Servers

**Language Server Protocol (LSP)** integration provides code intelligence features like go-to-definition, find references, and hover information.

---

## Overview

LSP servers give the AI agent deep code understanding:
- Go to definition
- Find all references
- Hover information
- Document symbols
- Workspace symbols
- Call hierarchy (incoming/outgoing)

> **Status:** Experimental. Enable with `OPENCODE_EXPERIMENTAL_LSP_TOOL=true` or `OPENCODE_EXPERIMENTAL=true`.

---

## Enabling LSP

### Environment Variable
```bash
OPENCODE_EXPERIMENTAL_LSP_TOOL=true opencode
```

### Config
```json
{
  "experimental": {
    "lsp_tool": true
  }
}
```

---

## Supported Operations

| Operation | Description |
|-----------|-------------|
| `goToDefinition` | Navigate to symbol definition |
| `findReferences` | Find all references to a symbol |
| `hover` | Get hover information (type, docs) |
| `documentSymbol` | List symbols in current file |
| `workspaceSymbol` | Search symbols across workspace |
| `goToImplementation` | Navigate to implementation |
| `prepareCallHierarchy` | Prepare call hierarchy |
| `incomingCalls` | Find callers of a function |
| `outgoingCalls` | Find callees of a function |

---

## Configuring LSP Servers

LSP servers are configured per project. OpenCode can auto-download LSP servers for common languages.

### Disable Auto-Download
```bash
OPENCODE_DISABLE_LSP_DOWNLOAD=true opencode
```

---

## LSP Tool

The LSP tool is available to agents when enabled. Control access via permissions:

```json
{
  "permission": {
    "lsp": "allow"
  }
}
```

Or per-agent:
```json
{
  "agent": {
    "build": {
      "permission": {
        "lsp": "allow"
      }
    }
  }
}
```

---

## LSP Events (for Plugins)

Plugins can subscribe to LSP events:

| Event | Description |
|-------|-------------|
| `lsp.updated` | LSP server state changed |
| `lsp.client.diagnostics` | Diagnostics received from LSP |

```javascript
export const LspPlugin = async () => {
  return {
    "lsp.client.diagnostics": async ({ event }) => {
      // Handle diagnostics
    },
  };
};
```

---

## Language Support

OpenCode supports any language with an LSP server. Common languages:

| Language | LSP Server |
|----------|-----------|
| TypeScript/JavaScript | TypeScript Language Server |
| Python | Pyright, Pylance |
| Go | gopls |
| Rust | rust-analyzer |
| Java | Eclipse JDT LS |
| C/C++ | clangd |
| Ruby | Solargraph |
| PHP | PHP Language Server |

---

## Troubleshooting

- Ensure the LSP server is installed and in PATH
- Check that the file type is recognized by the LSP
- Look for LSP errors in the logs (`--print-logs`)
- Try restarting the LSP server
