# TUI

Usando la interfaz de usuario del terminal OpenCode.

OpenCode proporciona una interfaz de terminal interactiva o TUI para trabajar en sus proyectos con un LLM.

Al ejecutar OpenCode se inicia TUI para el directorio actual.

Ventana de terminal

```
opencode
```

O puede iniciarlo para un directorio de trabajo específico.

Ventana de terminal

```
opencode /path/to/project
```

Una vez que esté en TUI, puede indicarlo con un mensaje.

```
Give me a quick summary of the codebase.
```

---

## [Referencias de archivos](#referencias-de-archivos)

Puede hacer referencia a archivos en sus mensajes usando `@`. Esto realiza una búsqueda difusa de archivos en el directorio de trabajo actual.

```
How is auth handled in @packages/functions/src/api/index.ts?
```

El contenido del archivo se agrega a la conversación automáticamente.

---

## [Comandos bash](#comandos-bash)

Inicie un mensaje con `!` para ejecutar un comando de shell.

```
!ls -la
```

El resultado del comando se agrega a la conversación como resultado de la herramienta.

---

## [Comandos](#comandos)

Cuando utilice OpenCode TUI, puede escribir `/` seguido de un nombre de comando para ejecutar acciones rápidamente. Por ejemplo:

```
/help
```

La mayoría de los comandos también tienen una combinación de teclas que utiliza `ctrl+x` como tecla principal, donde `ctrl+x` es la tecla principal predeterminada. [Más información](/docs/keybinds).

Aquí están todos los comandos de barra diagonal disponibles:

---

### [connect](#connect)

Agregue un proveedor a OpenCode. Le permite seleccionar entre proveedores disponibles y agregar sus claves API.

```
/connect
```

---

### [compact](#compact)

Compacta la sesión actual. *Alias*: `/summarize`

```
/compact
```

**Combinación de teclas:** `ctrl+x c`

---

### [details](#details)

Alternar detalles de ejecución de la herramienta.

```
/details
```

**Combinación de teclas:** `ctrl+x d`

---

### [editor](#editor)

