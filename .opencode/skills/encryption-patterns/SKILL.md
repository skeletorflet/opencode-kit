---
name: encryption-patterns
description: Encryption and data security patterns. At-rest encryption, in-transit, field-level encryption, key management, hashing.
---

# Encryption Patterns

> Encrypt data at rest, in transit, and know what you actually need to encrypt.

---

## 1. Encryption Categories

| Category | What | How |
|----------|------|-----|
| **In transit** | Network data | TLS 1.3 (HTTPS) |
| **At rest** | Stored data | Disk/DB encryption |
| **Field-level** | Specific sensitive fields | App-level AES-256-GCM |
| **End-to-end** | Client to client | Signal protocol, libsodium |

---

## 2. In Transit (TLS)

```nginx
# Nginx TLS configuration (minimum)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
```

---

## 3. Field-Level Encryption

```ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12); // 96-bit IV for GCM
  const cipher = createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag(); // GCM authentication tag

  // Format: iv:authTag:encrypted (all base64)
  return [iv, authTag, encrypted].map(b => b.toString("base64")).join(":");
}

export function decrypt(ciphertext: string): string {
  const [ivB64, authTagB64, encryptedB64] = ciphertext.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const encrypted = Buffer.from(encryptedB64, "base64");

  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");
}

// Usage
const ssn = encrypt("123-45-6789");
await db.user.update({ where: { id }, data: { ssn } });

const decrypted = decrypt(user.ssn);
```

---

## 4. Hashing (One-Way)

```ts
// Passwords: use bcrypt or argon2 (SLOW by design)
import { hash, verify } from "@node-rs/argon2";

const hash = await hash(password, { memoryCost: 19456, timeCost: 2 });
const valid = await verify(hash, input);

// Deterministic lookup hash (PII like email for lookup without exposing)
import { createHmac } from "crypto";

const HMAC_KEY = process.env.HMAC_SECRET!;

export function blindIndex(value: string): string {
  return createHmac("sha256", HMAC_KEY)
    .update(value.toLowerCase())
    .digest("hex");
}

// Store both encrypted value AND blind index for searching
await db.user.create({
  data: {
    emailEncrypted: encrypt(email),
    emailIndex: blindIndex(email),  // For WHERE lookup
  },
});

// Search by email
const user = await db.user.findUnique({
  where: { emailIndex: blindIndex(emailInput) }
});
```

---

## 5. Key Management

```
Key hierarchy:
  Master Key (KMS) → Data Encryption Key (DEK) → Encrypted Data

Envelope encryption (recommended):
  1. Generate random DEK per record/batch
  2. Encrypt data with DEK (AES-256-GCM)
  3. Encrypt DEK with master key (KMS)
  4. Store: encrypted DEK + encrypted data
  5. To decrypt: KMS decrypts DEK → DEK decrypts data

Key rotation:
  - Master key rotation: update KMS key, re-encrypt DEKs
  - Application key rotation: re-encrypt data with new key
  - Scheduled: annually at minimum, immediately if compromised

KMS providers:
  ├── AWS KMS
  ├── Google Cloud KMS
  ├── Azure Key Vault
  └── HashiCorp Vault
```

---

## 6. What to Encrypt

```
Always encrypt:
├── Passwords (hash, not encrypt)
├── SSN, passport numbers
├── Credit card numbers (better: don\'t store at all)
├── Medical records
├── Private keys, API keys
├── PII per GDPR requirements
└── Biometric data

Usually encrypt:
├── Email addresses (searchable via blind index)
├── Phone numbers
└── Date of birth

Don\'t need to encrypt:
├── Non-sensitive business data
├── Public user profiles
└── Metadata (created_at, status)
```

---

## 7. Security Checklist

- [ ] TLS 1.2+ enforced on all endpoints
- [ ] Passwords hashed with bcrypt/argon2 (never encrypted, never MD5/SHA1)
- [ ] Encryption keys stored in KMS or Vault (never in code/env)
- [ ] Key rotation process documented and tested
- [ ] Sensitive fields encrypted at field level
- [ ] Blind indexes used for searchable PII
- [ ] IV/nonce is random and never reused
- [ ] Authentication tag verified in AES-GCM
