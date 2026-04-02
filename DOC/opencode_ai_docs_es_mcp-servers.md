# MCP servidores

Agregue herramientas MCP locales y remotas.

Puede agregar herramientas externas a OpenCode utilizando el *Model Context Protocol* o MCP. OpenCode admite servidores locales y remotos.

Una vez agregadas, las herramientas MCP están disponibles automáticamente para LLM junto con las herramientas integradas.

---

#### [Advertencias](#advertencias)

Cuando utiliza un servidor MCP, se suma al contexto. Esto puede acumularse rápidamente si tiene muchas herramientas. Por lo que recomendamos tener cuidado con qué servidores MCP utiliza.

Ciertos servidores MCP, como el servidor GitHub MCP, tienden a agregar muchos tokens y pueden exceder fácilmente el límite de contexto.

---

## [Habilitar](#habilitar)

Puede definir servidores MCP en su [OpenCode Config](https://opencode.ai/docs/config/) en `mcp`. Agregue cada MCP con un nombre único. Puede referirse a ese MCP por su nombre cuando solicite el LLM.

opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"name-of-mcp-server": {

// ...

"enabled": true,

},

"name-of-other-mcp-server": {

// ...

},

},

}
```

También puede desactivar un servidor configurando `enabled` en `false`. Esto es útil si desea desactivar temporalmente un servidor sin eliminarlo de su configuración.

---

### [Anulación de los valores predeterminados remotos](#anulación-de-los-valores-predeterminados-remotos)

Las organizaciones pueden proporcionar servidores MCP predeterminados a través de su punto final `.well-known/opencode`. Estos servidores pueden estar deshabilitados de forma predeterminada, lo que permite a los usuarios optar por los que necesitan.

Para habilitar un servidor específico desde la configuración remota de su organización, agréguelo a su configuración local con `enabled: true`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"jira": {

"type": "remote",

"url": "https://jira.example.com/mcp",

"enabled": true

}

}

}
```

Los valores de configuración local anulan los valores predeterminados remotos. Consulte [precedencia de configuración](/docs/config#precedence-order) para obtener más detalles.

---

## [Locales](#locales)

Agregue servidores MCP locales usando `type` a `"local"` dentro del objeto MCP.

opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-local-mcp-server": {

"type": "local",

// Or ["bun", "x", "my-mcp-command"]

"command": ["npx", "-y", "my-mcp-command"],

"enabled": true,

"environment": {

"MY_ENV_VAR": "my_env_var_value",

},

},

},

}
```

El comando es cómo se inicia el servidor MCP local. También puede pasar una lista de variables de entorno.

Por ejemplo, así es como puede agregar el servidor de prueba [`@modelcontextprotocol/server-everything`](https://www.npmjs.com/package/@modelcontextprotocol/server-everything) MCP.

opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"mcp_everything": {

"type": "local",

"command": ["npx", "-y", "@modelcontextprotocol/server-everything"],

},

},

}
```

Y para usarlo puedo agregar `use the mcp_everything tool` a mis indicaciones.

```
use the mcp_everything tool to add the number 3 and 4
```

---

#### [Opciones](#opciones)

Aquí están todas las opciones para configurar un servidor MCP local.

| Opción | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `type` | Cadena | Y | El tipo de conexión del servidor MCP debe ser `"local"`. |
| `command` | Matriz | Y | Comando y argumentos para ejecutar el servidor MCP. |
| `environment` | Objeto |  | Variables de entorno para configurar al ejecutar el servidor. |
| `enabled` | booleano |  | Habilite o deshabilite el servidor MCP al inicio. |
| `timeout` | Número |  | Tiempo de espera en ms para recuperar herramientas del servidor MCP. El valor predeterminado es 5000 (5 segundos). |

---

## [Remoto](#remoto)

Agregue servidores MCP remotos configurando `type` en `"remote"`.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-remote-mcp": {

"type": "remote",

"url": "https://my-mcp-server.com",

"enabled": true,

