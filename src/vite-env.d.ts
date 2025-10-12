/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KEYCLOAK_URL: string
  readonly VITE_KEYCLOAK_REALM: string
  readonly VITE_KEYCLOAK_CLIENT_ID: string
  readonly VITE_KEYCLOAK_CHECK_SSO?: 'true' | 'false'
  readonly VITE_API_URL?: string
  readonly VITE_API_BASE?: string
  readonly VITE_API_DEBUG?: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
