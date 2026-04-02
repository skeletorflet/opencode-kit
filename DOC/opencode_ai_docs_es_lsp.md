# Servidores LSP

OpenCode se integra con sus servidores LSP.

OpenCode se integra con su protocolo de servidor de idiomas (LSP) para ayudar a LLM a interactuar con su código base. Utiliza diagnósticos para proporcionar retroalimentación al LLM.

---

## [Incorporados](#incorporados)

OpenCode viene con varios servidores LSP integrados para idiomas populares:

| Servidor LSP | Extensiones | Requisitos |
| --- | --- | --- |
| astro | .astro | Autoinstalaciones para proyectos Astro |
| bash | .sh, .bash, .zsh, .ksh | Autoinstala el servidor en lenguaje bash |
| clangd | .c, .cpp, .cc, .cxx, .c++, .h, .hpp, .hh, .hxx, .h++ | Instalaciones automáticas para proyectos C/C++ |
| csharp | .cs | `.NET SDK` instalado |
| clojure-lsp | .clj, .cljs, .cljc, .edn | Comando `clojure-lsp` disponible |
| dart | .dart | Comando `dart` disponible |
| deno | .ts, .tsx, .js, .jsx, .mjs | Comando `deno` disponible (detecta automáticamente deno.json/deno.jsonc) |
| elixir-ls | .ex, .exs | Comando `elixir` disponible |
| eslint | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue | `eslint` dependencia en proyecto |
| fsharp | .fs, .fsi, .fsx, .fsscript | `.NET SDK` instalado |
| gleam | .gleam | Comando `gleam` disponible |
| gopls | .go | Comando `go` disponible |
| hls | .hs, .lhs | Comando `haskell-language-server-wrapper` disponible |
| jdtls | .java | `Java SDK (version 21+)` instalado |
| julials | .jl | `julia` y `LanguageServer.jl` instalados |
| kotlin-ls | .kt, .kts | Autoinstalaciones para proyectos Kotlin |
| lua-ls | .lua | Autoinstalaciones para proyectos Lua |
| nixd | .nix | Comando `nixd` disponible |
| ocaml-lsp | .ml, .mli | Comando `ocamllsp` disponible |
| oxlint | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue, .astro, .svelte | `oxlint` dependencia en proyecto |
| php intelephense | .php | Autoinstalaciones para proyectos PHP |
| prisma | .prisma | Comando `prisma` disponible |
| pyright | .py, .pyi | Dependencia `pyright` instalada |
| ruby-lsp (rubocop) | .rb, .rake, .gemspec, .ru | Comandos `ruby` y `gem` disponibles |
| rust | .rs | Comando `rust-analyzer` disponible |
| sourcekit-lsp | .swift, .objc, .objcpp | `swift` instalado (`xcode` en macOS) |
| svelte | .svelte | Autoinstalaciones para proyectos Svelte |
| terraform | .tf, .tfvars | Instalaciones automáticas desde versiones GitHub |
| tinymist | .typ, .typc | Instalaciones automáticas desde versiones GitHub |
| typescript | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts | `typescript` dependencia en proyecto |
| vue | .vue | Autoinstalaciones para proyectos Vue |
| yaml-ls | .yaml, .yml | Autoinstala Red Hat yaml-language-server |
| zls | .zig, .zon | Comando `zig` disponible |

Los servidores LSP se habilitan automáticamente cuando se detecta una de las extensiones de archivo anteriores y se cumplen los requisitos.

---

## [Cómo funciona](#cómo-funciona)

Cuando opencode abre un archivo:

1. Comprueba la extensión del archivo con todos los servidores LSP habilitados.
2. Inicia el servidor LSP apropiado si aún no se está ejecutando.

---

## [Configuración](#configuración)

Puede personalizar los servidores LSP a través de la sección `lsp` en su configuración opencode.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"lsp": {}

}
```

Cada servidor LSP admite lo siguiente:

| Propiedad | Tipo | Descripción |
| --- | --- | --- |
| `disabled` | booleano | Establezca esto en `true` para deshabilitar el servidor LSP |
| `command` | cadena[] | El comando para iniciar el servidor LSP |
| `extensions` | cadena[] | Extensiones de archivo que este servidor LSP debería manejar |
| `env` | objeto | Variables de entorno para configurar al iniciar el servidor |
| `initialization` | objeto | Opciones de inicialización para enviar al servidor LSP |

Veamos algunos ejemplos.

---

### [Variables de entorno](#variables-de-entorno)

Utilice la propiedad `env` para establecer variables de entorno al iniciar el servidor LSP:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"lsp": {

"rust": {

"env": {

"RUST_LOG": "debug"

}

}

}

}
```

---

### [Opciones de inicialización](#opciones-de-inicialización)

Utilice la propiedad `initialization` para pasar opciones de inicialización al servidor LSP. Estas son configuraciones específicas del servidor enviadas durante la solicitud LSP `initialize`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"lsp": {

"typescript": {

"initialization": {

"preferences": {

"importModuleSpecifierPreference": "relative"

}

}

}

}

}
```

---

### [Deshabilitar servidores LSP](#deshabilitar-servidores-lsp)

Para deshabilitar **todos** los servidores LSP globalmente, configure `lsp` en `false`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"lsp": false

}
```

Para deshabilitar un servidor LSP **específico**, configure `disabled` en `true`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"lsp": {

"typescript": {

"disabled": true

}

}

}
```

---

### [Servidores LSP personalizados](#servidores-lsp-personalizados)

Puede agregar servidores LSP personalizados especificando el comando y las extensiones de archivo:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"lsp": {

"custom-lsp": {

"command": ["custom-lsp-server", "--stdio"],

"extensions": [".custom"]

}

}

}
```

---

## [Información adicional](#información-adicional)

### [PHP Intelephense](#php-intelephense)

PHP Intelephense ofrece funciones premium a través de una clave de licencia. Puede proporcionar una clave de licencia colocando (únicamente) la clave en un archivo de texto en:

* En macOS/Linux: `$HOME/intelephense/license.txt`
* En Windows: `%USERPROFILE%/intelephense/license.txt`

El archivo debe contener sólo la clave de licencia sin contenido adicional.