"headers": {

"Authorization": "Bearer MY_API_KEY"

}

}

}

}
```

`url` es la URL del servidor MCP remoto y con la opción `headers` puede pasar una lista de encabezados.

---

#### [Opciones](#opciones-1)

| Opción | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `type` | Cadena | Y | El tipo de conexión del servidor MCP debe ser `"remote"`. |
| `url` | Cadena | Y | URL del servidor MCP remoto. |
| `enabled` | booleano |  | Habilite o deshabilite el servidor MCP al inicio. |
| `headers` | Objeto |  | Encabezados para enviar con la solicitud. |
| `oauth` | Objeto |  | OAuth configuración de autenticación. Consulte la sección [OAuth](#oauth) a continuación. |
| `timeout` | Número |  | Tiempo de espera en ms para recuperar herramientas del servidor MCP. El valor predeterminado es 5000 (5 segundos). |

---

## [OAuth](#oauth)

OpenCode maneja automáticamente la autenticación OAuth para servidores MCP remotos. Cuando un servidor requiere autenticación, OpenCode:

1. Detectar la respuesta 401 e iniciar el flujo OAuth
2. Utilice **Registro dinámico de cliente (RFC 7591)** si el servidor lo admite.
3. Almacene tokens de forma segura para futuras solicitudes

---

### [Automático](#automático)

Para la mayoría de los servidores MCP habilitados para OAuth, no se necesita ninguna configuración especial. Simplemente configure el servidor remoto:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-oauth-server": {

"type": "remote",

"url": "https://mcp.example.com/mcp"

}

}

}
```

Si el servidor requiere autenticación, OpenCode le pedirá que se autentique cuando intente usarlo por primera vez. De lo contrario, puede [activar manualmente el flujo](#authenticating) con `opencode mcp auth <server-name>`.

---

### [Preinscrito](#preinscrito)

Si tiene credenciales de cliente del proveedor del servidor MCP, puede configurarlas:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-oauth-server": {

"type": "remote",

"url": "https://mcp.example.com/mcp",

"oauth": {

"clientId": "{env:MY_MCP_CLIENT_ID}",

"clientSecret": "{env:MY_MCP_CLIENT_SECRET}",

"scope": "tools:read tools:execute"

}

}

}

}
```

---

### [Autenticación](#autenticación)

Puede activar manualmente la autenticación o administrar las credenciales.

Autenticar con un servidor MCP específico:

Ventana de terminal

```
opencode mcp auth my-oauth-server
```

Enumere todos los servidores MCP y su estado de autenticación:

Ventana de terminal

```
opencode mcp list
```

Eliminar las credenciales almacenadas:

Ventana de terminal

```
opencode mcp logout my-oauth-server
```

El comando `mcp auth` abrirá su navegador para obtener autorización. Después de su autorización, OpenCode almacenará los tokens de forma segura en `~/.local/share/opencode/mcp-auth.json`.

---

#### [Deshabilitando OAuth](#deshabilitando-oauth)

Si desea deshabilitar el OAuth automático para un servidor (por ejemplo, para servidores que usan claves API), configure `oauth` en `false`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-api-key-server": {

"type": "remote",

"url": "https://mcp.example.com/mcp",

"oauth": false,

"headers": {

"Authorization": "Bearer {env:MY_API_KEY}"

}

}

}

}
```

---

#### [Opciones de OAuth](#opciones-de-oauth)

| Opción | Tipo | Descripción |
| --- | --- | --- |
| `oauth` | Objeto | falso | OAuth objeto de configuración, o `false` para deshabilitar la detección automática de OAuth. |
| `clientId` | Cadena | OAuth ID de cliente. Si no se proporciona, se intentará el registro dinámico del cliente. |
| `clientSecret` | Cadena | OAuth secreto del cliente, si lo requiere el servidor de autorización. |
| `scope` | Cadena | OAuth alcances para solicitar durante la autorización. |

#### [Depuración](#depuración)

Si un servidor MCP remoto no puede autenticarse, puede diagnosticar problemas con:

Ventana de terminal

```
# View auth status for all OAuth-capable servers

opencode mcp auth list

# Debug connection and OAuth flow for a specific server

opencode mcp debug my-oauth-server
```

El comando `mcp debug` muestra el estado de autenticación actual, prueba la conectividad HTTP e intenta el flujo de descubrimiento OAuth.

---

## [Administrar](#administrar)

Sus MCP están disponibles como herramientas en OpenCode, junto con herramientas integradas. Para que puedas administrarlos a través de la configuración OpenCode como cualquier otra herramienta.

---

### [Global](#global)

Esto significa que puede habilitarlos o deshabilitarlos globalmente.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-mcp-foo": {

