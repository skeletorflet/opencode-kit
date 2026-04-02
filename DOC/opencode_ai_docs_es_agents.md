# Agentes

Configurar y utilizar agentes especializados.

Los agentes son asistentes de IA especializados que se pueden configurar para tareas y flujos de trabajo específicos. Le permiten crear herramientas enfocadas con indicaciones, modelos y acceso a herramientas personalizados.

Puede cambiar entre agentes durante una sesión o invocarlos con la mención `@`.

---

## [Tipos](#tipos)

Hay dos tipos de agentes en OpenCode; agentes primarios y subagentes.

---

### [Agentes primarios](#agentes-primarios)

Los agentes primarios son los asistentes principales con los que interactúas directamente. Puede recorrerlos usando la tecla **Tab** o la combinación de teclas `switch_agent` configurada. Estos agentes manejan su conversación principal. El acceso a las herramientas se configura mediante permisos; por ejemplo, Build tiene todas las herramientas habilitadas mientras que Plan está restringido.

OpenCode viene con dos agentes principales integrados, **Build** y **Plan**. Bien
mira estos a continuación.

---

### [Subagentes](#subagentes)

Los subagentes son asistentes especializados que los agentes principales pueden invocar para tareas específicas. También puedes invocarlos manualmente **@ mencionándolos** en tus mensajes.

OpenCode viene con dos subagentes integrados, **General** y **Explore**. Veremos esto a continuación.

---

## [Integrados](#integrados)

OpenCode viene con dos agentes primarios integrados y dos subagentes integrados.

---

### [Build](#build)

*Modo*: `primary`

Build es el agente principal **predeterminado** con todas las herramientas habilitadas. Este es el agente estándar para trabajos de desarrollo en los que necesita acceso completo a las operaciones de archivos y comandos del sistema.

---

### [Plan](#plan)

*Modo*: `primary`

Un agente restringido diseñado para la planificación y el análisis. Utilizamos un sistema de permisos para brindarle más control y evitar cambios no deseados.
De forma predeterminada, todo lo siguiente está configurado en `ask`:

* `file edits`: todas las escrituras, parches y ediciones.
* `bash`: Todos los comandos bash

Este agente es útil cuando desea que LLM analice código, sugiera cambios o cree planes sin realizar modificaciones reales a su base de código.

---

### [General](#general)

*Modo*: `subagent`

Un agente de uso general para investigar preguntas complejas y ejecutar tareas de varios pasos. Tiene acceso completo a las herramientas (excepto tareas pendientes), por lo que puede realizar cambios en los archivos cuando sea necesario. Utilícelo para ejecutar varias unidades de trabajo en paralelo.

---

### [Explore](#explore)

*Modo*: `subagent`

Un agente rápido y de solo lectura para explorar bases de código. No se pueden modificar archivos. Úselo cuando necesite buscar rápidamente archivos por patrones, buscar palabras clave en el código o responder preguntas sobre el código base.

---

### [Compactación](#compactación)

*Modo*: `primary`

Agente de sistema oculto que compacta un contexto largo en un resumen más pequeño. Se ejecuta automáticamente cuando es necesario y no se puede seleccionar en la interfaz de usuario.

---

### [Título](#título)

*Modo*: `primary`

Agente del sistema oculto que genera títulos de sesión cortos. Se ejecuta automáticamente y no se puede seleccionar en la interfaz de usuario.

---

### [Resumen](#resumen)

*Modo*: `primary`

Agente del sistema oculto que crea resúmenes de sesiones. Se ejecuta automáticamente y no se puede seleccionar en la interfaz de usuario.

---

## [Uso](#uso)

1. Para los agentes principales, use la tecla **Tab** para recorrerlos durante una sesión. También puede utilizar su combinación de teclas `switch_agent` configurada.
2. Se pueden invocar subagentes:

   * **Automáticamente** por agentes principales para tareas especializadas según sus descripciones.
   * Manualmente **@ mencionando** un subagente en tu mensaje. Por ejemplo.

     ```
     @general help me search for this function
     ```
