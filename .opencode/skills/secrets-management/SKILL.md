---
name: secrets-management
description: Secrets management. Environment variables, Vault, AWS Secrets Manager, rotation, detection.
---

# Secrets Management

> A secret in version control is no longer a secret.

---

## 1. Secret Types

| Type | Examples |
|------|---------|
| **API Keys** | Stripe, SendGrid, Twilio |
| **DB credentials** | Username + password + host |
| **JWT secrets** | Signing keys |
| **OAuth secrets** | Client ID + Secret |
| **Certificates** | TLS, mTLS certs + private keys |
| **Encryption keys** | AES keys, RSA private keys |

---

## 2. What Never to Do

```
NEVER:
├── Commit secrets to Git (even private repos)
├── Log secrets (even partial)
├── Pass secrets in URL query params
├── Store secrets in client-side code
├── Hardcode secrets in source code
├── Use the same secret across environments
└── Use weak secrets (< 32 bytes random)
```

---

## 3. Environment Variable Hierarchy

```
Local dev:    .env.local (gitignored)
Testing:      .env.test  (gitignored) or CI secrets
Staging:      Infra secrets store (Vault, AWS SM)
Production:   Infra secrets store (Vault, AWS SM)

.env.example  ← Committed (placeholders only, no real values)
.gitignore    ← Always includes .env*, *.key, *.pem
```

---

## 4. AWS Secrets Manager

```ts
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });

async function getSecret(secretId: string): Promise<Record<string, string>> {
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretId })
  );
  return JSON.parse(response.SecretString!);
}

// Cache secrets (they don\'t change often, calls cost money)
const secretsCache = new Map<string, { value: unknown; expiresAt: number }>();

async function getCachedSecret(id: string, ttlMs = 60_000) {
  const cached = secretsCache.get(id);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const value = await getSecret(id);
  secretsCache.set(id, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

// Usage at app startup
const { DB_PASSWORD, JWT_SECRET } = await getSecret("myapp/production");
```

---

## 5. HashiCorp Vault

```bash
# Write secret
vault kv put secret/myapp/db password="supersecret"

# Read secret
vault kv get -field=password secret/myapp/db

# Dynamic secrets (Vault generates short-lived DB creds)
vault read database/creds/my-role
# → Returns: username=v-app-xyz, password=A1B2C3, lease=1h

# Renew / revoke
vault lease renew <lease_id>
vault lease revoke <lease_id>
```

```ts
// Node.js Vault client
import vault from "node-vault";

const client = vault({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
});

const { data } = await client.read("secret/data/myapp/db");
const { password } = data.data;
```

---

## 6. Secret Rotation

```
Rotation strategy:
  1. Generate new secret (new DB password, new API key)
  2. Update secret in store (Vault / AWS SM)
  3. Application reads new secret (auto-rotation or restart)
  4. Revoke old secret
  5. Verify everything still works

Rotation frequency:
├── API keys: every 90 days or on team change
├── DB passwords: every 90 days (auto-rotate with Vault)
├── JWT secrets: every 180 days (requires token invalidation plan)
└── TLS certs: before expiry (cert-manager auto-rotates)

On compromise:
  1. IMMEDIATELY revoke compromised secret
  2. Generate + deploy new secret
  3. Audit logs for unauthorized usage
  4. Notify affected parties per policy
```

---

## 7. Secret Detection in CI

```yaml
# GitHub Actions: truffleHog (scans git history)
- name: Scan for secrets
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: ${{ github.event.repository.default_branch }}

# pre-commit hook: gitleaks
- repo: https://github.com/zricethezav/gitleaks
  rev: v8.18.0
  hooks:
    - id: gitleaks

# .gitleaks.toml: customize rules
```

---

## 8. Checklist

- [ ] `.gitignore` includes `.env*`, `*.pem`, `*.key`
- [ ] `.env.example` committed (no real values)
- [ ] All envs use separate secrets (no shared keys)
- [ ] Secrets stored in Vault / AWS SM (not CI env vars for prod)
- [ ] Secret scanning enabled in CI
- [ ] pre-commit hook prevents accidental commit
- [ ] Rotation schedule documented
- [ ] Break-glass procedure for compromised secrets
