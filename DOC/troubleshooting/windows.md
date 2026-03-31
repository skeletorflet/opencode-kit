# Windows & WSL

Guide for running OpenCode on Windows.

---

## Recommended: WSL (Windows Subsystem for Linux)

For the best experience, use **WSL2**:

### Install WSL
```powershell
wsl --install
```

This installs Ubuntu by default. Restart your computer when prompted.

### Install OpenCode in WSL
```bash
# Inside WSL terminal
curl -fsSL https://opencode.ai/install | bash
```

### Access Windows Files
```bash
cd /mnt/c/Users/YourName/projects/my-project
opencode
```

---

## Native Windows Installation

### Chocolatey
```powershell
choco install opencode
```

### Scoop
```powershell
scoop install opencode
```

### npm
```powershell
npm install -g opencode-ai
```

### Git Bash Path
If you encounter issues with bash commands, set the Git Bash path:

```json
{
  "git_bash_path": "C:\\Program Files\\Git\\bin\\bash.exe"
}
```

Or via environment variable:
```powershell
$env:OPENCODE_GIT_BASH_PATH = "C:\Program Files\Git\bin\bash.exe"
```

---

## Terminal Recommendations

| Terminal | Notes |
|----------|-------|
| **Windows Terminal** | Best overall experience |
| **WezTerm** | Cross-platform, good TUI support |
| **Alacritty** | Fast, minimal |

Avoid using the legacy `cmd.exe` or basic PowerShell console — they may not render the TUI correctly.

---

## Common Issues

### TUI Rendering Issues
- Use Windows Terminal or WezTerm
- Ensure your terminal supports Unicode and true color
- Set `TERM=xterm-256color` if needed

### Bash Commands Not Working
- Install Git for Windows
- Set `OPENCODE_GIT_BASH_PATH` environment variable
- Or use WSL for full Linux compatibility

### Performance
- WSL2 provides better performance than native Windows
- Keep projects on the WSL filesystem (`\\wsl$\`), not on `/mnt/c/`
- Use a fast terminal emulator

### Bun Support
Bun installation on Windows is currently in progress. Use npm or WSL as alternatives.

---

## Environment Variables (PowerShell)

```powershell
$env:OPENCODE_AUTO_SHARE = "true"
$env:OPENCODE_DISABLE_AUTOUPDATE = "true"
$env:OPENCODE_ENABLE_EXA = "1"
$env:OPENCODE_SERVER_PASSWORD = "mysecret"
```

To make permanent, add to your PowerShell profile:
```powershell
notepad $PROFILE
```
