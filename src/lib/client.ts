import { keycloak } from './keycloak'
import { Configuration } from '@/generated/runtime'
import { PostControllerApi } from '@/generated/apis/PostControllerApi'

function getBasePath() {
  const base = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE
  return base && String(base).length > 0 ? String(base) : undefined
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


