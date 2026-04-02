# Red

Configure proxies y certificados personalizados.

OpenCode admite variables de entorno de proxy estándar y certificados personalizados para entornos de red empresarial.

---

## [Proxy](#proxy)

OpenCode respeta las variables de entorno de proxy estándar.

Ventana de terminal

```
# HTTPS proxy (recommended)

export HTTPS_PROXY=https://proxy.example.com:8080

# HTTP proxy (if HTTPS not available)

export HTTP_PROXY=http://proxy.example.com:8080

# Bypass proxy for local server (required)

export NO_PROXY=localhost,127.0.0.1
```

Puede configurar el puerto y el nombre de host del servidor usando [CLI flags](/docs/cli#run).

---

### [Autenticación](#autenticación)

Si su proxy requiere autenticación básica, incluya las credenciales en la URL.

Ventana de terminal

```
export HTTPS_PROXY=http://username:password@proxy.example.com:8080
```

Para servidores proxy que requieren autenticación avanzada como NTLM o Kerberos, considere usar una puerta de enlace LLM que admita su método de autenticación.

---

## [Certificados personalizados](#certificados-personalizados)

Si su empresa utiliza CA personalizadas para conexiones HTTPS, configure OpenCode para confiar en ellas.

Ventana de terminal

```
export NODE_EXTRA_CA_CERTS=/path/to/ca-cert.pem
```

Esto funciona tanto para conexiones proxy como para acceso directo a API.