"type": "local",

"command": ["bun", "x", "my-mcp-command-foo"]

},

"my-mcp-bar": {

"type": "local",

"command": ["bun", "x", "my-mcp-command-bar"]

}

},

"tools": {

"my-mcp-foo": false

}

}
```

También podemos usar un patrón global para deshabilitar todos los MCP coincidentes.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-mcp-foo": {

"type": "local",

"command": ["bun", "x", "my-mcp-command-foo"]

},

"my-mcp-bar": {

"type": "local",

"command": ["bun", "x", "my-mcp-command-bar"]

}

},

"tools": {

"my-mcp*": false

}

}
```

Aquí estamos usando el patrón global `my-mcp*` para deshabilitar todos los MCP.

---

### [Por agente](#por-agente)

Si tiene una gran cantidad de servidores MCP, es posible que desee habilitarlos solo por agente y deshabilitarlos globalmente. Para hacer esto:

1. Desactívelo como herramienta a nivel global.
2. En su [configuración del agente](/docs/agents#tools), habilite el servidor MCP como herramienta.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-mcp": {

"type": "local",

"command": ["bun", "x", "my-mcp-command"],

"enabled": true

}

},

"tools": {

"my-mcp*": false

},

"agent": {

"my-agent": {

"tools": {

"my-mcp*": true

}

}

}

}
```

---

#### [Patrones globales](#patrones-globales)

El patrón global utiliza patrones globales simples de expresiones regulares:

* `*` coincide con cero o más de cualquier carácter (por ejemplo, `"my-mcp*"` coincide con `my-mcp_search`, `my-mcp_list`, etc.)
* `?` coincide exactamente con un carácter
* Todos los demás caracteres coinciden literalmente

---

## [Ejemplos](#ejemplos)

A continuación se muestran ejemplos de algunos servidores MCP comunes. Puede enviar un PR si desea documentar otros servidores.

---

### [sentry](#sentry)

Agregue el [servidor Sentry MCP](https://mcp.sentry.dev) para interactuar con sus proyectos y problemas Sentry.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"sentry": {

"type": "remote",

"url": "https://mcp.sentry.dev/mcp",

"oauth": {}

}

}

}
```

Después de agregar la configuración, autentíquese con Sentry:

Ventana de terminal

```
opencode mcp auth sentry
```

Esto abrirá una ventana del navegador para completar el flujo OAuth y conectar OpenCode a su cuenta Sentry.

Una vez autenticado, puede utilizar las herramientas Sentry en sus indicaciones para consultar problemas, proyectos y datos de errores.

```
Show me the latest unresolved issues in my project. use sentry
```

---

### [Context7](#context7)

Agregue el [servidor Context7 MCP](https://github.com/upstash/context7) para buscar en los documentos.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"context7": {

"type": "remote",

"url": "https://mcp.context7.com/mcp"

}

}

}
```

Si se ha registrado para obtener una cuenta gratuita, puede usar su clave API y obtener límites de tarifas más altos.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"context7": {

"type": "remote",

"url": "https://mcp.context7.com/mcp",

"headers": {

"CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"

}

}

}

}
```

Aquí asumimos que tiene configurada la variable de entorno `CONTEXT7_API_KEY`.

Agregue `use context7` a sus indicaciones para usar el servidor Context7 MCP.

```
Configure a Cloudflare Worker script to cache JSON API responses for five minutes. use context7
```

Alternativamente, puede agregar algo como esto a su [AGENTS.md](/docs/rules/).

AGENTS.md

```
When you need to search docs, use `context7` tools.
```

---

### [Grep by Vercel](#grep-by-vercel)

Agregue el servidor [Grep by Vercel](https://grep.app) MCP para buscar fragmentos de código en GitHub.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"gh_grep": {

"type": "remote",

"url": "https://mcp.grep.app"

}

}

}
```

Dado que llamamos a nuestro servidor MCP `gh_grep`, puede agregar `use the gh_grep tool` a sus indicaciones para que el agente lo use.

```
What's the right way to set a custom domain in an SST Astro component? use the gh_grep tool
```

Alternativamente, puede agregar algo como esto a su [AGENTS.md](/docs/rules/).

AGENTS.md

```
If you are unsure how to do something, use `gh_grep` to search code examples from GitHub.
```