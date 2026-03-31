# Formatters

Configure code formatters that OpenCode uses to format code after making changes.

---

## Default Formatters

OpenCode includes built-in formatters like Prettier.

### Disabling Default Formatters

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "disabled": true
    }
  }
}
```

---

## Custom Formatters

Define your own formatters:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "custom-prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    },
    "go-fmt": {
      "command": ["gofmt", "-w", "$FILE"],
      "extensions": [".go"]
    },
    "black": {
      "command": ["black", "$FILE"],
      "extensions": [".py"]
    }
  }
}
```

### Formatter Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `command` | Array | ✅ Yes | Command and arguments to run |
| `extensions` | Array | ✅ Yes | File extensions this formatter handles |
| `environment` | Object | | Environment variables for the command |
| `disabled` | Boolean | | Disable this formatter |

### Variable Substitution

| Variable | Description |
|----------|-------------|
| `$FILE` | Path to the file being formatted |

---

## Multiple Formatters

You can configure multiple formatters for different file types:

```json
{
  "formatter": {
    "prettier-web": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "extensions": [".js", ".ts", ".jsx", ".tsx", ".css", ".html"]
    },
    "rustfmt": {
      "command": ["rustfmt", "$FILE"],
      "extensions": [".rs"]
    },
    "clang-format": {
      "command": ["clang-format", "-i", "$FILE"],
      "extensions": [".c", ".cpp", ".h", ".hpp"]
    }
  }
}
```

---

## Environment Variables

Pass environment variables to formatters:

```json
{
  "formatter": {
    "prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development",
        "PRETTIER_CONFIG": "./.prettierrc"
      },
      "extensions": [".js", ".ts"]
    }
  }
}
```

---

## Disabling All Formatting

```json
{
  "formatter": {
    "prettier": { "disabled": true }
  }
}
```