Abra un editor externo para redactar mensajes. Utiliza el editor configurado en su variable de entorno `EDITOR`. [Más información](#editor-setup).

```
/editor
```

**Combinación de teclas:** `ctrl+x e`

---

### [exit](#exit)

Salga de OpenCode. *Alias*: `/quit`, `/q`

```
/exit
```

**Combinación de teclas:** `ctrl+x q`

---

### [export](#export)

Exporte la conversación actual a Markdown y ábrala en su editor predeterminado. Utiliza el editor configurado en su variable de entorno `EDITOR`. [Más información](#editor-setup).

```
/export
```

**Combinación de teclas:** `ctrl+x x`

---

### [help](#help)

Muestra el cuadro de diálogo de ayuda.

```
/help
```

**Combinación de teclas:** `ctrl+x h`

---

### [init](#init)

Cree o actualice el archivo `AGENTS.md`. [Más información](/docs/rules).

```
/init
```

**Combinación de teclas:** `ctrl+x i`

---

### [models](#models)

Listar modelos disponibles.

```
/models
```

**Combinación de teclas:** `ctrl+x m`

---

### [new](#new)

Iniciar una nueva sesión. *Alias*: `/clear`

```
/new
```

**Combinación de teclas:** `ctrl+x n`

---

### [redo](#redo)

Rehacer un mensaje previamente deshecho. Solo disponible después de usar `/undo`.

Internamente, esto utiliza Git para gestionar los cambios de archivos. Entonces tu proyecto **necesita
ser un repositorio Git**.

```
/redo
```

**Combinación de teclas:** `ctrl+x r`

---

### [sessions](#sessions)

Enumere y cambie entre sesiones. *Alias*: `/resume`, `/continue`

```
/sessions
```

**Combinación de teclas:** `ctrl+x l`

---

### [share](#share)

Compartir la sesión actual. [Más información](/docs/share).

```
/share
```

**Combinación de teclas:** `ctrl+x s`

---

### [theme](#theme)

Listar temas disponibles.

```
/theme
```

**Combinación de teclas:** `ctrl+x t`

---

### [thinking](#thinking)

Alterna la visibilidad de los bloques de pensamiento/razonamiento en la conversación. Cuando está habilitado, puede ver el proceso de razonamiento del modelo para los modelos que admiten el pensamiento extendido.

```
/thinking
```

---

### [undo](#undo)

Deshacer el último mensaje de la conversación. Elimina el mensaje de usuario más reciente, todas las respuestas posteriores y cualquier cambio de archivo.

Internamente, esto utiliza Git para gestionar los cambios de archivos. Entonces tu proyecto **necesita
ser un repositorio Git**.

```
/undo
```

**Combinación de teclas:** `ctrl+x u`

---

### [unshare](#unshare)

Dejar de compartir la sesión actual. [Más información](/docs/share#un-sharing).

```
/unshare
```

---

## [Configuración del editor](#configuración-del-editor)

Tanto el comando `/editor` como el `/export` usan el editor especificado en su variable de entorno `EDITOR`.

* [Linux/macOS](#tab-panel-39)
* [Windows (CMD)](#tab-panel-40)
* [Windows (PowerShell)](#tab-panel-41)

Ventana de terminal

```
# Example for nano or vim

export EDITOR=nano

export EDITOR=vim

# For GUI editors, VS Code, Cursor, VSCodium, Windsurf, Zed, etc.

# include --wait

export EDITOR="code --wait"
```

Para hacerlo permanente, agréguelo a su perfil de shell;
`~/.bashrc`, `~/.zshrc`, etc.

Ventana de terminal

```
set EDITOR=notepad

# For GUI editors, VS Code, Cursor, VSCodium, Windsurf, Zed, etc.

# include --wait

set EDITOR=code --wait
```

Para hacerlo permanente, use **Propiedades del sistema** > **Entorno
Variables**.

Ventana de terminal

```
$env:EDITOR = "notepad"

# For GUI editors, VS Code, Cursor, VSCodium, Windsurf, Zed, etc.

# include --wait

$env:EDITOR = "code --wait"
```

Para hacerlo permanente, agréguelo a su perfil de PowerShell.

Las opciones de editor populares incluyen:

* `code` - Código de Visual Studio
* `cursor` - Cursor
* `windsurf` - Windsurf
* `nvim` - Editor Neovim
* `vim` - Editor Vim
* `nano` - Nanoeditor
* `notepad` - Windows Bloc de notas
* `subl` - Texto sublime

Algunos editores necesitan argumentos de línea de comandos para ejecutarse en modo de bloqueo. El indicador `--wait` hace que el proceso del editor se bloquee hasta que se cierre.

---

## [Configurar](#configurar)

Puede personalizar el comportamiento de TUI a través de `tui.json` (o `tui.jsonc`).

tui.json

```
{

"$schema": "https://opencode.ai/tui.json",

"theme": "opencode",

"keybinds": {

"leader": "ctrl+x"

},

"scroll_speed": 3,

"scroll_acceleration": {

"enabled": true

},

"diff_style": "auto"

}
```

Esto es independiente de `opencode.json`, que configura el comportamiento del servidor/tiempo de ejecución.

### [Opciones](#opciones)

* `theme`: establece su tema de interfaz de usuario. [Más información](/docs/themes).
* `keybinds`: personaliza los atajos de teclado. [Más información](/docs/keybinds).
* `scroll_acceleration.enabled`: habilite la aceleración de desplazamiento estilo macOS para un desplazamiento suave y natural. Cuando está habilitado, la velocidad de desplazamiento aumenta con gestos de desplazamiento rápido y se mantiene precisa para movimientos más lentos. **Esta configuración tiene prioridad sobre `scroll_speed` y la anula cuando está habilitada.**
* `scroll_speed`: controla la rapidez con la que se desplaza el TUI cuando se utilizan comandos de desplazamiento (mínimo: `0.001`, admite valores decimales). El valor predeterminado es `3`. **Nota: Esto se ignora si `scroll_acceleration.enabled` está configurado en `true`.**
* `diff_style`: controla la representación de diferencias. `"auto"` se adapta al ancho del terminal, `"stacked"` siempre muestra un diseño de una sola columna.

Utilice `OPENCODE_TUI_CONFIG` para cargar una ruta de configuración de TUI personalizada.

---

## [Personalización](#personalización)

Puede personalizar varios aspectos de la vista TUI usando la paleta de comandos (`ctrl+x h` o `/help`). Estas configuraciones persisten después de los reinicios.

---

#### [Visualización del nombre de usuario](#visualización-del-nombre-de-usuario)

Alterna si tu nombre de usuario aparece en los mensajes de chat. Accede a este a través de:

* Paleta de comandos: busque “nombre de usuario” u “ocultar nombre de usuario”
* La configuración persiste automáticamente y se recordará en TUI sesiones