3. **Navegación entre sesiones**: cuando los subagentes crean sus propias sesiones secundarias, puede navegar entre la sesión principal y todas las sesiones secundarias usando:

   * **<Leader>+Right** (or su combinación de teclas `session_child_cycle` configurada) para avanzar a través de padre → hijo1 → hijo2 → … → padre
   * **<Leader>+Left** (or su combinación de teclas `session_child_cycle_reverse` configurada) para retroceder entre padre ← hijo1 ← hijo2 ← … ← padre

   Esto le permite cambiar sin problemas entre la conversación principal y el trabajo de subagente especializado.

---

## [Configuración](#configuración)

Puede personalizar los agentes integrados o crear los suyos propios mediante la configuración. Los agentes se pueden configurar de dos maneras:

---

### [JSON](#json)

Configure agentes en su archivo de configuración `opencode.json`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"agent": {

"build": {

"mode": "primary",

"model": "",

"prompt": "{file:./prompts/build.txt}",

"tools": {

"write": true,

"edit": true,

"bash": true

}

},

"plan": {

"mode": "primary",

"model": "",

"tools": {

"write": false,

"edit": false,

"bash": false

}

},

"code-reviewer": {

"description": "Reviews code for best practices and potential issues",

"mode": "subagent",

"model": "",

"prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",

"tools": {

"write": false,

"edit": false

}

}

}

}
```

---

### [Markdown](#markdown)

También puede definir agentes utilizando archivos de Markdown. Colócalos en:

* Global: `~/.config/opencode/agents/`
* Por proyecto: `.opencode/agents/`

~/.config/opencode/agents/review.md

```
---

description: Reviews code for quality and best practices

mode: subagent

model: ""

temperature: 0.1

tools:

write: false

edit: false

bash: false

---

You are in code review mode. Focus on:

- Code quality and best practices

- Potential bugs and edge cases

- Performance implications

- Security considerations

Provide constructive feedback without making direct changes.
```

El nombre del archivo de Markdown se convierte en el nombre del agente. Por ejemplo, `review.md` crea un agente `review`.

---

## [Opciones](#opciones)

Veamos estas opciones de configuración en detalle.

---

### [Descripción](#descripción)

Utilice la opción `description` para proporcionar una breve descripción de lo que hace el agente y cuándo usarlo.

opencode.json

```
{

"agent": {

"review": {

"description": "Reviews code for best practices and potential issues"

}

}

}
```

Esta es una opción de configuración **obligatoria**.

---

### [Temperatura](#temperatura)

Controle la aleatoriedad y la creatividad de las respuestas de LLM con la configuración `temperature`.

Los valores más bajos hacen que las respuestas sean más centradas y deterministas, mientras que los valores más altos aumentan la creatividad y la variabilidad.

opencode.json

```
{

"agent": {

"plan": {

"temperature": 0.1

},

"creative": {

"temperature": 0.8

}

}

}
```

Los valores de temperatura suelen oscilar entre 0,0 y 1,0:

* **0.0-0.2**: Respuestas muy enfocadas y deterministas, ideales para análisis y planificación de código.
* **0,3-0,5**: respuestas equilibradas con algo de creatividad, buenas para tareas de desarrollo general.
* **0.6-1.0**: respuestas más creativas y variadas, útiles para la lluvia de ideas y la exploración.

opencode.json

```
{

"agent": {

"analyze": {

"temperature": 0.1,

"prompt": "{file:./prompts/analysis.txt}"

},

"build": {

"temperature": 0.3

},

"brainstorm": {

"temperature": 0.7,

"prompt": "{file:./prompts/creative.txt}"

}

}

}
```

Si no se especifica ninguna temperatura, OpenCode utiliza valores predeterminados específicos del modelo; normalmente 0 para la mayoría de los modelos, 0,55 para los modelos Qwen.

---

### [Pasos máximos](#pasos-máximos)

Controle la cantidad máxima de iteraciones agentes que un agente puede realizar antes de verse obligado a responder solo con texto. Esto permite a los usuarios que desean controlar los costos establecer un límite a las acciones de agencia.

Si no se establece esto, el agente continuará iterando hasta que el modelo decida detenerse o el usuario interrumpa la sesión.

opencode.json

```
{

"agent": {

"quick-thinker": {

"description": "Fast reasoning with limited iterations",

"prompt": "You are a quick thinker. Solve problems with minimal steps.",

"steps": 5

}

}

}
```

Cuando se alcanza el límite, el agente recibe un mensaje especial del sistema que le indica que responda con un resumen de su trabajo y las tareas restantes recomendadas.

---

### [Deshabilitar](#deshabilitar)

Establezca en `true` para deshabilitar el agente.

opencode.json

```
{

"agent": {

"review": {

"disable": true

}

}

}
```

---

### [Indicación](#indicación)

Especifique un archivo de aviso del sistema personalizado para este agente con la configuración `prompt`. El archivo de aviso debe contener instrucciones específicas para el propósito del agente.

opencode.json

```
{

"agent": {

"review": {

"prompt": "{file:./prompts/code-review.txt}"

}

}

}
```

Esta ruta es relativa a donde se encuentra el archivo de configuración. Entonces esto funciona tanto para la configuración global OpenCode como para la configuración específica del proyecto.

---

### [Modelo](#modelo)

Utilice la configuración `model` para anular el modelo de este agente. Útil para utilizar diferentes modelos optimizados para diferentes tareas. Por ejemplo, un modelo más rápido de planificación, un modelo más capaz de implementación.

opencode.json

```
{

"agent": {

"plan": {

"model": ""

}

}

}
```

El ID del modelo en su configuración OpenCode usa el formato `provider/model-id`. Por ejemplo, si usa [OpenCode Zen](/docs/zen), usaría `opencode/gpt-5.1-codex` para GPT 5.1 Codex.

---

### [Herramientas](#herramientas)

Controle qué herramientas están disponibles en este agente con la configuración `tools`. Puede habilitar o deshabilitar herramientas específicas configurándolas en `true` o `false`.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"tools": {

"write": true,

"bash": true

},

"agent": {

"plan": {

"tools": {

"write": false,

"bash": false

}

}

}

}
```

