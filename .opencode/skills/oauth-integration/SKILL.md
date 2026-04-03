---
name: oauth-integration
description: OAuth 2.0 integration patterns. Social login, third-party APIs, token storage, refresh, PKCE.
---

# OAuth Integration

> Don\'t reinvent auth. Let the provider handle it.

---

## 1. OAuth 2.0 Flow (Authorization Code + PKCE)

```
1. Your app generates:
   code_verifier = random 64-char string
   code_challenge = BASE64URL(SHA256(code_verifier))

2. Redirect user to provider:
   GET https://provider.com/oauth/authorize?
     response_type=code
     &client_id=YOUR_CLIENT_ID
     &redirect_uri=https://yourapp.com/callback
     &scope=read:user email
     &state=random_state_value
     &code_challenge=xyz
     &code_challenge_method=S256

3. Provider redirects to:
   https://yourapp.com/callback?code=AUTH_CODE&state=same_state

4. Your server exchanges code:
   POST https://provider.com/oauth/token
   { code, code_verifier, client_id, client_secret, redirect_uri }
   → { access_token, refresh_token, expires_in }
```

---

## 2. Auth.js (NextAuth) Provider Setup

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: "read:user user:email repo" }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Store provider access token
      if (account) {
        token.providerAccessToken = account.access_token;
        token.providerRefreshToken = account.refresh_token;
        token.providerTokenExpiry = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      session.providerAccessToken = token.providerAccessToken;
      return session;
    },
  },
});
```

---

## 3. Third-Party API Integration (Accessing User\'s Resources)

```ts
// Using provider access token to call their API
async function getGitHubRepos(accessToken: string) {
  const res = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  return res.json();
}

// In Next.js server action
export async function fetchUserRepos() {
  const session = await auth();
  if (!session?.providerAccessToken) throw new Error("Not authenticated");

  return getGitHubRepos(session.providerAccessToken);
}
```

---

## 4. Token Storage

```
Where to store tokens:
├── Server-side session (HttpOnly cookie) ← BEST for web
├── Database (encrypted) ← for long-lived integrations
├── In-memory only ← acceptable for short sessions
└── localStorage ← AVOID (XSS vulnerable)

Database storage for long-lived integrations:
model OAuthToken {
  id           String   @id
  userId       String
  provider     String   // github, google, slack
  accessToken  String   // encrypted
  refreshToken String?  // encrypted
  expiresAt    DateTime?
  scope        String
}
```

---

## 5. Token Refresh

```ts
async function getValidToken(userId: string, provider: string): Promise<string> {
  const stored = await db.oauthToken.findUnique({
    where: { userId_provider: { userId, provider } }
  });

  if (!stored) throw new Error("Not connected");

  // Check if expired (with 5min buffer)
  if (stored.expiresAt && stored.expiresAt < new Date(Date.now() + 5 * 60_000)) {
    const refreshed = await refreshToken(provider, decrypt(stored.refreshToken!));
    await db.oauthToken.update({
      where: { id: stored.id },
      data: {
        accessToken: encrypt(refreshed.access_token),
        expiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
      },
    });
    return refreshed.access_token;
  }

  return decrypt(stored.accessToken);
}
```

---

## 6. Common Provider Scopes

| Provider | Scope | Access |
|----------|-------|--------|
| GitHub | `read:user email` | Profile + email |
| GitHub | `repo` | Repositories |
| Google | `profile email` | Basic profile |
| Google | `https://www.googleapis.com/auth/gmail.readonly` | Read email |
| Slack | `chat:write` | Post messages |
| Slack | `channels:read` | List channels |

---

## 7. Disconnect / Revoke

```ts
// Revoke provider token
async function disconnectIntegration(userId: string, provider: string) {
  const token = await getOAuthToken(userId, provider);

  // Revoke with provider
  await fetch(`https://api.provider.com/oauth/revoke`, {
    method: "POST",
    body: new URLSearchParams({ token: token.accessToken }),
  });

  // Remove from DB
  await db.oauthToken.delete({
    where: { userId_provider: { userId, provider } }
  });
}
```
