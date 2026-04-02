# Soporte ACP

Utilice OpenCode en cualquier editor compatible con ACP.

OpenCode admite el [Agent Client Protocol](https://agentclientprotocol.com) o (ACP), lo que le permite usarlo directamente en editores e IDE compatibles.

ACP es un protocolo abierto que estandariza la comunicación entre editores de código y agentes de codificación de IA.

---

## [Configuración](#configuración)

Para usar OpenCode a través de ACP, configure su editor para ejecutar el comando `opencode acp`.

El comando inicia OpenCode como un subproceso compatible con ACP que se comunica con su editor a través de JSON-RPC a través de stdio.

A continuación se muestran ejemplos de editores populares que admiten ACP.

---

### [Zed](#zed)

Agregue a su configuración [Zed](https://zed.dev) (`~/.config/zed/settings.json`):

~/.config/zed/settings.json

```
{

"agent_servers": {

"OpenCode": {

"command": "opencode",

"args": ["acp"]

}

}

}
```

Para abrirlo, use la acción `agent: new thread` en la **Paleta de comandos**.

También puedes vincular un atajo de teclado editando tu `keymap.json`:

keymap.json

```
[

{

"bindings": {

"cmd-alt-o": [

"agent::NewExternalAgentThread",

{

"agent": {

"custom": {

"name": "OpenCode",

"command": {

"command": "opencode",

"args": ["acp"]

}

}

}

}

]

}

}

]
```

---

### [JetBrains IDEs](#jetbrains-ides)

Agregue a su [JetBrains IDE](https://www.jetbrains.com/) acp.json de acuerdo con la [documentación](https://www.jetbrains.com/help/ai-assistant/acp.html):

acp.json

```
{

"agent_servers": {

"OpenCode": {

"command": "/absolute/path/bin/opencode",

"args": ["acp"]

}

}

}
```

Para abrirlo, use el nuevo agente ‘OpenCode’ en el selector de agentes de AI Chat.

---

### [Avante.nvim](#avantenvim)

Agregue a su configuración [Avante.nvim](https://github.com/yetone/avante.nvim):

```
{

acp_providers = {

["opencode"] = {

command = "opencode",

args = { "acp" }

}

}

}
```

Si necesita pasar variables de entorno:

```
{

acp_providers = {

["opencode"] = {

command = "opencode",

args = { "acp" },

env = {

OPENCODE_API_KEY = os.getenv("OPENCODE_API_KEY")

}

}

}

}
```

---

### [CodeCompanion.nvim](#codecompanionnvim)

Para usar OpenCode como agente ACP en [CodeCompanion.nvim](https://github.com/olimorris/codecompanion.nvim), agregue lo siguiente a su configuración de Neovim:

```
require("codecompanion").setup({

interactions = {

chat = {

adapter = {

name = "opencode",

model = "",

},

},

},

})
```

Esta configuración configura CodeCompanion para usar OpenCode como agente ACP para el chat.

Si necesita pasar variables de entorno (como `OPENCODE_API_KEY`), consulte [Configuración de adaptadores: variables de entorno](https://codecompanion.olimorris.dev/getting-started#setting-an-api-key) en la documentación de CodeCompanion.nvim para obtener detalles completos.

## [Soporte](#soporte)

OpenCode funciona igual a través de ACP que en la terminal. Todas las funciones son compatibles:

* Herramientas integradas (operaciones de archivos, comandos de terminal, etc.)
* Herramientas personalizadas y comandos de barra
* Servidores MCP configurados en su configuración OpenCode
* Reglas específicas del proyecto de `AGENTS.md`
* Formateadores y linters personalizados
* Sistema de agentes y permisos.