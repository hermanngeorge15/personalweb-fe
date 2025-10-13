// Production-safe API base URL configuration
const API_BASE = import.meta.env.PROD
  ? '/api' // production: relative path → goes via Nginx
  : import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8891' // dev only

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText} ${errorBody}`)
  }

  if (res.status === 204) {
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
