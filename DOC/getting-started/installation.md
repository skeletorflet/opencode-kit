# Installation

OpenCode can be installed on **macOS, Linux, and Windows** using multiple methods.

## Recommended: Install Script

The easiest way to install OpenCode:

```bash
curl -fsSL https://opencode.ai/install | bash
```

This script detects your platform and installs OpenCode using the best available method.

---

## Node.js Package Managers

### npm
```bash
npm install -g opencode-ai
```

### Bun
```bash
bun install -g opencode-ai
```

### pnpm
```bash
pnpm install -g opencode-ai
```

### Yarn
```bash
yarn global add opencode-ai
```

---

## Homebrew (macOS & Linux)

```bash
brew install anomalyco/tap/opencode
```

> **Note:** We recommend using the OpenCode tap (`anomalyco/tap/opencode`) for the most up-to-date releases. The official `brew install opencode` formula is maintained by the Homebrew team and may lag behind.

---

## Arch Linux

### Stable
```bash
sudo pacman -S opencode
```

### Latest (AUR)
```bash
paru -S opencode-bin
```

---

## Windows

### Chocolatey
```bash
choco install opencode
```

### Scoop
```bash
scoop install opencode
```

### npm
```bash
npm install -g opencode-ai
```

### Mise
```bash
mise use -g github:anomalyco/opencode
```

> **Note:** For the best experience on Windows, we recommend using **Windows Subsystem for Linux (WSL)**. See the [Windows & WSL guide](../troubleshooting/windows.md) for details.

---

## Docker

```bash
docker run -it --rm ghcr.io/anomalyco/opencode
```

Mount your project directory:
```bash
docker run -it --rm \
  -v /path/to/project:/project \
  ghcr.io/anomalyco/opencode /project
```

---

## Binary Downloads

Download pre-built binaries from the [GitHub Releases](https://github.com/anomalyco/opencode/releases) page.

Available for:
- Linux (amd64, arm64)
- macOS (amd64, arm64)
- Windows (amd64)

---

## Prerequisites

To use OpenCode in your terminal, you'll need:

### 1. A Modern Terminal Emulator

| Terminal | Platform |
|----------|----------|
| [WezTerm](https://wezterm.org) | Cross-platform |
| [Alacritty](https://alacritty.org) | Cross-platform |
| [Ghostty](https://ghostty.org) | Linux & macOS |
| [Kitty](https://sw.kovidgoyal.net/kitty/) | Linux & macOS |

### 2. API Keys

You'll need API keys for the LLM providers you want to use. Alternatively, you can:
- Use your **ChatGPT Plus/Pro** subscription
- Use your **GitHub Copilot** subscription
- Use **OpenCode Zen** (curated models by the OpenCode team)
- Run **local models** with Ollama (no API key needed)

---

## Verify Installation

```bash
opencode --version
```

This should print the current version number.

---

## Updating

```bash
# Using built-in updater
opencode upgrade

# Or to a specific version
opencode upgrade v1.3.3

# Using npm
npm install -g opencode-ai@latest

# Using Homebrew
brew upgrade anomalyco/tap/opencode
```

---

## Uninstalling

```bash
# Using built-in uninstaller
opencode uninstall

# Keep config files
opencode uninstall --keep-config

# Keep session data
opencode uninstall --keep-data

# Preview what would be removed
opencode uninstall --dry-run

# Skip confirmation
opencode uninstall --force
```
