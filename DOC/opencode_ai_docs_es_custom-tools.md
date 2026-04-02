# Herramientas personalizadas

Cree herramientas que LLM pueda llamar en opencode.

Las herramientas personalizadas son funciones que usted crea y que el LLM puede llamar durante las conversaciones. Trabajan junto con las [herramientas integradas](/docs/tools) de opencode como `read`, `write` y `bash`.

---

## [Crear una herramienta](#crear-una-herramienta)

Las herramientas se definen como archivos **TypeScript** o **JavaScript**. Sin embargo, la definición de la herramienta puede invocar secuencias de comandos escritas en **cualquier idioma**: TypeScript o JavaScript solo se utilizan para la definición de la herramienta en sí.

---

### [Ubicación](#ubicación)

Se pueden definir:

* Localmente colocándolos en el directorio `.opencode/tools/` de tu proyecto.
* O de forma global, colocándolos en `~/.config/opencode/tools/`.

---

### [Estructura](#estructura)

La forma más sencilla de crear herramientas es utilizar el asistente `tool()` que proporciona seguridad de tipos y validación.

.opencode/tools/database.ts

```
import { tool } from "@opencode-ai/plugin"

export default tool({

description: "Query the project database",

args: {

query: tool.schema.string().describe("SQL query to execute"),

},

async execute(args) {

// Your database logic here

return `Executed query: ${args.query}`

},

})
```

El **nombre de archivo** se convierte en el **nombre de la herramienta**. Lo anterior crea una herramienta `database`.

---

#### [Múltiples herramientas por archivo](#múltiples-herramientas-por-archivo)

También puede exportar varias herramientas desde un solo archivo. Cada exportación se convierte en **una herramienta independiente** con el nombre **`<filename>_<exportname>`**:

.opencode/tools/math.ts

```
import { tool } from "@opencode-ai/plugin"

export const add = tool({

description: "Add two numbers",

args: {

a: tool.schema.number().describe("First number"),

b: tool.schema.number().describe("Second number"),

},

async execute(args) {

return args.a + args.b

},

})

export const multiply = tool({

description: "Multiply two numbers",

args: {

a: tool.schema.number().describe("First number"),

b: tool.schema.number().describe("Second number"),

},

async execute(args) {

return args.a * args.b

},

})
```

Esto crea dos herramientas: `math_add` y `math_multiply`.

---

#### [Colisiones de nombres con herramientas integradas](#colisiones-de-nombres-con-herramientas-integradas)

Las herramientas personalizadas están codificadas por el nombre de la herramienta. Si una herramienta personalizada utiliza el mismo nombre que una herramienta integrada, la herramienta personalizada tiene prioridad.

Por ejemplo, este archivo reemplaza la herramienta `bash` integrada:

.opencode/tools/bash.ts

```
import { tool } from "@opencode-ai/plugin"

export default tool({

description: "Restricted bash wrapper",

args: {

command: tool.schema.string(),

},

async execute(args) {

return `blocked: ${args.command}`

},

})
```

---

### [Argumentos](#argumentos)

Puedes usar `tool.schema`, que es simplemente [Zod](https://zod.dev), para definir tipos de argumentos.

```
args: {

query: tool.schema.string().describe("SQL query to execute")

}
```

También puedes importar [Zod](https://zod.dev) directamente y devolver un objeto simple:

```
import { z } from "zod"

export default {

description: "Tool description",

args: {

param: z.string().describe("Parameter description"),

},

async execute(args, context) {

// Tool implementation

return "result"

},

}
```

---

### [Contexto](#contexto)

Las herramientas reciben contexto sobre la sesión actual:

.opencode/tools/project.ts

```
import { tool } from "@opencode-ai/plugin"

export default tool({

description: "Get project information",

args: {},

async execute(args, context) {

// Access context information

const { agent, sessionID, messageID, directory, worktree } = context

return `Agent: ${agent}, Session: ${sessionID}, Message: ${messageID}, Directory: ${directory}, Worktree: ${worktree}`

},

})
```

Utilice `context.directory` para el directorio de trabajo de la sesión.
Utilice `context.worktree` para la raíz del árbol de trabajo de git.

---

## [Ejemplos](#ejemplos)

### [Escribir una herramienta en Python](#escribir-una-herramienta-en-python)

Puede escribir sus herramientas en cualquier idioma que desee. Aquí hay un ejemplo que suma dos números usando Python.

Primero, cree la herramienta como un script de Python:

.opencode/tools/add.py

```
import sys

a = int(sys.argv[1])

b = int(sys.argv[2])

print(a + b)
```

Luego cree la definición de herramienta que la invoca:

.opencode/tools/python-add.ts

```
import { tool } from "@opencode-ai/plugin"

import path from "path"

export default tool({

description: "Add two numbers using Python",

args: {

a: tool.schema.number().describe("First number"),

b: tool.schema.number().describe("Second number"),

},

async execute(args, context) {

const script = path.join(context.worktree, ".opencode/tools/add.py")

const result = await Bun.$`python3 ${script} ${args.a} ${args.b}`.text()

return result.trim()

},

})
```

Aquí estamos usando la utilidad [`Bun.$`](https://bun.com/docs/runtime/shell) para ejecutar el script Python.