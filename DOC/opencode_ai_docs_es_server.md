# Servidor

Interactuar con el servidor opencode a través de HTTP.

El comando `opencode serve` ejecuta un servidor HTTP sin cabeza que expone un punto final OpenAPI que un cliente opencode puede usar.

---

### [Uso](#uso)

Ventana de terminal

```
opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]
```

#### [Opciones](#opciones)

| Bandera | Descripción | Predeterminado |
| --- | --- | --- |
| `--port` | Puerto para escuchar | `4096` |
| `--hostname` | Nombre de host para escuchar | `127.0.0.1` |
| `--mdns` | Habilitar el descubrimiento de mDNS | `false` |
| `--mdns-domain` | Nombre de dominio personalizado para el servicio mDNS | `opencode.local` |
| `--cors` | Orígenes de navegador adicionales para permitir | `[]` |

`--cors` se puede pasar varias veces:

Ventana de terminal

```
opencode serve --cors http://localhost:5173 --cors https://app.example.com
```

---

### [Autenticación](#autenticación)

Configure `OPENCODE_SERVER_PASSWORD` para proteger el servidor con autenticación básica HTTP. El nombre de usuario predeterminado es `opencode`, o configure `OPENCODE_SERVER_USERNAME` para anularlo. Esto se aplica tanto a `opencode serve` como a `opencode web`.

Ventana de terminal

```
OPENCODE_SERVER_PASSWORD=your-password opencode serve
```

---

### [Cómo funciona](#cómo-funciona)

Cuando ejecuta `opencode`, inicia un TUI y un servidor. Donde el TUI es el
Cliente que habla con el servidor. El servidor expone una especificación OpenAPI 3.1
punto final. Este punto final también se utiliza para generar un [SDK](/docs/sdk).

Esta arquitectura permite que opencode admita múltiples clientes y le permite interactuar con opencode mediante programación.

Puede ejecutar `opencode serve` para iniciar un servidor independiente. Si tienes el
opencode TUI ejecutándose, `opencode serve` iniciará un nuevo servidor.

---

#### [Conectarse a un servidor existente](#conectarse-a-un-servidor-existente)

Cuando inicia el TUI, asigna aleatoriamente un puerto y un nombre de host. En su lugar, puede pasar `--hostname` y `--port` [banderas](/docs/cli). Luego use esto para conectarse a su servidor.

