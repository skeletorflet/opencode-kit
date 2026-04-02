# Intro

Get started with OpenCode.

[**OpenCode**](/) is an open source AI coding agent. It’s available as a terminal-based interface, desktop app, or IDE extension.

![OpenCode TUI with the opencode theme](/docs/_astro/screenshot.CQjBbRyJ_1dLadc.webp)

Let’s get started.

---

#### [Prerequisites](#prerequisites)

To use OpenCode in your terminal, you’ll need:

1. A modern terminal emulator like:

   * [WezTerm](https://wezterm.org), cross-platform
   * [Alacritty](https://alacritty.org), cross-platform
   * [Ghostty](https://ghostty.org), Linux and macOS
   * [Kitty](https://sw.kovidgoyal.net/kitty/), Linux and macOS
2. API keys for the LLM providers you want to use.

---

## [Install](#install)

The easiest way to install OpenCode is through the install script.

Terminal window

```
curl -fsSL https://opencode.ai/install | bash
```

You can also install it with the following commands:

* **Using Node.js**

  + [npm](#tab-panel-0)
  + [Bun](#tab-panel-1)
  + [pnpm](#tab-panel-2)
  + [Yarn](#tab-panel-3)

  Terminal window

  ```
  npm install -g opencode-ai
  ```

  Terminal window

  ```
  bun install -g opencode-ai
  ```

  Terminal window

  ```
  pnpm install -g opencode-ai
  ```

  Terminal window

  ```
  yarn global add opencode-ai
  ```
* **Using Homebrew on macOS and Linux**

  Terminal window

  ```
  brew install anomalyco/tap/opencode
  ```

  > We recommend using the OpenCode tap for the most up to date releases. The official `brew install opencode` formula is maintained by the Homebrew team and is updated less frequently.
* **Installing on Arch Linux**

  Terminal window

  ```
  sudo pacman -S opencode           # Arch Linux (Stable)

  paru -S opencode-bin              # Arch Linux (Latest from AUR)
  ```

#### [Windows](#windows)

* **Using Chocolatey**

  Terminal window

  ```
  choco install opencode
  ```
* **Using Scoop**

  Terminal window

  ```
  scoop install opencode
  ```
* **Using NPM**

  Terminal window

  ```
  npm install -g opencode-ai
  ```
* **Using Mise**

  Terminal window

  ```
  mise use -g github:anomalyco/opencode
  ```
* **Using Docker**

  Terminal window

  ```
  docker run -it --rm ghcr.io/anomalyco/opencode
  ```

Support for installing OpenCode on Windows using Bun is currently in progress.

You can also grab the binary from the [Releases](https://github.com/anomalyco/opencode/releases).

---

## [Configure](#configure)

With OpenCode you can use any LLM provider by configuring their API keys.

If you are new to using LLM providers, we recommend using [OpenCode Zen](/docs/zen).
It’s a curated list of models that have been tested and verified by the OpenCode
team.

1. Run the `/connect` command in the TUI, select opencode, and head to [opencode.ai/auth](https://opencode.ai/auth).

   ```
   /connect
   ```
2. Sign in, add your billing details, and copy your API key.
3. Paste your API key.

   ```
   ┌ API key

   │

   │

   └ enter
   ```

Alternatively, you can select one of the other providers. [Learn more](/docs/providers#directory).

---

## [Initialize](#initialize)

Now that you’ve configured a provider, you can navigate to a project that
you want to work on.

Terminal window

```
cd /path/to/project
```

And run OpenCode.

Terminal window

```
opencode
```

Next, initialize OpenCode for the project by running the following command.

```
/init
```

This will get OpenCode to analyze your project and create an `AGENTS.md` file in
the project root.

This helps OpenCode understand the project structure and the coding patterns
used.

---

## [Usage](#usage)

You are now ready to use OpenCode to work on your project. Feel free to ask it
anything!

If you are new to using an AI coding agent, here are some examples that might
help.

---

### [Ask questions](#ask-questions)

You can ask OpenCode to explain the codebase to you.

```
How is authentication handled in @packages/functions/src/api/index.ts
```

This is helpful if there’s a part of the codebase that you didn’t work on.

---

### [Add features](#add-features)

You can ask OpenCode to add new features to your project. Though we first recommend asking it to create a plan.

1. **Create a plan**

   OpenCode has a *Plan mode* that disables its ability to make changes and
   instead suggest *how* it’ll implement the feature.

   Switch to it using the **Tab** key. You’ll see an indicator for this in the lower right corner.

   ```
   <TAB>
   ```

   Now let’s describe what we want it to do.

   ```
   When a user deletes a note, we'd like to flag it as deleted in the database.

   Then create a screen that shows all the recently deleted notes.

   From this screen, the user can undelete a note or permanently delete it.
   ```

   You want to give OpenCode enough details to understand what you want. It helps
   to talk to it like you are talking to a junior developer on your team.
2. **Iterate on the plan**

   Once it gives you a plan, you can give it feedback or add more details.

   ```
   We'd like to design this new screen using a design I've used before.

   [Image #1] Take a look at this image and use it as a reference.
   ```

   OpenCode can scan any images you give it and add them to the prompt. You can
   do this by dragging and dropping an image into the terminal.
3. **Build the feature**

   Once you feel comfortable with the plan, switch back to *Build mode* by
   hitting the **Tab** key again.

   ```
   <TAB>
   ```

   And asking it to make the changes.

   ```
   Sounds good! Go ahead and make the changes.
   ```

---

### [Make changes](#make-changes)

For more straightforward changes, you can ask OpenCode to directly build it
without having to review the plan first.

```
We need to add authentication to the /settings route. Take a look at how this is

handled in the /notes route in @packages/functions/src/notes.ts and implement

the same logic in @packages/functions/src/settings.ts
```

You want to make sure you provide a good amount of detail so OpenCode makes the right
changes.

---

### [Undo changes](#undo-changes)

Let’s say you ask OpenCode to make some changes.

```
Can you refactor the function in @packages/functions/src/api/index.ts?
```

But you realize that it is not what you wanted. You **can undo** the changes
using the `/undo` command.

```
/undo
```

OpenCode will now revert the changes you made and show your original message
again.

```
Can you refactor the function in @packages/functions/src/api/index.ts?
```

From here you can tweak the prompt and ask OpenCode to try again.

Or you **can redo** the changes using the `/redo` command.

```
/redo
```

---

## [Share](#share)

The conversations that you have with OpenCode can be [shared with your
team](/docs/share).

```
/share
```

This will create a link to the current conversation and copy it to your clipboard.

Here’s an [example conversation](https://opencode.ai/s/4XP1fce5) with OpenCode.

---

## [Customize](#customize)

And that’s it! You are now a pro at using OpenCode.

To make it your own, we recommend [picking a theme](/docs/themes), [customizing the keybinds](/docs/keybinds), [configuring code formatters](/docs/formatters), [creating custom commands](/docs/commands), or playing around with the [OpenCode config](/docs/config).