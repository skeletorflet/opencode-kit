# Proveedores

Usando cualquier proveedor LLM en OpenCode.

OpenCode usa el [AI SDK](https://ai-sdk.dev/) y [Models.dev](https://models.dev) para admitir **75+ proveedores LLM** y admite la ejecución de modelos locales.

Para agregar un proveedor necesita:

1. Agregue las claves API para el proveedor usando el comando `/connect`.
2. Configure el proveedor en su configuración OpenCode.

---

### [Credenciales](#credenciales)

Cuando agrega las claves API de un proveedor con el comando `/connect`, se almacenan
en `~/.local/share/opencode/auth.json`.

---

### [Configuración](#configuración)

Puedes personalizar los proveedores a través de la sección `provider` en tu OpenCode
configuración.

---

#### [URL base](#url-base)

Puede personalizar la URL base para cualquier proveedor configurando la opción `baseURL`. Esto resulta útil cuando se utilizan servicios proxy o puntos finales personalizados.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"anthropic": {

"options": {

"baseURL": "https://api.anthropic.com/v1"

}

}

}

}
```

---

## [OpenCode Zen](#opencode-zen)

OpenCode Zen es una lista de modelos proporcionados por el equipo OpenCode que han sido
probado y verificado para funcionar bien con OpenCode. [Más información](/docs/zen).

1. Ejecute el comando `/connect` en TUI, seleccione opencode y diríjase a [opencode.ai/auth](https://opencode.ai/auth).

   ```
   /connect
   ```
2. Inicie sesión, agregue sus datos de facturación y copie su clave API.
3. Pega tu clave API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute `/models` en TUI para ver la lista de modelos que recomendamos.

   ```
   /models
   ```

Funciona como cualquier otro proveedor en OpenCode y su uso es completamente opcional.

---

## [OpenCode Go](#opencode-go)

OpenCode Go es un plan de suscripción de bajo costo que brinda acceso confiable a modelos de codificación abiertos populares proporcionados por el equipo de OpenCode que han sido
probado y verificado para funcionar bien con OpenCode.

1. Ejecute el comando `/connect` en TUI, seleccione `OpenCode Go` y diríjase a [opencode.ai/auth](https://opencode.ai/zen).

   ```
   /connect
   ```
2. Inicie sesión, agregue sus datos de facturación y copie su clave API.
3. Pegue su clave API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute `/models` en TUI para ver la lista de modelos que recomendamos.

   ```
   /models
   ```

Funciona como cualquier otro proveedor en OpenCode y su uso es completamente opcional.

---

## [Directorio](#directorio)

Veamos algunos de los proveedores en detalle. Si desea agregar un proveedor a la
lista, no dude en abrir un PR.

---

### [302.AI](#302ai)

1. Dirígete a la [consola 302.AI](https://302.ai/), crea una cuenta y genera una clave API.
2. Ejecute el comando `/connect` y busque **302.AI**.

   ```
   /connect
   ```
3. Ingrese su clave 302.AI API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo.

   ```
   /models
   ```

---

### [Amazon Bedrock](#amazon-bedrock)

Para usar Amazon Bedrock con OpenCode:

1. Dirígete al **Catálogo de modelos** en la consola Amazon Bedrock y solicita
   Accede a los modelos que desees.

   Necesita tener acceso al modelo que desea en Amazon Bedrock.
2. **Configure la autenticación** utilizando uno de los siguientes métodos:

   #### [Variables de entorno (Inicio rápido)](#variables-de-entorno-inicio-rápido)

   Establezca una de estas variables de entorno mientras ejecuta opencode:

   Ventana de terminal

   ```
   # Option 1: Using AWS access keys

   AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY=YYY opencode

   # Option 2: Using named AWS profile

   AWS_PROFILE=my-profile opencode

   # Option 3: Using Bedrock bearer token

   AWS_BEARER_TOKEN_BEDROCK=XXX opencode
   ```

   O agrégalos a tu perfil de bash:

   ~/.bash\_profile

   ```
   export AWS_PROFILE=my-dev-profile

   export AWS_REGION=us-east-1
   ```

   #### [Archivo de configuración (recomendado)](#archivo-de-configuración-recomendado)

   Para una configuración persistente o específica del proyecto, utilice `opencode.json`:

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "amazon-bedrock": {

   "options": {

   "region": "us-east-1",

   "profile": "my-aws-profile"

   }

   }

   }

   }
   ```

   **Opciones disponibles:**

   * `region` - AWS región (p. ej., `us-east-1`, `eu-west-1`)
   * `profile` - AWS perfil con nombre de `~/.aws/credentials`
   * `endpoint`: URL de punto de enlace personalizada para puntos de enlace de la VPC (alias para la opción genérica `baseURL`)

   Las opciones del archivo de configuración tienen prioridad sobre las variables de entorno.

   #### [Avanzado: puntos finales de la VPC](#avanzado-puntos-finales-de-la-vpc)

   Si utiliza puntos de enlace de VPC para Bedrock:

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "amazon-bedrock": {

   "options": {

   "region": "us-east-1",

   "profile": "production",

   "endpoint": "https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"

   }

   }

   }

   }
   ```

   La opción `endpoint` es un alias para la opción genérica `baseURL`, que utiliza terminología específica de AWS. Si se especifican `endpoint` y `baseURL`, `endpoint` tiene prioridad.

   #### [Métodos de autenticación](#métodos-de-autenticación)

   * **`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`**: Crear un usuario de IAM y generar claves de acceso en la Consola AWS
   * **`AWS_PROFILE`**: Utilice perfiles con nombre de `~/.aws/credentials`. Primero configure con `aws configure --profile my-profile` o `aws sso login`
   * **`AWS_BEARER_TOKEN_BEDROCK`**: Genera claves API a largo plazo desde la consola Amazon Bedrock
   * **`AWS_WEB_IDENTITY_TOKEN_FILE` / `AWS_ROLE_ARN`**: Para EKS IRSA (Roles IAM para Cuentas de Servicio) u otros entornos de Kubernetes con federación OIDC. Kubernetes inyecta automáticamente estas variables de entorno cuando se utilizan anotaciones de cuentas de servicio.

   #### [Prioridad de autenticación](#prioridad-de-autenticación)

   Amazon Bedrock utiliza la siguiente prioridad de autenticación:

   1. **Bearer token** - variable de entorno `AWS_BEARER_TOKEN_BEDROCK` o token del comando `/connect`
   2. **AWS Cadena de credenciales**: perfil, claves de acceso, credenciales compartidas, roles de IAM, tokens de identidad web (EKS IRSA), metadatos de instancia

   Cuando se define un bearer token (a traves de `/connect` o `AWS_BEARER_TOKEN_BEDROCK`), tiene prioridad sobre todos los metodos de credenciales de AWS, incluidos los perfiles configurados.
3. Ejecute el comando `/models` para seleccionar el modelo que desee.

   ```
   /models
   ```

---

### [Anthropic](#anthropic)

1. Una vez que se haya registrado, ejecute el comando `/connect` y seleccione Anthropic.

   ```
   /connect
   ```
2. Aquí puedes seleccionar la opción **Claude Pro/Max** y se abrirá tu navegador.
   y pedirle que se autentique.

   ```
   ┌ Select auth method

   │

   │ Claude Pro/Max

   │ Create an API Key

   │ Manually enter API Key

   └
   ```
3. Ahora todos los modelos Anthropic deberían estar disponibles cuando use el comando `/models`.

   ```
   /models
   ```

El uso de su suscripción Claude Pro/Max en OpenCode no está oficialmente respaldado por [Anthropic](https://anthropic.com).

##### [Usando las teclas API](#usando-las-teclas-api)

También puede seleccionar **Crear una clave API** si no tiene una suscripción Pro/Max. También abrirá su navegador y le pedirá que inicie sesión en Anthropic y le dará un código que puede pegar en su terminal.

O si ya tienes una clave API, puedes seleccionar **Ingresar manualmente la clave API** y pegarla en tu terminal.

---

### [Azure OpenAI](#azure-openai)

1. Diríjase al [portal de Azure](https://portal.azure.com/) y cree un recurso **Azure OpenAI**. Necesitarás:

   * **Nombre del recurso**: esto pasa a formar parte de su punto final API (`https://RESOURCE_NAME.openai.azure.com/`)
   * **Clave API**: `KEY 1` o `KEY 2` de su recurso
