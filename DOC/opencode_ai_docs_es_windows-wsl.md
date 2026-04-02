# Windows (WSL)

Ejecuta OpenCode en Windows con WSL para una mejor experiencia.

Aunque OpenCode puede ejecutarse directamente en Windows, recomendamos usar [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) para obtener la mejor experiencia. WSL ofrece un entorno Linux que funciona perfectamente con las funciones de OpenCode.

---

## [Configuración](#configuración)

1. **Instala WSL**

   Si aún no lo hiciste, [instala WSL](https://learn.microsoft.com/en-us/windows/wsl/install) usando la guía oficial de Microsoft.
2. **Instala OpenCode en WSL**

   Cuando WSL esté listo, abre tu terminal de WSL e instala OpenCode con uno de los [métodos de instalación](/docs/).

   Ventana de terminal

   ```
   curl -fsSL https://opencode.ai/install | bash
   ```
3. **Usa OpenCode desde WSL**

   Ve al directorio de tu proyecto (accede a los archivos de Windows desde `/mnt/c/`, `/mnt/d/`, etc.) y ejecuta OpenCode.

   Ventana de terminal

   ```
   cd /mnt/c/Users/YourName/project

   opencode
   ```

---

## [Aplicación de escritorio + servidor WSL](#aplicación-de-escritorio--servidor-wsl)

Si prefieres usar la app de escritorio de OpenCode pero quieres ejecutar el servidor en WSL:

1. **Inicia el servidor en WSL** con `--hostname 0.0.0.0` para permitir conexiones externas:

   Ventana de terminal

   ```
   opencode serve --hostname 0.0.0.0 --port 4096
   ```
2. **Conecta la app de escritorio** a `http://localhost:4096`

---

## [Cliente web + WSL](#cliente-web--wsl)

Para obtener la mejor experiencia web en Windows:

1. **Ejecuta `opencode web` en la terminal de WSL** en lugar de PowerShell:

   Ventana de terminal

   ```
   opencode web --hostname 0.0.0.0
   ```
2. **Accede desde tu navegador de Windows** en `http://localhost:<port>` (OpenCode muestra la URL)

Ejecutar `opencode web` desde WSL garantiza acceso correcto al sistema de archivos e integración con la terminal, manteniéndolo accesible desde tu navegador de Windows.

---

## [Acceso a archivos de Windows](#acceso-a-archivos-de-windows)

WSL puede acceder a todos tus archivos de Windows mediante el directorio `/mnt/`:

* Unidad `C:` → `/mnt/c/`
* Unidad `D:` → `/mnt/d/`
* Y así sucesivamente…

Ejemplo:

Ventana de terminal

```
cd /mnt/c/Users/YourName/Documents/project

opencode
```

---

## [Consejos](#consejos)

* Ejecuta OpenCode en WSL para proyectos guardados en unidades de Windows: el acceso a archivos es transparente
* Usa la [extensión WSL de VS Code](https://code.visualstudio.com/docs/remote/wsl) junto con OpenCode para un flujo de desarrollo integrado
* Tu configuración y tus sesiones de OpenCode se guardan dentro del entorno WSL en `~/.local/share/opencode/`