También puedes utilizar comodines para controlar varias herramientas a la vez. Por ejemplo, para desactivar todas las herramientas de un servidor MCP:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"agent": {

"readonly": {

"tools": {

"mymcp_*": false,

"write": false,

"edit": false

}

}

}

}
```

[Más información sobre herramientas](/docs/tools).

---

### [Permisos](#permisos)

Puede configurar permisos para administrar qué acciones puede realizar un agente. Actualmente, los permisos para las herramientas `edit`, `bash` y `webfetch` se pueden configurar para:

* `"ask"`: solicitar aprobación antes de ejecutar la herramienta
* `"allow"` — Permitir todas las operaciones sin aprobación
* `"deny"` — Desactiva la herramienta

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"permission": {

"edit": "deny"

}

}
```

Puede anular estos permisos por agente.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"permission": {

"edit": "deny"

},

"agent": {

"build": {

"permission": {

"edit": "ask"

}

}

}

}
```

También puede establecer permisos en los agentes de Markdown.

~/.config/opencode/agents/review.md

```
---

description: Code review without edits

mode: subagent

permission:

edit: deny

bash:

"*": ask

"git diff": allow

"git log*": allow

"grep *": allow

webfetch: deny

---

Only analyze code and suggest changes.
```

Puede establecer permisos para comandos bash específicos.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"agent": {

"build": {

"permission": {

"bash": {

"git push": "ask",

"grep *": "allow"

}

}

}

}

}
```

Esto puede tomar un patrón global.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"agent": {

"build": {

"permission": {

"bash": {

"git *": "ask"

}

}

}

}

}
```

Y también puedes usar el comodín `*` para administrar los permisos de todos los comandos.
Dado que la última regla de coincidencia tiene prioridad, coloque el comodín `*` primero y las reglas específicas después.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"agent": {

"build": {

"permission": {

"bash": {

"*": "ask",

"git status *": "allow"

}

}

}

}

}
```

[Más información sobre permisos](/docs/permissions).

---

### [Modo](#modo)

Controle el modo del agente con la configuración `mode`. La opción `mode` se utiliza para determinar cómo se puede utilizar el agente.

opencode.json

```
{

"agent": {

"review": {

"mode": "subagent"

}

}

}
```

La opción `mode` se puede configurar en `primary`, `subagent` o `all`. Si no se especifica `mode`, el valor predeterminado es `all`.

---

### [Oculto](#oculto)

Oculte un subagente del menú de autocompletar `@` con `hidden: true`. Útil para subagentes internos que solo deben ser invocados mediante programación por otros agentes a través de la herramienta Tarea.

opencode.json

```
{

"agent": {

"internal-helper": {

"mode": "subagent",

"hidden": true

}

}

}
```

