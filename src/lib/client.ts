import { keycloak } from './keycloak'
import { Configuration } from '@/generated/runtime'
import { PostControllerApi } from '@/generated/apis/PostControllerApi'

// Production-safe API base URL configuration
function getBasePath() {
  if (import.meta.env.PROD) {
    return '/api' // production: relative path → goes via Nginx
  }
  const base = import.meta.env.VITE_API_BASE_URL
  return base && String(base).length > 0 ? String(base) : 'http://localhost:8891'
}

export function createApiConfig() {
  return new Configuration({
    basePath: getBasePath(),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    accessToken: async () => keycloak.token ?? '',
  })
}

export function getPostApi() {
  return new PostControllerApi(createApiConfig())
}


