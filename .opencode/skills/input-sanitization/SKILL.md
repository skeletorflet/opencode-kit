---
name: input-sanitization
description: Input sanitization and validation. XSS prevention, SQL injection, CSRF, DOMPurify, Zod, parameterized queries.
---

# Input Sanitization

> Validate on client (UX). Validate and sanitize on server (security). Never trust user input.

---

## 1. Attack Vectors

| Attack | Description | Prevention |
|--------|-------------|-----------|
| **XSS** | Inject scripts via user input | Escape output, CSP, DOMPurify |
| **SQL Injection** | Inject SQL via input | Parameterized queries, ORM |
| **NoSQL Injection** | Inject operators (`$where`) | Validate + sanitize |
| **CSRF** | Forged requests | SameSite cookies, CSRF tokens |
| **Path Traversal** | `../etc/passwd` in filenames | Sanitize file paths |
| **Command Injection** | Shell commands in input | Avoid shell, use safe APIs |
| **ReDoS** | Catastrophic regex | Avoid complex regex on input |

---

## 2. Input Validation (Zod)

```ts
import { z } from "zod";

// Strict schema - reject anything not defined
const createUserSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\\s\'-]+$/, "Name contains invalid characters"),
  email: z.string().email().toLowerCase().trim(),
  age: z.number().int().min(13).max(120),
  website: z.string().url().optional(),
  role: z.enum(["user", "admin"]), // Allowlist, never freeform
});

// Express middleware
function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        error: "Validation failed",
        details: result.error.flatten(),
      });
    }
    req.body = result.data; // Replace with validated/coerced data
    next();
  };
}
```

---

## 3. XSS Prevention

```ts
// Output encoding (in templates)
// React auto-escapes JSX: {userInput} is safe
// UNSAFE: <div dangerouslySetInnerHTML={{ __html: userInput }} />

// If you must render HTML (e.g., rich text editor output):
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom"; // Server-side

const window = new JSDOM("").window;
const purify = DOMPurify(window);

const clean = purify.sanitize(userHtml, {
  ALLOWED_TAGS: ["p", "br", "b", "i", "em", "strong", "a", "ul", "ol", "li"],
  ALLOWED_ATTR: ["href", "target"],
  FORCE_HTTPS: true,
});
```

---

## 4. SQL Injection Prevention

```ts
// ❌ NEVER do this
const query = `SELECT * FROM users WHERE email = \'${email}\'`;

// ✅ Parameterized query
const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

// ✅ ORM (Prisma) - safe by default
const user = await prisma.user.findUnique({ where: { email } });

// ❌ Even with ORM, avoid raw queries with interpolation
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`; // Safe (template literal)
// vs
await prisma.$queryRawUnsafe(`SELECT * FROM users WHERE email = \'${email}\'`); // UNSAFE
```

---

## 5. File Upload Sanitization

```ts
// Sanitize filename
import { basename, extname } from "path";
import slugify from "slugify";

function sanitizeFilename(filename: string): string {
  const ext = extname(filename).toLowerCase();
  const name = basename(filename, ext);
  return slugify(name, { strict: true }) + ext;
}

// Allowlist extensions
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf"]);

function validateFileExtension(filename: string): boolean {
  const ext = extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

// Validate MIME type from content (not just header)
import { fileTypeFromBuffer } from "file-type";
const detected = await fileTypeFromBuffer(buffer);
if (!detected || !ALLOWED_MIME_TYPES.includes(detected.mime)) {
  throw new Error("Invalid file type");
}
```

---

## 6. CSRF Protection

```ts
// Express: csurf or native double-submit cookie
import { randomBytes } from "crypto";

// SameSite cookie (simplest for modern browsers)
res.cookie("session", token, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",  // Blocks cross-origin POST requests
});

// CSRF token for APIs consumed by other origins
app.use((req, res, next) => {
  if (req.method !== "GET") {
    const header = req.headers["x-csrf-token"];
    const cookie = req.cookies["csrf-token"];
    if (!header || header !== cookie) {
      return res.status(403).json({ error: "CSRF validation failed" });
    }
  }
  next();
});
```

---

## 7. Content Security Policy (CSP)

```ts
// Helmet.js
import helmet from "helmet";

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["\'self\'"],
    scriptSrc: ["\'self\'", "https://cdn.trusted.com"],
    styleSrc: ["\'self\'", "\'unsafe-inline\'"],
    imgSrc: ["\'self\'", "data:", "https:"],
    connectSrc: ["\'self\'", "https://api.myapp.com"],
    frameSrc: ["\'none\'"],
    objectSrc: ["\'none\'"],
    upgradeInsecureRequests: [],
  },
}));
```

---

## 8. Sanitization Checklist

- [ ] All inputs validated with strict schema (Zod/Joi)
- [ ] HTML output escaped or sanitized with DOMPurify
- [ ] No raw SQL string concatenation (use ORM or parameterized)
- [ ] File uploads: validate extension + MIME magic bytes
- [ ] SameSite cookie attribute set on session cookies
- [ ] CSP header configured
- [ ] Rate limiting on all write endpoints
- [ ] No secrets in URL query parameters
