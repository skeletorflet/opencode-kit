# Share & Collaboration

Share your OpenCode conversations with your team.

---

## Sharing a Conversation

```
/share
```

This creates a shareable link and copies it to your clipboard.

> **Note:** Conversations are NOT shared by default. You must explicitly run `/share`.

---

## Unsharing

```
/unshare
```

Removes the conversation from public access.

---

## Share Configuration

```json
{
  "share": "manual"
}
```

| Value | Behavior |
|-------|----------|
| `"manual"` | Share via `/share` command (default) |
| `"auto"` | Automatically share new conversations |
| `"disabled"` | Disable sharing entirely |

---

## Auto-Share via Environment

```bash
OPENCODE_AUTO_SHARE=true opencode
```

---

## CLI Sharing

```bash
opencode run --share "Implement feature X"
```

---

## Importing Shared Conversations

```bash
opencode import https://opncd.ai/s/abc123
```

Import a shared conversation into your local sessions.

---

## Exporting Conversations

```
/export
```

Exports the current conversation as Markdown and opens it in your editor.

Or via CLI:
```bash
opencode export [sessionID]
```

---

## Privacy

- Conversations are private by default
- Only shared when you explicitly run `/share`
- Unsharing removes public access
- For maximum privacy, set `"share": "disabled"` in config

---

## Use Cases

| Scenario | How |
|----------|-----|
| **Code review** | Share a conversation showing the reasoning |
| **Knowledge transfer** | Share how you solved a problem |
| **Team collaboration** | Share context with teammates |
| **Documentation** | Export conversations as Markdown |
| **Debugging help** | Share the debugging process |
