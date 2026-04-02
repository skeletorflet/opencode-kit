🧠 CAPA 1 — Features built-in de oh-my-opencode (omo)
🔧 Hashline Edit Tool
Cada línea que el agente lee vuelve tageada con un hash de contenido:
11#VK| function hello() {
22#XJ|   return "world";
33#MB| }
El agente edita referenciando esos tags. Si el archivo cambió desde la última lectura, el hash no matchea y el edit es rechazado antes de corromper nada. Cero errores de "stale line". Con Grok Code Fast 1 pasó de 6.7% → 68.3% de éxito solo por cambiar la herramienta de edición. Libraries.io
Opt-in en la config:
jsonc{ "hashline_edit": true }

🔁 Ralph Loop
Loop auto-referencial: el agente recibe el mismo prompt repetido hasta que cumple una "completion promise". No habla consigo mismo entre iteraciones — ve el mismo prompt cada vez, pero el codebase cambió de iteraciones anteriores. Esto crea un feedback loop donde el agente mejora iterativamente su trabajo hasta que todos los tests pasan. npm
jsonc{ "ralph_loop": { "enabled": true, "default_max_iterations": 100 } }
```

Comando en sesión: `/ralph-loop` o el modo dios `/ulw-loop` (Ultrawork + Ralph juntos).

---

### 🎯 Keyword Detector (modos automáticos)
Detecta keywords en tus prompts y activa modos especializados automáticamente:
- `ultrawork` / `ulw` → modo máximo rendimiento con orquestación paralela de agentes
- `search` / `find` → esfuerzo de búsqueda maximizado con Explore + Librarian en paralelo
- `analyze` / `investigate` → modo análisis profundo con consulta multi-experto
- `ultrathink` → activa extended thinking (32k budget) 

---

### ✅ Todo Continuation Enforcer
Hace que los agentes terminen **todos los TODOs antes de parar**. Mata el hábito crónico de los LLMs de abandonar a mitad de tarea. 

---

### 💬 Comment Checker
Los LLMs aman los comentarios. Demasiados comentarios. Este hook los obliga a reducir el ruido. Ignora inteligentemente patrones válidos (BDD, directives, docstrings) y exige justificación para el resto. Código limpio gana. 

---

### 🛠️ LSP + AST-Grep integrado
LSP real: `lsp_rename`, `lsp_goto_definition`, `lsp_find_references`, `lsp_diagnostics` — precisión IDE para cada agente. AST-Grep: búsqueda y reescritura de código pattern-aware en 25 lenguajes. 

---

### 🗂️ /init-deep — AGENTS.md jerárquico
Genera archivos `AGENTS.md` jerárquicos en todo el proyecto:
```
project/
├── AGENTS.md        ← contexto global
├── src/
│   ├── AGENTS.md    ← contexto de src
│   └── components/
│       └── AGENTS.md ← contexto de componentes
Los agentes auto-leen el contexto relevante. Cero gestión manual. Excelente para eficiencia de tokens. Libraries.io

📡 MCPs built-in (3 tiers)
Sistema de 3 capas:

Tier 1 — Siempre activos: websearch (Exa AI), context7 (docs de librerías al día), grep_app (búsqueda en millones de repos públicos de GitHub)
Tier 2 — Claude Code MCPs: los de .mcp.json con expansión de variables ${VAR}, compatibilidad total con proyectos Claude Code
Tier 3 — Skill-embedded MCPs: scoped por sesión, se levantan al cargar un skill y se terminan al finalizar la sesión DeepWiki


🎭 25+ Hooks configurables
Lista completa de hooks disponibles: todo-continuation-enforcer, context-window-monitor, session-recovery, session-notification, comment-checker, ralph-loop, think-mode, background-notification, preemptive-compaction, compaction-context-injector, claude-code-hooks, hashline-read-enhancer, y más.
Se deshabilitan individualmente:
jsonc{ "disabled_hooks": ["comment-checker", "agent-usage-reminder"] }
GitHub

🖥️ Tmux Integration
Sub-agentes de background corren en panes tmux separados. Requiere estar dentro de tmux con opencode --port <port>.
jsonc{
  "tmux": {
    "enabled": true,
    "layout": "main-vertical",
    "main_pane_size": 60
  }
}
GitHub

🔌 CAPA 2 — Plugins/herramientas adicionales que podés agregar
🧠 Supermemory — memoria persistente cross-sesión
Plugin de OpenCode que da memoria persistente entre sesiones y proyectos. Al iniciar sesión, memorias relevantes se inyectan automáticamente en el contexto. Frases como "remember" o "save this" activan almacenamiento automático. A 80% de uso del contexto, la sesión se resume y se guarda como memoria. Contenido en tags <private> nunca se persiste. GitHub
bash# Instalación
opencode plugin install opencode-supermemory
# Luego correr en sesión:
/supermemory-init

⚠️ Si usás omo, deshabilitá el hook preemptive-compaction de omo para que supermemory maneje la compactación.


📚 Context7 MCP (standalone, si no usás omo)
Docs al día de cualquier librería, directo en el contexto. Ya viene en omo pero si solo usás OpenCode base:
jsonc{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}

🔍 Exa MCP — web search de calidad
Búsqueda web semántica real (no Google scraping). También ya viene en omo, pero si querés usarlo standalone:
jsonc{
  "mcpServers": {
    "exa": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": { "EXA_API_KEY": "$EXA_API_KEY" }
    }
  }
}
```

---

### 🎭 Skills built-in de omo que hay que activar
Skills incluidos que no están activos por defecto:
- **`playwright`** — automatización de browser
- **`playwright-cli`** — playwright desde CLI
- **`agent-browser`** / **`dev-browser`** — browser con visión para el agente
- **`git-master`** — commits atómicos y gestión de ramas
- **`frontend-ui-ux`** — skill especializado para trabajo visual/frontend 

Activar un skill en una tarea:
```
delegate_task(subagent_type="sisyphus", load_skills=["frontend-ui-ux"], prompt="...")

📊 Resumen de stack recomendado
CapaHerramientaPara quéCoreoh-my-opencode (omo)Todo el multi-agente + featuresMemorysupermemoryContexto persistente entre sesionesEdit safetyHashline (opt-in en omo)Cero stale-line errorsLoopRalph Loop (en omo)Tareas que requieren iteración hasta 100% doneTmuxactivar en configAgentes paralelos en panes visualesContextAGENTS.md via /init-deepInyección lean de contexto por directorioDocsContext7 (built-in omo)Documentación de libs siempre actualizadaSearchExa (built-in omo)Web search semántico realCode searchgrep.app (built-in omo)Buscar patrones en millones de repos públicos