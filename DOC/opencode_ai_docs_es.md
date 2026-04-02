# Introducción

Comience a usar OpenCode.

[**OpenCode**](/) es un agente de codigo de IA de código abierto. Está disponible como interfaz basada en terminal, aplicación de escritorio o extensión IDE.

![OpenCode TUI con el tema opencode](/docs/_astro/screenshot.CQjBbRyJ_1dLadc.webp)

Comencemos.

---

#### [Requisitos previos](#requisitos-previos)

Para usar OpenCode en la terminal, necesitará:

1. Un emulador de terminal moderno como:

   * [WezTerm](https://wezterm.org), multiplataforma
   * [Alacritty](https://alacritty.org), multiplataforma
   * [Ghostty](https://ghostty.org), Linux y macOS
   * [Kitty](https://sw.kovidgoyal.net/kitty/), Linux y macOS
2. Claves de API de los proveedores de LLM que quiera usar.

---

## [Instalar](#instalar)

La forma más sencilla de instalar OpenCode es mediante el script de instalación.

Ventana de terminal

```
curl -fsSL https://opencode.ai/install | bash
```

También puedes instalarlo con alguno de los siguientes métodos:

* **Usando Node.js**

  + [npm](#tab-panel-35)
  + [Bun](#tab-panel-36)
  + [pnpm](#tab-panel-37)
  + [Yarn](#tab-panel-38)

  Ventana de terminal

  ```
  npm install -g opencode-ai
  ```

  Ventana de terminal

  ```
  bun install -g opencode-ai
  ```

  Ventana de terminal

  ```
  pnpm install -g opencode-ai
  ```

  Ventana de terminal

  ```
  yarn global add opencode-ai
  ```
* **Usando Homebrew en macOS y Linux**

  Ventana de terminal

  ```
  brew install anomalyco/tap/opencode
  ```

  > Recomendamos utilizar el tap OpenCode para las versiones más actualizadas. La fórmula oficial `brew install opencode` la mantiene el equipo Homebrew y se actualiza con menos frecuencia.
* **Usando Paru en Arch Linux**

  Ventana de terminal

  ```
  sudo pacman -S opencode           # Arch Linux (Stable)

  paru -S opencode-bin              # Arch Linux (Latest from AUR)
  ```

#### [Windows](#windows)

* **Usando Chocolatey**

  Ventana de terminal

  ```
  choco install opencode
  ```
* **Usando Scoop**

  Ventana de terminal

  ```
  scoop install opencode
  ```
* **Usando NPM**

  Ventana de terminal

  ```
  npm install -g opencode-ai
  ```
* **Usando Mise**

  Ventana de terminal

  ```
  mise use -g github:anomalyco/opencode
  ```
* **Usando Docker**

  Ventana de terminal

  ```
  docker run -it --rm ghcr.io/anomalyco/opencode
  ```

El soporte para instalar OpenCode en Windows usando Bun todavía está en desarrollo.

También puede obtener el binario desde [Versiones](https://github.com/anomalyco/opencode/releases).

---

## [Configuración](#configuración)

Con OpenCode, puede usar cualquier proveedor de LLM configurando sus claves de API.

Si es nuevo en el uso de proveedores de LLM, le recomendamos usar [OpenCode Zen](/docs/zen).
Es una selección de modelos probados y verificados por el equipo de OpenCode.

1. Ejecute el comando `/connect` en la TUI, seleccione opencode y diríjase a [opencode.ai/auth](https://opencode.ai/auth).

   ```
   /connect
   ```
2. Inicie sesión, agregue sus datos de facturación y copie su clave de API.
3. Pega tu clave de API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```

También puede seleccionar otro proveedor. [Más información](/docs/providers#directory).

---

## [Inicializar](#inicializar)

Ahora que ya configuró un proveedor, vaya al proyecto en el que quiera trabajar.

Ventana de terminal

```
cd /path/to/project
```

Luego, ejecute OpenCode.

Ventana de terminal

```
opencode
```

A continuación, inicialice OpenCode para el proyecto con el siguiente comando:

```
/init
```

OpenCode analizará su proyecto y creará un archivo AGENTS.md en la raíz.

Esto ayuda a OpenCode a comprender la estructura del proyecto y los patrones de código que se usan en él.

---

## [Usar](#usar)

Ahora ya está listo para usar OpenCode en su proyecto. Puede pedirle desde explicaciones del código hasta cambios concretos.

Si es la primera vez que usa un agente de codigo con IA, estos ejemplos pueden servirle como punto de partida.

---

### [Hacer preguntas](#hacer-preguntas)

Puede pedirle a OpenCode que le explique el código base.

```
¿Cómo se maneja la autenticación en @packages/functions/src/api/index.ts
```

Esto resulta útil cuando hay una parte del código base en la que usted no ha trabajado.

---

### [Agregar funcionalidades](#agregar-funcionalidades)

Puede pedirle a OpenCode que agregue nuevas funcionalidades a su proyecto. Aun así, primero recomendamos pedirle que cree un plan.

1. **Crear un plan**

   OpenCode tiene un modo Plan que desactiva temporalmente su capacidad de hacer cambios y, en su lugar, propone *cómo* implementará la funcionalidad.

   Cambie a este modo con la tecla **Tab.** Verá un indicador en la esquina inferior derecha.

   ```
   <TAB>
   ```

   Ahora describa lo que quiere que haga.

   ```
   Cuando un usuario elimine una nota, queremos marcarla como eliminada en la base de datos.

   Luego, cree una pantalla que muestre todas las notas eliminadas recientemente.

   Desde esa pantalla, el usuario podrá restaurar una nota o eliminarla de forma permanente.
   ```

   Procure darle a OpenCode suficiente contexto para que entienda exactamente lo que necesita. Ayuda hablarle como si estuviera hablando con un desarrollador junior de su equipo.
2. **Iterar sobre el plan**

   Una vez que OpenCode le proponga un plan, puede darle comentarios o agregar más detalles.

   ```
   Queremos diseñar esta nueva pantalla usando un diseño que ya hemos usado antes.

   [Imagen #1] Revise esta imagen y úsela como referencia.
   ```

   OpenCode puede analizar cualquier imagen que usted le proporcione y añadirla al contexto del mensaje. Puede hacerlo arrastrando y soltando una imagen en la terminal.
3. **Implementar la funcionalidad**

   Cuando esté conforme con el plan, vuelva al modo *Build* presionando de nuevo la tecla Tab.

   ```
   <TAB>
   ```

   Luego, pídale que haga los cambios.

   ```
   Perfecto. Continúe y realice los cambios.
   ```

---

### [Realizar cambios](#realizar-cambios)

Para cambios más sencillos, puede pedirle a OpenCode que los implemente directamente, sin revisar antes un plan.

```
Necesitamos agregar autenticación a la ruta /settings. Revise cómo se maneja esto

en la ruta /notes en @packages/functions/src/notes.ts e implemente

la misma lógica en @packages/functions/src/settings.ts.
```

Procure dar suficientes detalles para que OpenCode pueda tomar las decisiones correctas al hacer los cambios

---

### [Deshacer cambios](#deshacer-cambios)

Supongamos que le pide a OpenCode que haga algunos cambios.

```
¿Puede refactorizar la función en @packages/functions/src/api/index.ts?
```

Pero luego se da cuenta de que no era lo que quería. Puede **deshacer** los cambios usando el comando `/undo`.

```
/undo
```

OpenCode revertirá los cambios que hizo y volverá a mostrar su mensaje original.

```
¿Puede refactorizar la función en @packages/functions/src/api/index.ts?
```

Desde ahí, puede modificar el mensaje y pedirle a OpenCode que lo intente de nuevo.

También puede rehacer los cambios usando el comando `/redo.`

```
/redo
```

---

## [Compartir](#compartir)

Las conversaciones que tenga con OpenCode pueden [compartirse con su
equipo](/docs/share).

```
/share
```

Esto creará un enlace a la conversación actual y lo copiará en su portapapeles.

Aquí tiene una [conversación de ejemplo](https://opencode.ai/s/4XP1fce5) con OpenCode.

---

## [Personalizar](#personalizar)

Y eso es todo. Ya conoce lo básico para empezar a usar OpenCode.

Para personalizarlo, recomendamos [elegir un tema](/docs/themes), [personalizar las combinaciones de teclas](/docs/keybinds), [configurar formateadores de código](/docs/formatters), [crear comandos personalizados](/docs/commands) o explorar la [configuración OpenCode](/docs/config).