2. Vaya a [Azure AI Foundry](https://ai.azure.com/) e implemente un modelo.

   El nombre de la implementación debe coincidir con el nombre del modelo para que opencode funcione correctamente.
3. Ejecute el comando `/connect` y busque **Azure**.

   ```
   /connect
   ```
4. Ingrese su clave API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
5. Configure el nombre de su recurso como una variable de entorno:

   Ventana de terminal

   ```
   AZURE_RESOURCE_NAME=XXX opencode
   ```

   O agrégalo a tu perfil de bash:

   ~/.bash\_profile

   ```
   export AZURE_RESOURCE_NAME=XXX
   ```
6. Ejecute el comando `/models` para seleccionar su modelo implementado.

   ```
   /models
   ```

---

### [Servicios cognitivos de Azure](#servicios-cognitivos-de-azure)

1. Diríjase al [portal de Azure](https://portal.azure.com/) y cree un recurso **Azure OpenAI**. Necesitarás:

   * **Nombre del recurso**: esto pasa a formar parte de su punto final API (`https://AZURE_COGNITIVE_SERVICES_RESOURCE_NAME.cognitiveservices.azure.com/`)
   * **Clave API**: `KEY 1` o `KEY 2` de su recurso
2. Vaya a [Azure AI Foundry](https://ai.azure.com/) e implemente un modelo.

   El nombre de la implementación debe coincidir con el nombre del modelo para que opencode funcione correctamente.
3. Ejecute el comando `/connect` y busque **Azure Cognitive Services**.

   ```
   /connect
   ```
4. Ingrese su clave API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
5. Configure el nombre de su recurso como una variable de entorno:

   Ventana de terminal

   ```
   AZURE_COGNITIVE_SERVICES_RESOURCE_NAME=XXX opencode
   ```

   O agrégalo a tu perfil de bash:

   ~/.bash\_profile

   ```
   export AZURE_COGNITIVE_SERVICES_RESOURCE_NAME=XXX
   ```
6. Ejecute el comando `/models` para seleccionar su modelo implementado.

   ```
   /models
   ```

---

### [Baseten](#baseten)

1. Dirígete a [Baseten](https://app.baseten.co/), crea una cuenta y genera una clave API.
2. Ejecute el comando `/connect` y busque **Baseten**.

   ```
   /connect
   ```
3. Ingrese su clave Baseten API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo.

   ```
   /models
   ```

---

### [Cerebras](#cerebras)

1. Dirígete a la [consola Cerebras](https://inference.cerebras.ai/), crea una cuenta y genera una clave API.
2. Ejecute el comando `/connect` y busque **Cerebras**.

   ```
   /connect
   ```
3. Ingrese su clave Cerebras API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *Qwen 3 Coder 480B*.

   ```
   /models
   ```

---

### [Cloudflare AI Gateway](#cloudflare-ai-gateway)

Cloudflare AI Gateway le permite acceder a modelos de OpenAI, Anthropic, Workers AI y más a través de un punto final unificado. Con [Facturación unificada](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) no necesita claves API independientes para cada proveedor.

1. Dirígete al [panel de Cloudflare](https://dash.cloudflare.com/), navega hasta **AI** > **AI Gateway** y crea una nueva puerta de enlace.
2. Configure su ID de cuenta y su ID de puerta de enlace como variables de entorno.

   ~/.bash\_profile

   ```
   export CLOUDFLARE_ACCOUNT_ID=your-32-character-account-id

   export CLOUDFLARE_GATEWAY_ID=your-gateway-id
   ```
3. Ejecute el comando `/connect` y busque **Cloudflare AI Gateway**.

   ```
   /connect
   ```
4. Ingrese su token API de Cloudflare.

   ```
   ┌ API key

   │

   │

   └ enter
   ```

   O configúrelo como una variable de entorno.

   ~/.bash\_profile

   ```
   export CLOUDFLARE_API_TOKEN=your-api-token
   ```
5. Ejecute el comando `/models` para seleccionar un modelo.

   ```
   /models
   ```

   También puede agregar modelos a través de su configuración opencode.

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "cloudflare-ai-gateway": {

   "models": {

   "openai/gpt-4o": {},

   "anthropic/claude-sonnet-4": {}

   }

   }

   }

   }
   ```

---

### [Córtecs](#córtecs)

1. Dirígete a la [consola de Cortecs](https://cortecs.ai/), crea una cuenta y genera una clave API.
2. Ejecute el comando `/connect` y busque **Cortecs**.

   ```
   /connect
   ```
3. Ingrese su clave Cortecs API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *Kimi K2 Instruct*.

   ```
   /models
   ```

---

### [DeepSeek](#deepseek)

1. Dirígete a la [consola de DeepSeek](https://platform.deepseek.com/), crea una cuenta y haz clic en **Crear nueva clave API**.
2. Ejecute el comando `/connect` y busque **DeepSeek**.

   ```
   /connect
   ```
3. Ingrese su clave DeepSeek API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo de DeepSeek como *DeepSeek Reasoner*.

   ```
   /models
   ```

---

### [Deep Infra](#deep-infra)

1. Dirígete al [panel de Deep Infra](https://deepinfra.com/dash), crea una cuenta y genera una clave API.
2. Ejecute el comando `/connect` y busque **Deep Infra**.

   ```
   /connect
   ```
3. Ingrese su clave Deep Infra API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo.

   ```
   /models
   ```

---

### [Firmware](#firmware)

1. Dirígete al [Panel de firmware](https://app.firmware.ai/signup), crea una cuenta y genera una clave API.
2. Ejecute el comando `/connect` y busque **Firmware**.

   ```
   /connect
   ```
3. Ingrese su clave de firmware API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo.

   ```
   /models
   ```

---

### [Fireworks AI](#fireworks-ai)

1. Dirígete a la [Consola de Fireworks AI](https://app.fireworks.ai/), crea una cuenta y haz clic en **Crear clave API**.
2. Ejecute el comando `/connect` y busque **Fireworks AI**.

   ```
   /connect
   ```
3. Ingrese su clave API de AI de Fireworks.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *Kimi K2 Instruct*.

   ```
   /models
   ```

---

### [GitLab Duo](#gitlab-duo)

GitLab Duo proporciona chat agente basado en IA con capacidades de llamada de herramientas nativas a través del proxy Anthropic de GitLab.

1. Ejecute el comando `/connect` y seleccione GitLab.

   ```
   /connect
   ```
2. Elija su método de autenticación:

   ```
   ┌ Select auth method

   │

   │ OAuth (Recommended)

   │ Personal Access Token

   │

   └
   ```

   #### [Usando OAuth (recomendado)](#usando-oauth-recomendado)

   Seleccione **OAuth** y su navegador se abrirá para autorización.

   #### [Uso del token de acceso personal](#uso-del-token-de-acceso-personal)

   1. Vaya a [GitLab Configuración de usuario > Tokens de acceso](https://gitlab.com/-/user_settings/personal_access_tokens)
   2. Haga clic en **Agregar nuevo token**
   3. Nombre: `OpenCode`, Alcances: `api`
   4. Copie el token (comienza con `glpat-`)
   5. Introdúcelo en la terminal.
3. Ejecute el comando `/models` para ver los modelos disponibles.

   ```
   /models
   ```

   Hay tres modelos basados ​​en Claude disponibles:

   * **duo-chat-haiku-4-5** (predeterminado) - Respuestas rápidas para tareas rápidas
   * **duo-chat-sonnet-4-5** - Rendimiento equilibrado para la mayoría de los flujos de trabajo
   * **duo-chat-opus-4-5** - Más capaz para análisis complejos

##### [Autohospedado GitLab](#autohospedado-gitlab)

Para instancias GitLab autohospedadas:

Ventana de terminal

```
export GITLAB_INSTANCE_URL=https://gitlab.company.com

export GITLAB_TOKEN=glpat-...
```

Si su instancia ejecuta una puerta de enlace AI personalizada:

Ventana de terminal

```
GITLAB_AI_GATEWAY_URL=https://ai-gateway.company.com
```

O agregue a su perfil de bash:

~/.bash\_profile

```
export GITLAB_INSTANCE_URL=https://gitlab.company.com

export GITLAB_AI_GATEWAY_URL=https://ai-gateway.company.com

export GITLAB_TOKEN=glpat-...
```

##### [OAuth para instancias autohospedadas](#oauth-para-instancias-autohospedadas)

Para que Oauth funcione para su instancia autohospedada, debe crear
una nueva aplicación (Configuración → Aplicaciones) con el
URL de devolución de llamada `http://127.0.0.1:8080/callback` y siguientes ámbitos:

* api (Acceda al API en su nombre)
* read\_user (Lee tu información personal)
* read\_repository (Permite acceso de solo lectura al repositorio)

Luego exponga el ID de la aplicación como variable de entorno:

Ventana de terminal

```
export GITLAB_OAUTH_CLIENT_ID=your_application_id_here
```

Más documentación en la página de inicio de [opencode-gitlab-auth](https://www.npmjs.com/package/opencode-gitlab-auth).

##### [Configuración](#configuración-1)

Personalizar a través de `opencode.json`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"gitlab": {

"options": {

"instanceUrl": "https://gitlab.com"

}

}

}

}
```

##### [Herramientas de API de GitLab (opcionales, pero muy recomendables)](#herramientas-de-api-de-gitlab-opcionales-pero-muy-recomendables)

Para acceder a herramientas GitLab (solicitudes de fusión, problemas, canalizaciones, CI/CD, etc.):

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"plugin": ["opencode-gitlab-plugin"]

}
```

Este complemento proporciona capacidades integrales de administración del repositorio GitLab que incluyen revisiones de MR, seguimiento de problemas, monitoreo de canalizaciones y más.

---

### [GitHub Copilot](#github-copilot)

Para utilizar su suscripción GitHub Copilot con opencode:

1. Ejecute el comando `/connect` y busque GitHub Copilot.

   ```
   /connect
   ```
2. Navegue hasta [github.com/login/device](https://github.com/login/device) e ingrese el código.

   ```
   ┌ Login with GitHub Copilot

   │

   │ https://github.com/login/device

   │

   │ Enter code: 8F43-6FCF

   │

   │

   └ Waiting for authorization...
   ```
3. Ahora ejecute el comando `/models` para seleccionar el modelo que desea.

   ```
   /models
   ```

---

### [Google Vertex AI](#google-vertex-ai)

Para utilizar Google Vertex AI con OpenCode:

1. Dirígete a **Model Garden** en Google Cloud Console y verifica el
   Modelos disponibles en su región.
2. Establezca las variables de entorno requeridas:

   * `GOOGLE_CLOUD_PROJECT`: tu ID de proyecto de Google Cloud
   * `VERTEX_LOCATION` (opcional): la región para Vertex AI (por defecto es `global`)
   * Autenticación (elija una):
     + `GOOGLE_APPLICATION_CREDENTIALS`: ruta al archivo clave JSON de su cuenta de servicio
     + Autenticar usando gcloud CLI: `gcloud auth application-default login`

   Configúrelos mientras ejecuta opencode.

   Ventana de terminal

   ```
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json GOOGLE_CLOUD_PROJECT=your-project-id opencode
   ```

   O agréguelos a su perfil de bash.

   ~/.bash\_profile

   ```
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

   export GOOGLE_CLOUD_PROJECT=your-project-id

   export VERTEX_LOCATION=global
   ```

3. Ejecute el comando `/models` para seleccionar el modelo que desee.

   ```
   /models
   ```

---

### [Groq](#groq)

1. Dirígete a la [consola Groq](https://console.groq.com/), haz clic en **Crear clave API** y copia la clave.
2. Ejecute el comando `/connect` y busque Groq.

   ```
   /connect
   ```
3. Ingrese la clave API para el proveedor.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar el que desee.

   ```
   /models
   ```

---

### [Hugging Face](#hugging-face)

[Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers) proporciona acceso a modelos abiertos compatibles con más de 17 proveedores.

1. Ve a [Hugging Face settings](https://huggingface.co/settings/tokens/new?ownUserPermissions=inference.serverless.write&tokenType=fineGrained) para crear un token con permisos para llamar a inference providers.
2. Ejecute el comando `/connect` y busque **Hugging Face**.

   ```
   /connect
   ```
3. Ingresa tu token de Hugging Face.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *Kimi-K2-Instruct* o *GLM-4.6*.

   ```
   /models
   ```

---

### [Helicone](#helicone)

[Helicone](https://helicone.ai) es una plataforma de observabilidad LLM que proporciona registro, monitoreo y análisis para sus aplicaciones de IA. Helicone AI Gateway enruta sus solicitudes al proveedor apropiado automáticamente según el modelo.

1. Dirígete a [Helicone](https://helicone.ai), crea una cuenta y genera una clave API desde tu panel.
2. Ejecute el comando `/connect` y busque **Helicone**.

   ```
   /connect
   ```
3. Ingrese su clave Helicone API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo.

   ```
   /models
   ```

Para obtener más proveedores y funciones avanzadas como almacenamiento en caché y limitación de velocidad, consulte la [documentación de Helicone](https://docs.helicone.ai).

#### [Configuraciones opcionales](#configuraciones-opcionales)

En caso de que vea una característica o modelo de Helicone que no esté configurado automáticamente a través de opencode, siempre podrá configurarlo usted mismo.

Aquí está el [Directorio de modelos de Helicone](https://helicone.ai/models), lo necesitará para obtener las ID de los modelos que desea agregar.

~/.config/opencode/opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"helicone": {

"npm": "@ai-sdk/openai-compatible",

"name": "Helicone",

"options": {

"baseURL": "https://ai-gateway.helicone.ai",

},

"models": {

"gpt-4o": {

// Model ID (from Helicone's model directory page)

"name": "GPT-4o", // Your own custom name for the model

},

"": {

"name": "Claude Sonnet 4",

},

},

},

},

}
```

#### [Encabezados personalizados](#encabezados-personalizados)

Helicone admite encabezados personalizados para funciones como almacenamiento en caché, seguimiento de usuarios y gestión de sesiones. Agréguelos a la configuración de su proveedor usando `options.headers`:

~/.config/opencode/opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"helicone": {

"npm": "@ai-sdk/openai-compatible",

"name": "Helicone",

"options": {

"baseURL": "https://ai-gateway.helicone.ai",

"headers": {

"Helicone-Cache-Enabled": "true",

"Helicone-User-Id": "opencode",

},

},

},

},

}
```

##### [Seguimiento de sesión](#seguimiento-de-sesión)

La función [Sesiones](https://docs.helicone.ai/features/sessions) de Helicone le permite agrupar solicitudes LLM relacionadas. Utilice el complemento [opencode-helicone-session](https://github.com/H2Shami/opencode-helicone-session) para registrar automáticamente cada conversación OpenCode como una sesión en Helicone.

Ventana de terminal

```
npm install -g opencode-helicone-session
```

Agréguelo a su configuración.

opencode.json

```
{

"plugin": ["opencode-helicone-session"]

}
```

El complemento inyecta encabezados `Helicone-Session-Id` y `Helicone-Session-Name` en sus solicitudes. En la página Sesiones de Helicone, verá cada conversación OpenCode enumerada como una sesión separada.

##### [Cabeceras comunes de Helicone](#cabeceras-comunes-de-helicone)

| Encabezado | Descripción |
| --- | --- |
| `Helicone-Cache-Enabled` | Habilitar el almacenamiento en caché de respuestas (`true`/`false`) |
| `Helicone-User-Id` | Seguimiento de métricas por usuario |
| `Helicone-Property-[Name]` | Agregar propiedades personalizadas (por ejemplo, `Helicone-Property-Environment`) |
| `Helicone-Prompt-Id` | Solicitudes asociadas con versiones rápidas |

Consulte el [Directorio de encabezados de Helicone](https://docs.helicone.ai/helicone-headers/header-directory) para conocer todos los encabezados disponibles.

---

### [llama.cpp](#llamacpp)

Puede configurar opencode para usar modelos locales a través de la utilidad llama-server de [llama.cpp](https://github.com/ggml-org/llama.cpp)

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"llama.cpp": {

"npm": "@ai-sdk/openai-compatible",

"name": "llama-server (local)",

"options": {

"baseURL": "http://127.0.0.1:8080/v1"

},

"models": {

"qwen3-coder:a3b": {

"name": "Qwen3-Coder: a3b-30b (local)",

"limit": {

"context": 128000,

"output": 65536

}

}

}

}

}

}
```

En este ejemplo:

* `llama.cpp` es el ID del proveedor personalizado. Puede ser cualquier cadena que desees.
* `npm` especifica el paquete que se utilizará para este proveedor. Aquí, `@ai-sdk/openai-compatible` se utiliza para cualquier OpenAI compatible con API.
* `name` es el nombre para mostrar del proveedor en la interfaz de usuario.
* `options.baseURL` es el punto final del servidor local.
* `models` es un mapa de ID de modelo para sus configuraciones. El nombre del modelo se mostrará en la lista de selección de modelos.

---

### [IO.NET](#ionet)

IO.NET ofrece 17 modelos optimizados para varios casos de uso:

1. Dirígete a la [consola IO.NET](https://ai.io.net/), crea una cuenta y genera una clave API.
2. Ejecute el comando `/connect` y busque **IO.NET**.

   ```
   /connect
   ```
3. Ingrese su clave IO.NET API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo.

   ```
   /models
   ```

---

### [LM Studio](#lm-studio)

Puede configurar opencode para usar modelos locales a través de LM Studio.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"lmstudio": {

"npm": "@ai-sdk/openai-compatible",

"name": "LM Studio (local)",

"options": {

"baseURL": "http://127.0.0.1:1234/v1"

},

"models": {

"google/gemma-3n-e4b": {

"name": "Gemma 3n-e4b (local)"

}

}

}

}

}
```

En este ejemplo:

* `lmstudio` es el ID del proveedor personalizado. Puede ser cualquier cadena que desees.
* `npm` especifica el paquete que se utilizará para este proveedor. Aquí, `@ai-sdk/openai-compatible` se utiliza para cualquier OpenAI compatible con API.
* `name` es el nombre para mostrar del proveedor en la interfaz de usuario.
* `options.baseURL` es el punto final del servidor local.
* `models` es un mapa de ID de modelo para sus configuraciones. El nombre del modelo se mostrará en la lista de selección de modelos.

---

### [Moonshot AI](#moonshot-ai)

Para usar Kimi K2 de Moonshot AI:

1. Dirígete a la [consola Moonshot AI](https://platform.moonshot.ai/console), crea una cuenta y haz clic en **Crear clave API**.
2. Ejecute el comando `/connect` y busque **Moonshot AI**.

   ```
   /connect
   ```
3. Ingrese su clave Moonshot API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar *Kimi K2*.

   ```
   /models
   ```

---

### [MiniMax](#minimax)

1. Dirígete a la [Consola MiniMax API](https://platform.minimax.io/login), crea una cuenta y genera una clave API.
2. Ejecute el comando `/connect` y busque **MiniMax**.

   ```
   /connect
   ```
3. Ingrese su clave MiniMax API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *M2.1*.

   ```
   /models
   ```

---

### [Nebius Token Factory](#nebius-token-factory)

1. Dirígete a la [consola de Nebius Token Factory](https://tokenfactory.nebius.com/), crea una cuenta y haz clic en **Agregar clave**.
2. Ejecute el comando `/connect` y busque **Nebius Token Factory**.

   ```
   /connect
   ```
3. Ingrese su clave API de Nebius Token Factory.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *Kimi K2 Instruct*.

   ```
   /models
   ```

---

### [Ollama](#ollama)

Puedes configurar opencode para usar modelos locales a través de Ollama.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"ollama": {

"npm": "@ai-sdk/openai-compatible",

"name": "Ollama (local)",

"options": {

"baseURL": "http://localhost:11434/v1"

},

"models": {

"llama2": {

"name": "Llama 2"

}

}

}

}

}
```

En este ejemplo:

* `ollama` es el ID del proveedor personalizado. Puede ser cualquier cadena que desees.
* `npm` especifica el paquete que se utilizará para este proveedor. Aquí, `@ai-sdk/openai-compatible` se utiliza para cualquier OpenAI compatible con API.
* `name` es el nombre para mostrar del proveedor en la interfaz de usuario.
* `options.baseURL` es el punto final del servidor local.
* `models` es un mapa de ID de modelo para sus configuraciones. El nombre del modelo se mostrará en la lista de selección de modelos.

---

### [Ollama Cloud](#ollama-cloud)

Para usar Ollama Cloud con OpenCode:

1. Dirígete a <https://ollama.com/> e inicia sesión o crea una cuenta.
2. Vaya a **Configuración** > **Claves** y haga clic en **Agregar clave API** para generar una nueva clave API.
3. Copie la clave API para usarla en OpenCode.
4. Ejecute el comando `/connect` y busque **Ollama Cloud**.

   ```
   /connect
   ```
5. Ingrese su clave Ollama Cloud API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
6. **Importante**: Antes de usar modelos en la nube en OpenCode, debe obtener la información del modelo localmente:

   Ventana de terminal

   ```
   ollama pull gpt-oss:20b-cloud
   ```
7. Ejecute el comando `/models` para seleccionar su modelo de Ollama Cloud.

   ```
   /models
   ```

---

### [OpenAI](#openai)

Recomendamos registrarse en [ChatGPT Plus o Pro](https://chatgpt.com/pricing).

1. Una vez que se haya registrado, ejecute el comando `/connect` y seleccione OpenAI.

   ```
   /connect
   ```
2. Aquí puedes seleccionar la opción **ChatGPT Plus/Pro** y se abrirá tu navegador.
   y pedirle que se autentique.

   ```
   ┌ Select auth method

   │

   │ ChatGPT Plus/Pro

   │ Manually enter API Key

   │

   └
   ```
3. Ahora todos los modelos OpenAI deberían estar disponibles cuando use el comando `/models`.

   ```
   /models
   ```

##### [Usando las teclas API](#usando-las-teclas-api-1)

Si ya tiene una clave API, puede seleccionar **Ingresar manualmente la clave API** y pegarla en su terminal.

---

### [OpenCode Zen](#opencode-zen-1)

OpenCode Zen es una lista de modelos probados y verificados proporcionada por el equipo OpenCode. [Más información](/docs/zen).

1. Inicie sesión en **[OpenCode Zen](https://opencode.ai/auth)** y haga clic en **Crear API clave**.
2. Ejecute el comando `/connect` y busque **OpenCode Zen**.

   ```
   /connect
   ```
3. Ingrese su clave OpenCode API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *Qwen 3 Coder 480B*.

   ```
   /models
   ```

---

### [OpenRouter](#openrouter)

1. Dirígete al [panel de OpenRouter](https://openrouter.ai/settings/keys), haz clic en **Crear clave API** y copia la clave.
2. Ejecute el comando `/connect` y busque OpenRouter.

   ```
   /connect
   ```
3. Ingrese la clave API para el proveedor.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Muchos modelos de OpenRouter están precargados de forma predeterminada, ejecute el comando `/models` para seleccionar el que desee.

   ```
   /models
   ```

   También puede agregar modelos adicionales a través de su configuración opencode.

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "openrouter": {

   "models": {

   "somecoolnewmodel": {}

   }

   }

   }

   }
   ```
5. También puedes personalizarlos a través de tu configuración opencode. A continuación se muestra un ejemplo de cómo especificar un proveedor.

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "openrouter": {

   "models": {

   "moonshotai/kimi-k2": {

   "options": {

   "provider": {

   "order": ["baseten"],

   "allow_fallbacks": false

   }

   }

   }

   }

   }

   }

   }
   ```

---

### [SAP AI Core](#sap-ai-core)

SAP AI Core brinda acceso a más de 40 modelos de OpenAI, Anthropic, Google, Amazon, Meta, Mistral y AI21 a través de una plataforma unificada.

1. Vaya a su [SAP BTP Cockpit](https://account.hana.ondemand.com/), navegue hasta su instancia de servicio SAP AI Core y cree una clave de servicio.

   La clave de servicio es un objeto JSON que contiene `clientid`, `clientsecret`, `url` y `serviceurls.AI_API_URL`. Puede encontrar su instancia de AI Core en **Servicios** > **Instancias y suscripciones** en BTP Cockpit.
2. Ejecute el comando `/connect` y busque **SAP AI Core**.

   ```
   /connect
   ```
3. Ingrese su clave de servicio JSON.

   ```
   ┌ Service key

   │

   │

   └ enter
   ```

   O configure la variable de entorno `AICORE_SERVICE_KEY`:

   Ventana de terminal

   ```
   AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}' opencode
   ```

   O agrégalo a tu perfil de bash:

   ~/.bash\_profile

   ```
   export AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
   ```
4. Opcionalmente, configure el ID de implementación y el grupo de recursos:

   Ventana de terminal

   ```
   AICORE_DEPLOYMENT_ID=your-deployment-id AICORE_RESOURCE_GROUP=your-resource-group opencode
   ```
5. Ejecute el comando `/models` para seleccionar entre más de 40 modelos disponibles.

   ```
   /models
   ```

---

### [STACKIT](#stackit)

STACKIT AI Model Serving proporciona un entorno de alojamiento soberano totalmente gestionado para modelos de IA, centrándose en LLM como Llama, Mistral y Qwen, con máxima soberanía de datos en infraestructura europea.

1. Diríjase al [Portal STACKIT](https://portal.stackit.cloud), navegue hasta **AI Model Serving** y cree un token de autenticación para su proyecto.
2. Ejecute el comando `/connect` y busque **STACKIT**.

   ```
   /connect
   ```
3. Ingrese su token de autenticación de STACKIT AI Model Serving.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar entre los modelos disponibles como *Qwen3-VL 235B* o *Llama 3.3 70B*.

   ```
   /models
   ```

---

### [OVHcloud AI Endpoints](#ovhcloud-ai-endpoints)

1. Dirígete al [panel de OVHcloud](https://ovh.com/manager). Navegue a la sección `Public Cloud`, `AI & Machine Learning` > `AI Endpoints` y en la pestaña `API Keys`, haga clic en **Crear una nueva clave API**.
2. Ejecute el comando `/connect` y busque **OVHcloud AI Endpoints**.

   ```
   /connect
   ```
3. Introduzca la clave API de sus OVHcloud AI Endpoints.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *gpt-oss-120b*.

   ```
   /models
   ```

---

### [Scaleway](#scaleway)

Para utilizar [API generativas de Scaleway](https://www.scaleway.com/en/docs/generative-apis/) con OpenCode:

1. Dirígete a la [Configuración de IAM de la consola Scaleway](https://console.scaleway.com/iam/api-keys) para generar una nueva clave API.
2. Ejecute el comando `/connect` y busque **Scaleway**.

   ```
   /connect
   ```
3. Ingrese su clave Scaleway API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *devstral-2-123b-instruct-2512* o *gpt-oss-120b*.

   ```
   /models
   ```

---

### [Together AI](#together-ai)

1. Dirígete a la [consola de Together AI](https://api.together.ai), crea una cuenta y haz clic en **Agregar clave**.
2. Ejecute el comando `/connect` y busque **Together AI**.

   ```
   /connect
   ```
3. Ingrese su clave Together AI API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *Kimi K2 Instruct*.

   ```
   /models
   ```

---

### [Venice AI](#venice-ai)

1. Dirígete a la [consola de Venice AI](https://venice.ai), crea una cuenta y genera una clave API.
2. Ejecute el comando `/connect` y busque **Venice AI**.

   ```
   /connect
   ```
3. Ingrese su clave Venice AI API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *Llama 3.3 70B*.

   ```
   /models
   ```

---

### [Vercel AI Gateway](#vercel-ai-gateway)

Vercel AI Gateway le permite acceder a modelos de OpenAI, Anthropic, Google, xAI y más a través de un punto final unificado. Los modelos se ofrecen a precio de lista sin margen de beneficio.

1. Dirígete al [panel de Vercel](https://vercel.com/), navega hasta la pestaña **AI Gateway** y haz clic en **API claves** para crear una nueva clave API.
2. Ejecute el comando `/connect` y busque **Vercel AI Gateway**.

   ```
   /connect
   ```
3. Ingrese su clave Vercel AI Gateway API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo.

   ```
   /models
   ```

También puede personalizar modelos a través de su configuración opencode. A continuación se muestra un ejemplo de cómo especificar el orden de enrutamiento del proveedor.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"vercel": {

"models": {

"anthropic/claude-sonnet-4": {

"options": {

"order": ["anthropic", "vertex"]

}

}

}

}

}

}
```

Algunas opciones de enrutamiento útiles:

| Opción | Descripción |
| --- | --- |
| `order` | Secuencia de proveedores para probar |
| `only` | Restringir a proveedores específicos |
| `zeroDataRetention` | Utilice únicamente proveedores con políticas de retención de datos cero |

---

### [xAI](#xai)

1. Dirígete a la [consola xAI](https://console.x.ai/), crea una cuenta y genera una clave API.
2. Ejecute el comando `/connect` y busque **xAI**.

   ```
   /connect
   ```
3. Ingrese su clave xAI API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *Grok Beta*.

   ```
   /models
   ```

---

### [Z.AI](#zai)

1. Dirígete a la [consola Z.AI API](https://z.ai/manage-apikey/apikey-list), crea una cuenta y haz clic en **Crear una nueva clave API**.
2. Ejecute el comando `/connect` y busque **Z.AI**.

   ```
   /connect
   ```

   Si está suscrito al **Plan de codificación GLM**, seleccione **Plan de codificación Z.AI**.
3. Ingrese su clave Z.AI API.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Ejecute el comando `/models` para seleccionar un modelo como *GLM-4.7*.

   ```
   /models
   ```

---

### [ZenMux](#zenmux)

1. Dirígete al [panel de ZenMux](https://zenmux.ai/settings/keys), haz clic en **Crear clave API** y copia la clave.
2. Ejecute el comando `/connect` y busque ZenMux.

   ```
   /connect
   ```
3. Ingrese la clave API para el proveedor.

   ```
   ┌ API key

   │

   │

   └ enter
   ```
4. Muchos modelos de ZenMux están precargados de forma predeterminada, ejecute el comando `/models` para seleccionar el que desee.

   ```
   /models
   ```

   También puede agregar modelos adicionales a través de su configuración opencode.

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "zenmux": {

   "models": {

   "somecoolnewmodel": {}

   }

   }

   }

   }
   ```

---

## [Proveedor personalizado](#proveedor-personalizado)

Para agregar cualquier proveedor **compatible con OpenAI** que no aparezca en el comando `/connect`:

1. Ejecute el comando `/connect` y desplácese hacia abajo hasta **Otro**.

   Ventana de terminal

   ```
   $ /connect

   ┌  Add credential

   │

   ◆  Select provider

   │  ...

   │  ● Other

   └
   ```
2. Ingrese una identificación única para el proveedor.

   Ventana de terminal

   ```
   $ /connect

   ┌  Add credential

   │

   ◇  Enter provider id

   │  myprovider

   └
   ```
3. Ingrese su clave API para el proveedor.

   Ventana de terminal

   ```
   $ /connect

   ┌  Add credential

   │

   ▲  This only stores a credential for myprovider - you will need to configure it in opencode.json, check the docs for examples.

   │

   ◇  Enter your API key

   │  sk-...

   └
   ```
4. Cree o actualice su archivo `opencode.json` en el directorio de su proyecto:

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "myprovider": {

   "npm": "@ai-sdk/openai-compatible",

   "name": "My AI ProviderDisplay Name",

   "options": {

   "baseURL": "https://api.myprovider.com/v1"

   },

   "models": {

   "my-model-name": {

   "name": "My Model Display Name"

   }

   }

   }

   }

   }
   ```

   Aquí están las opciones de configuración:

   * **npm**: paquete AI SDK para usar, `@ai-sdk/openai-compatible` para proveedores compatibles con OpenAI
   * **nombre**: nombre para mostrar en la interfaz de usuario.
   * **modelos**: Modelos disponibles.
   * **options.baseURL**: API URL del punto final.
   * **options.apiKey**: Opcionalmente, configure la clave API, si no usa autenticación.
   * **options.headers**: Opcionalmente, configure encabezados personalizados.

   Más información sobre las opciones avanzadas en el siguiente ejemplo.
5. Ejecute el comando `/models` y su proveedor y modelos personalizados aparecerán en la lista de selección.

---

##### [Ejemplo](#ejemplo)

A continuación se muestra un ejemplo de configuración de las opciones `apiKey`, `headers` y modelo `limit`.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"myprovider": {

"npm": "@ai-sdk/openai-compatible",

"name": "My AI ProviderDisplay Name",

"options": {

"baseURL": "https://api.myprovider.com/v1",

"apiKey": "{env:ANTHROPIC_API_KEY}",

"headers": {

"Authorization": "Bearer custom-token"

}

},

"models": {

"my-model-name": {

"name": "My Model Display Name",

"limit": {

"context": 200000,

"output": 65536

}

}

}

}

}

}
```

Detalles de configuración:

* **apiKey**: se configura usando la sintaxis de la variable `env`, [más información](/docs/config#env-vars).
* **encabezados**: encabezados personalizados enviados con cada solicitud.
* **limit.context**: tokens de entrada máximos que acepta el modelo.
* **limit.output**: tokens máximos que el modelo puede generar.

Los campos `limit` le permiten a OpenCode comprender cuánto contexto le queda. Los proveedores estándar los extraen de models.dev automáticamente.

---

## [Solución de problemas](#solución-de-problemas)

Si tiene problemas para configurar un proveedor, verifique lo siguiente:

1. **Verifique la configuración de autenticación**: Ejecute `opencode auth list` para ver si las credenciales
   para el proveedor se agregan a su configuración.

   Esto no se aplica a proveedores como Amazon Bedrock, que dependen de variables de entorno para su autenticación.
2. Para proveedores personalizados, verifique la configuración opencode y:

   * Asegúrese de que el ID del proveedor utilizado en el comando `/connect` coincida con el ID en su configuración opencode.
   * Se utiliza el paquete npm correcto para el proveedor. Por ejemplo, utilice `@ai-sdk/cerebras` para Cerebras. Y para todos los demás proveedores compatibles con OpenAI, utilice `@ai-sdk/openai-compatible`.
   * Verifique que se utilice el punto final API correcto en el campo `options.baseURL`.