El punto final [`/tui`](#tui) se puede utilizar para conducir el TUI a través del servidor. Por ejemplo, puede completar previamente o ejecutar un mensaje. Esta configuración es utilizada por los complementos OpenCode [IDE](/docs/ide).

---

## [Especificaciones](#especificaciones)

El servidor publica una especificación OpenAPI 3.1 que se puede ver en:

```
http://<hostname>:<port>/doc
```

Por ejemplo, `http://localhost:4096/doc`. Utilice la especificación para generar clientes o inspeccionar tipos de solicitudes y respuestas. O verlo en un explorador Swagger.

---

## [API](#api)

El servidor opencode expone las siguientes API.

---

### [Global](#global)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/global/health` | Obtener el estado y la versión del servidor | `{ healthy: true, version: string }` |
| `GET` | `/global/event` | Obtenga eventos globales (transmisión SSE) | Flujo de eventos |

---

### [Proyecto](#proyecto)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/project` | Listar todos los proyectos | [`Project[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/project/current` | Obtener el proyecto actual | [`Project`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |

---

### [Ruta y VCS](#ruta-y-vcs)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/path` | Obtener la ruta actual | [`Path`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/vcs` | Obtenga información de VCS para el proyecto actual | [`VcsInfo`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |

---

### [Instancia](#instancia)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `POST` | `/instance/dispose` | Eliminar la instancia actual | `boolean` |

---

### [Configuración](#configuración)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/config` | Obtener información de configuración | [`Config`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `PATCH` | `/config` | Actualizar configuración | [`Config`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/config/providers` | Lista de proveedores y modelos predeterminados | `{ providers:` [Proveedor[]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, default: { [key: string]: string } }` |

---

### [Proveedor](#proveedor)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/provider` | Listar todos los proveedores | `{ all:` [Proveedor[]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, default: {...}, connected: string[] }` |
| `GET` | `/provider/auth` | Obtener métodos de autenticación de proveedores | `{ [providerID: string]:` [ProviderAuthMethod[]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) `}` |
| `POST` | `/provider/{id}/oauth/authorize` | Autorizar a un proveedor usando OAuth | [`ProviderAuthAuthorization`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `POST` | `/provider/{id}/oauth/callback` | Manejar la devolución de llamada OAuth para un proveedor | `boolean` |

---

### [Sesiones](#sesiones)

| Método | Ruta | Descripción | Notas |
| --- | --- | --- | --- |
| `GET` | `/session` | Listar todas las sesiones | Devuelve [`Session[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `POST` | `/session` | Crear una nueva sesión | cuerpo: `{ parentID?, title? }`, devuelve [`Session`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/session/status` | Obtener el estado de la sesión para todas las sesiones | Devuelve `{ [sessionID: string]:` [SessionStatus](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) `}` |
| `GET` | `/session/:id` | Obtener detalles de la sesión | Devuelve [`Session`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `DELETE` | `/session/:id` | Eliminar una sesión y todos sus datos | Devuelve `boolean` |
| `PATCH` | `/session/:id` | Actualizar propiedades de sesión | cuerpo: `{ title? }`, devuelve [`Session`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/session/:id/children` | Obtener las sesiones secundarias de una sesión | Devuelve [`Session[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/session/:id/todo` | Obtener la lista de tareas pendientes para una sesión | Devuelve [`Todo[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `POST` | `/session/:id/init` | Analizar aplicación y crear `AGENTS.md` | cuerpo: `{ messageID, providerID, modelID }`, devuelve `boolean` |
| `POST` | `/session/:id/fork` | Bifurca una sesión existente en un mensaje | cuerpo: `{ messageID? }`, devuelve [`Session`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `POST` | `/session/:id/abort` | Cancelar una sesión en ejecución | Devuelve `boolean` |
| `POST` | `/session/:id/share` | Compartir una sesión | Devuelve [`Session`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `DELETE` | `/session/:id/share` | Dejar de compartir una sesión | Devuelve [`Session`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/session/:id/diff` | Obtenga la diferencia para esta sesión | consulta: `messageID?`, devuelve [`FileDiff[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `POST` | `/session/:id/summarize` | Resumir la sesión | cuerpo: `{ providerID, modelID }`, devuelve `boolean` |
| `POST` | `/session/:id/revert` | Revertir un mensaje | cuerpo: `{ messageID, partID? }`, devuelve `boolean` |
| `POST` | `/session/:id/unrevert` | Restaurar todos los mensajes revertidos | Devuelve `boolean` |
| `POST` | `/session/:id/permissions/:permissionID` | Responder a una solicitud de permiso | cuerpo: `{ response, remember? }`, devuelve `boolean` |

---

### [Mensajes](#mensajes)

| Método | Ruta | Descripción | Notas |
| --- | --- | --- | --- |
| `GET` | `/session/:id/message` | Listar mensajes en una sesión | consulta: `limit?`, devuelve `{ info:` [Mensaje](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, parts:` [Parte[]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`}[]` |
| `POST` | `/session/:id/message` | Envía un mensaje y espera respuesta | cuerpo: `{ messageID?, model?, agent?, noReply?, system?, tools?, parts }`, devuelve `{ info:` [Mensaje](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, parts:` [Parte[]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`}` |
| `GET` | `/session/:id/message/:messageID` | Obtener detalles del mensaje | Devuelve `{ info:` [Mensaje](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, parts:` [Parte[]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`}` |
| `POST` | `/session/:id/prompt_async` | Enviar un mensaje de forma asincrónica (sin espera) | cuerpo: igual que `/session/:id/message`, devuelve `204 No Content` |
| `POST` | `/session/:id/command` | Ejecutar un comando de barra diagonal | cuerpo: `{ messageID?, agent?, model?, command, arguments }`, devuelve `{ info:` [Mensaje](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, parts:` [Parte[]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`}` |
| `POST` | `/session/:id/shell` | Ejecute un comando de shell | cuerpo: `{ agent, model?, command }`, devuelve `{ info:` [Mensaje](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, parts:` [Parte[]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`}` |

---

### [Comandos](#comandos)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/command` | Listar todos los comandos | [`Command[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |

---

### [Archivos](#archivos)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/find?pattern=<pat>` | Buscar texto en archivos | Matriz de objetos coincidentes con `path`, `lines`, `line_number`, `absolute_offset`, `submatches` |
| `GET` | `/find/file?query=<q>` | Buscar archivos y directorios por nombre | `string[]` (caminos) |
| `GET` | `/find/symbol?query=<q>` | Buscar símbolos del espacio de trabajo | [`Symbol[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/file?path=<path>` | Listar archivos y directorios | [`FileNode[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/file/content?path=<p>` | Leer un archivo | [`FileContent`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/file/status` | Obtener el estado de los archivos rastreados | [`File[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |

#### [Parámetros de consulta de /find/file](#parámetros-de-consulta-de-findfile)

* `query` (obligatorio) — cadena de búsqueda (coincidencia aproximada)
* `type` (opcional): limita los resultados a `"file"` o `"directory"`
* `directory` (opcional): anula la raíz del proyecto para la búsqueda.
* `limit` (opcional) — resultados máximos (1–200)
* `dirs` (opcional): indicador heredado (`"false"` devuelve solo archivos)

---

### [Herramientas (experimentales)](#herramientas-experimentales)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/experimental/tool/ids` | Listar todos los ID de herramientas | [`ToolIDs`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/experimental/tool?provider=<p>&model=<m>` | Listar herramientas con esquemas JSON para un modelo | [`ToolList`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |

---

### [LSP, formateadores y MCP](#lsp-formateadores-y-mcp)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/lsp` | Obtener el estado del servidor LSP | [`LSPStatus[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/formatter` | Obtener estado del formateador | [`FormatterStatus[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |
| `GET` | `/mcp` | Obtener el estado del servidor MCP | `{ [name: string]:` [MCPStatus](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) `}` |
| `POST` | `/mcp` | Agregue el servidor MCP dinámicamente | cuerpo: `{ name, config }`, devuelve MCP objeto de estado |

---

### [Agentes](#agentes)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/agent` | Listar todos los agentes disponibles | [`Agent[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) |

---

### [Registro](#registro)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `POST` | `/log` | Escribir entrada de registro. Cuerpo: `{ service, level, message, extra? }` | `boolean` |

---

### [TUI](#tui)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `POST` | `/tui/append-prompt` | Agregar texto al mensaje | `boolean` |
| `POST` | `/tui/open-help` | Abra el cuadro de diálogo de ayuda | `boolean` |
| `POST` | `/tui/open-sessions` | Abrir el selector de sesiones | `boolean` |
| `POST` | `/tui/open-themes` | Abra el selector de temas | `boolean` |
| `POST` | `/tui/open-models` | Abrir el selector de modelo | `boolean` |
| `POST` | `/tui/submit-prompt` | Enviar el mensaje actual | `boolean` |
| `POST` | `/tui/clear-prompt` | Borrar el mensaje | `boolean` |
| `POST` | `/tui/execute-command` | Ejecutar un comando (`{ command }`) | `boolean` |
| `POST` | `/tui/show-toast` | Mostrar brindis (`{ title?, message, variant }`) | `boolean` |
| `GET` | `/tui/control/next` | Espere la próxima solicitud de control | Objeto de solicitud de control |
| `POST` | `/tui/control/response` | Responder a una solicitud de control (`{ body }`) | `boolean` |

---

### [Autenticación](#autenticación-1)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `PUT` | `/auth/:id` | Establecer credenciales de autenticación. El cuerpo debe coincidir con el esquema del proveedor | `boolean` |

---

### [Eventos](#eventos)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/event` | Transmisión de eventos enviados por el servidor. El primer evento es `server.connected`, luego eventos de bus | Transmisión de eventos enviados por el servidor |

---

### [Documentación](#documentación)

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/doc` | Especificación OpenAPI 3.1 | Página HTML con especificación OpenAPI |