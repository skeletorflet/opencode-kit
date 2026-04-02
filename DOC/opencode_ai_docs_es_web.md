# Web

Usando OpenCode en su navegador.

OpenCode puede ejecutarse como una aplicación web en su navegador, brindando la misma poderosa experiencia de codificación de IA sin necesidad de una terminal.

![OpenCode Web - Nueva sesión](/docs/_astro/web-homepage-new-session.BB1mEdgo_Z1AT1v3.webp)

## [Empezar](#empezar)

Inicie la interfaz web ejecutando:

Ventana de terminal

```
opencode web
```

Esto inicia un servidor local en `127.0.0.1` con un puerto disponible aleatorio y abre automáticamente OpenCode en su navegador predeterminado.

---

## [Configuración](#configuración)

Puede configurar el servidor web usando indicadores de línea de comando o en su [archivo de configuración](/docs/config).

### [Puerto](#puerto)

De forma predeterminada, OpenCode elige un puerto disponible. Puede especificar un puerto:

Ventana de terminal

```
opencode web --port 4096
```

### [Nombre de host](#nombre-de-host)

De forma predeterminada, el servidor se vincula a `127.0.0.1` (solo localhost). Para hacer que OpenCode sea accesible en su red:

Ventana de terminal

```
opencode web --hostname 0.0.0.0
```

Al usar `0.0.0.0`, OpenCode mostrará direcciones locales y de red:

```
Local access:       http://localhost:4096

Network access:     http://192.168.1.100:4096
```

### [Descubrimiento de mDNS](#descubrimiento-de-mdns)

Habilite mDNS para que su servidor sea reconocible en la red local:

Ventana de terminal

```
opencode web --mdns
```

Esto establece automáticamente el nombre de host en `0.0.0.0` y anuncia el servidor como `opencode.local`.

Puede personalizar el nombre de dominio mDNS para ejecutar varias instancias en la misma red:

Ventana de terminal

```
opencode web --mdns --mdns-domain myproject.local
```

### [CORS](#cors)

Para permitir dominios adicionales para CORS (útil para interfaces personalizadas):

Ventana de terminal

```
opencode web --cors https://example.com
```

### [Autenticación](#autenticación)

Para proteger el acceso, establezca una contraseña utilizando la variable de entorno `OPENCODE_SERVER_PASSWORD`:

Ventana de terminal

```
OPENCODE_SERVER_PASSWORD=secret opencode web
```

El nombre de usuario predeterminado es `opencode` pero se puede cambiar con `OPENCODE_SERVER_USERNAME`.

---

## [Usar la interfaz web](#usar-la-interfaz-web)

Una vez iniciada, la interfaz web proporciona acceso a sus sesiones OpenCode.

### [Sesiones](#sesiones)

Vea y administre sus sesiones desde la página de inicio. Puedes ver sesiones activas e iniciar otras nuevas.

![OpenCode Web - Sesión activa](/docs/_astro/web-homepage-active-session.BbK4Ph6e_Z1O7nO1.webp)

### [Estado del servidor](#estado-del-servidor)

Haga clic en “Ver servidores” para ver los servidores conectados y su estado.

![OpenCode Web - Ver Servidores](/docs/_astro/web-homepage-see-servers.BpCOef2l_ZB0rJd.webp)

---

## [Adjuntar una terminal](#adjuntar-una-terminal)

Puede conectar un terminal TUI a un servidor web en ejecución:

Ventana de terminal

```
# Start the web server

opencode web --port 4096

# In another terminal, attach the TUI

opencode attach http://localhost:4096
```

Esto le permite utilizar la interfaz web y el terminal simultáneamente, compartiendo las mismas sesiones y estados.

---

## [Archivo de configuración](#archivo-de-configuración)

También puede configurar los ajustes del servidor en su archivo de configuración `opencode.json`:

```
{

"server": {

"port": 4096,

"hostname": "0.0.0.0",

"mdns": true,

"cors": ["https://example.com"]

}

}
```

Los indicadores de la línea de comando tienen prioridad sobre la configuración del archivo de configuración.