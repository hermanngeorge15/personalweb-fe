import { createTraceparent } from './trace'

// Production-safe API base URL configuration
const API_BASE = import.meta.env.PROD
  ? '' // production: empty base, paths already have /api/ prefix
  : (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8891') // dev only

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const traceId = createTraceparent()

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Trace-Id': traceId,
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText} ${errorBody}`)
  }

  // Handle responses with no content (204 No Content, 202 Accepted)
  if (res.status === 204 || res.status === 202) {
    return undefined as unknown as T
  }

  // Check if response has content before parsing JSON
  const contentType = res.headers.get('content-type')
  const contentLength = res.headers.get('content-length')
  
  // Return undefined for empty responses
  if (contentLength === '0' || !contentType?.includes('application/json')) {
    return undefined as unknown as T
  }

  return (await res.json()) as T
}

// Helper for authenticated requests (merges auth headers automatically)
export async function apiAuth<T>(
  path: string,
  authHeaders: Record<string, string>,
  init?: RequestInit,
): Promise<T> {
  return api<T>(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...authHeaders,
    },
  })
}
