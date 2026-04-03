---
name: auth-patterns
description: Authentication and authorization patterns. JWT, sessions, OAuth 2.0, RBAC, ABAC, refresh tokens, security.
---

# Auth Patterns

> Authentication = who are you? Authorization = what can you do?

---

## 1. Strategy Selection

| Strategy | Best For | Stateless? |
|----------|---------|-----------|
| **Session + Cookie** | Traditional web, SSR | No |
| **JWT (access token)** | SPAs, mobile, stateless APIs | Yes |
| **JWT + Refresh Token** | Long-lived sessions, mobile | Yes* |
| **OAuth 2.0 (provider)** | Third-party login | Yes |
| **API Keys** | Server-to-server, dev tools | Yes |
| **Passkeys (WebAuthn)** | Passwordless modern | Yes |
| **mTLS** | Service-to-service internal | Yes |

---

## 2. JWT Architecture

```
Access Token:   Short-lived (15min)  → sent in Authorization header
Refresh Token:  Long-lived (7–30d)   → HttpOnly cookie or secure storage

Flow:
  Login → [access_token, refresh_token]
  Request → Authorization: Bearer {access_token}
  Token expires → POST /auth/refresh (with refresh_token)
  Logout → invalidate refresh_token in DB
```

```ts
// JWT payload (keep minimal)
{
  sub: "user-id",
  email: "user@example.com",
  role: "admin",
  iat: 1704067200,
  exp: 1704068100  // 15 min
}

// NEVER include: password, secret data, PII beyond necessary
```

---

## 3. Refresh Token Rotation

```
1. User sends refresh_token
2. Server validates + checks DB (not revoked)
3. Server issues NEW access_token + NEW refresh_token
4. Server revokes OLD refresh_token in DB
5. Return new tokens

Refresh token family:
  If old refresh token reused → revoke entire family
  (detects token theft)
```

---

## 4. Session Pattern

```ts
// Secure cookie setup (Express)
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: "__sess",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,   // No JS access
    secure: true,     // HTTPS only
    sameSite: "lax",  // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  },
  store: new RedisStore({ client: redis }), // Not in-memory!
}));
```

---

## 5. OAuth 2.0 Flows

| Flow | Use Case |
|------|---------|
| **Authorization Code + PKCE** | Web apps, mobile (standard) |
| **Client Credentials** | Server-to-server |
| **Device Code** | TV, CLI, limited-input devices |

```
Authorization Code + PKCE:
  1. App generates code_verifier + code_challenge
  2. Redirect to provider: ?response_type=code&code_challenge=...
  3. User authenticates at provider
  4. Provider redirects back with code
  5. App exchanges code + code_verifier for tokens
  6. App receives access_token (+ refresh_token)
```

---

## 6. RBAC (Role-Based Access Control)

```ts
// Role definitions
enum Role { VIEWER = "viewer", EDITOR = "editor", ADMIN = "admin" }

// Permission map
const permissions = {
  "posts:read":   [Role.VIEWER, Role.EDITOR, Role.ADMIN],
  "posts:write":  [Role.EDITOR, Role.ADMIN],
  "posts:delete": [Role.ADMIN],
  "users:manage": [Role.ADMIN],
};

function can(user: User, action: string): boolean {
  return permissions[action]?.includes(user.role) ?? false;
}

// Middleware
function requirePermission(action: string) {
  return (req, res, next) => {
    if (!can(req.user, action)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
```

---

## 7. ABAC (Attribute-Based Access Control)

```ts
// More granular than RBAC
function canEditPost(user: User, post: Post): boolean {
  return (
    user.id === post.authorId ||        // Own post
    user.role === "admin" ||            // Admin
    (user.role === "editor" && post.orgId === user.orgId) // Same org
  );
}
```

---

## 8. Password Security

```ts
// Hashing (bcrypt / argon2)
import { hash, verify } from "@node-rs/argon2";

// On register
const hashedPassword = await hash(password, {
  memoryCost: 19456,   // 19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
});

// On login
const valid = await verify(hashedPassword, inputPassword);

// Rules:
// - Min 8 chars, no max < 64
// - Check against HaveIBeenPwned API
// - Allow paste in password fields
// - NEVER log passwords
```

---

## 9. Security Checklist

- [ ] Tokens stored in HttpOnly cookies (not localStorage)
- [ ] CSRF protection on cookie-based auth (SameSite + token)
- [ ] Rate limit login endpoint (5 attempts / 15min)
- [ ] Account lockout or CAPTCHA after failures
- [ ] Log all auth events (login, logout, fail, password change)
- [ ] Rotate secrets on suspected compromise
- [ ] Enforce HTTPS everywhere
- [ ] Validate JWT signature AND expiry server-side always
"""