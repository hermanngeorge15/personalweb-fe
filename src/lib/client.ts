import { keycloak } from './keycloak'
import { createTraceparent } from './trace'
import { Configuration, Middleware, RequestContext } from '@/generated/runtime'
import { PostControllerApi } from '@/generated/apis/PostControllerApi'

// Production-safe API base URL configuration
function getBasePath() {
  if (import.meta.env.PROD) {
    return '' // production: empty base, paths already have /api/ prefix
  }
  const base = import.meta.env.VITE_API_BASE_URL
  return base && String(base).length > 0
    ? String(base)
    : 'http://localhost:8891'
}

// Middleware to add X-Trace-Id header to every request
const traceMiddleware: Middleware = {
  pre: async (context: RequestContext) => {
    const traceId = createTraceparent()
    context.init.headers = {
      ...context.init.headers,
      'X-Trace-Id': traceId,
    }
  },
}

export function createApiConfig() {
  return new Configuration({
    basePath: getBasePath(),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    middleware: [traceMiddleware],
    accessToken: async () => keycloak.token ?? '',
  })
}

export function getPostApi() {
  return new PostControllerApi(createApiConfig())
}
