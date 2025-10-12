import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

export async function initAuth() {
  const check = (import.meta.env.VITE_KEYCLOAK_CHECK_SSO ?? 'true') === 'true'
  const onLoad: 'check-sso' | 'login-required' = check
    ? 'check-sso'
    : 'login-required'
  await keycloak.init({
    onLoad,
    silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
  })

  // Periodically refresh token before it expires
  const refreshSeconds = 20
  setInterval(async () => {
    try {
      if (keycloak.token) {
        await keycloak.updateToken(refreshSeconds)
      }
    } catch {
      // token refresh failed; let next guard trigger login
    }
  }, 15000)
}

export async function ensureKeycloakAuth() {
  if (!keycloak.authenticated) {
    await keycloak.login({ redirectUri: location.href })
  }
}

export async function authHeader(): Promise<Record<string, string>> {
  if (!keycloak.token) return {}
  return { Authorization: `Bearer ${keycloak.token}` }
}