Esto sólo afecta la visibilidad del usuario en el menú de autocompletar. El modelo aún puede invocar agentes ocultos a través de la herramienta Tarea si los permisos lo permiten.

---

### [Permisos de tarea](#permisos-de-tarea)

Controle qué subagentes puede invocar un agente a través de la herramienta Tarea con `permission.task`. Utiliza patrones globales para una combinación flexible.

opencode.json

```
{

"agent": {

"orchestrator": {

"mode": "primary",

"permission": {

"task": {

"*": "deny",

"orchestrator-*": "allow",

"code-reviewer": "ask"

}

}

}

}

}
```

Cuando se establece en `deny`, el subagente se elimina por completo de la descripción de la herramienta Tarea, por lo que el modelo no intentará invocarlo.

---

### [Color](#color)

Personalice la apariencia visual del agente en la interfaz de usuario con la opción `color`. Esto afecta la forma en que aparece el agente en la interfaz.

Utilice un color hexadecimal válido (por ejemplo, `#FF5733`) o un color de tema: `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`.

opencode.json

```
{

"agent": {

"creative": {

"color": "#ff6b6b"

},

"code-reviewer": {

"color": "accent"

}

}

}
```

---

### [Top P](#top-p)

Controle la diversidad de respuestas con la opción `top_p`. Alternativa a la temperatura para controlar la aleatoriedad.

opencode.json

```
{

"agent": {

"brainstorm": {

"top_p": 0.9

}

}

}
```

Los valores oscilan entre 0,0 y 1,0. Los valores más bajos están más enfocados, los valores más altos son más diversos.

---

### [Adicional](#adicional)

Cualquier otra opción que especifique en la configuración de su agente se **pasará directamente** al proveedor como opciones de modelo. Esto le permite utilizar funciones y parámetros específicos del proveedor.

Por ejemplo, con los modelos de razonamiento de OpenAI, puedes controlar el esfuerzo de razonamiento:

opencode.json

```
{

"agent": {

"deep-thinker": {

"description": "Agent that uses high reasoning effort for complex problems",

"model": "openai/gpt-5",

"reasoningEffort": "high",

"textVerbosity": "low"

}

}

}
```

Estas opciones adicionales son específicas del modelo y del proveedor. Consulte la documentación de su proveedor para conocer los parámetros disponibles.

---

## [Crear agentes](#crear-agentes)

Puede crear nuevos agentes usando el siguiente comando:

Ventana de terminal

```
opencode agent create
```

Este comando interactivo:

1. Preguntar dónde guardar al agente; global o específico del proyecto.
2. Descripción de lo que debe hacer el agente.
3. Genere un indicador y un identificador del sistema adecuados.
4. Le permite seleccionar a qué herramientas puede acceder el agente.
5. Finalmente, cree un archivo Markdown con la configuración del agente.

---

## [Casos de uso](#casos-de-uso)

A continuación se muestran algunos casos de uso comunes para diferentes agentes.

* **Agente Build**: trabajo de desarrollo completo con todas las herramientas habilitadas
* **Agente Plan**: Análisis y planificación sin realizar cambios
* **Agente Review**: revisión de código con acceso de solo lectura más herramientas de documentación
* **Agente Debug**: centrado en la investigación con bash y herramientas de lectura habilitadas
* **Agente Docs**: escritura de documentación con operaciones de archivos pero sin comandos del sistema.

---

## [Ejemplos](#ejemplos)

A continuación se muestran algunos agentes de ejemplo que pueden resultarle útiles.

---

### [Agente de documentación](#agente-de-documentación)

~/.config/opencode/agents/docs-writer.md

```
---

description: Writes and maintains project documentation

mode: subagent

tools:

bash: false

---

You are a technical writer. Create clear, comprehensive documentation.

Focus on:

- Clear explanations

- Proper structure

- Code examples

- User-friendly language
```

---

### [Auditor de seguridad](#auditor-de-seguridad)

~/.config/opencode/agents/security-auditor.md

```
---

description: Performs security audits and identifies vulnerabilities

mode: subagent

tools:

write: false

edit: false

---

You are a security expert. Focus on identifying potential security issues.

Look for:

- Input validation vulnerabilities

- Authentication and authorization flaws

- Data exposure risks

- Dependency vulnerabilities

- Configuration security issues
```