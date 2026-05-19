/**
 * Shared fetch-based API client.
 *
 * Auth integration:
 * - Every request attaches `Authorization: Bearer ${accessToken}` from the auth store.
 * - On 401, attempts `/auth/refresh` once, then retries the original request.
 *   On second failure it logs out + redirects to /auth/login.
 *
 * The refresh logic is in-flight-aware: concurrent 401s share a single refresh promise.
 */

const baseURL = import.meta.env.VITE_API_BASE || '/api'

// ---------------------------------------------------------------------------
// Auth store + router integration (lazy-loaded to avoid Pinia bootstrap issues)
// ---------------------------------------------------------------------------

type AuthStoreLike = {
  accessToken: string | null
  refreshToken: string | null
  setAccessToken: (token: string) => void
  setTokens?: (accessToken: string, refreshToken: string) => void
  logout: () => Promise<void> | void
}

let authStoreGetter: (() => AuthStoreLike) | null = null
let routerPushFn: ((path: string) => void) | null = null

export function registerAuthStore(getter: () => AuthStoreLike) {
  authStoreGetter = getter
}

export function registerRouterPush(push: (path: string) => void) {
  routerPushFn = push
}

// ---------------------------------------------------------------------------
// Token refresh (in-flight-aware)
// ---------------------------------------------------------------------------

let refreshInFlight: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const auth = authStoreGetter?.()
  if (!auth?.refreshToken) return null

  if (!refreshInFlight) {
    refreshInFlight = fetchJSON<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken: auth.refreshToken }),
        // Skip auth injection + retry for this internal call
        _skipAuth: true,
      },
    )
      .then((data) => {
        const store = authStoreGetter?.()
        if (store?.setTokens) {
          store.setTokens(data.accessToken, data.refreshToken)
        } else {
          store?.setAccessToken(data.accessToken)
        }
        return data.accessToken
      })
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null
      })
  }

  return refreshInFlight
}

// ---------------------------------------------------------------------------
// Request options
// ---------------------------------------------------------------------------

type FetchOptions = RequestInit & {
  /** Timeout in milliseconds (default: 30 000). */
  timeout?: number
  /** Internal flag — skips auth header injection and 401 retry. */
  _skipAuth?: boolean
  /** Internal flag — marks that a 401 retry has already been attempted. */
  _retried?: boolean
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

async function coreFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeout = 30_000, _skipAuth = false, _retried = false, ...init } = options

  // Merge default + auth headers
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  })

  if (!_skipAuth) {
    const auth = authStoreGetter?.()
    if (auth?.accessToken) {
      headers.set('Authorization', `Bearer ${auth.accessToken}`)
    }
  }

  // Timeout via AbortController
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
    })
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new ApiClientError('TIMEOUT', `Request timed out after ${timeout}ms`)
    }
    throw new ApiClientError('NETWORK_ERROR', (err as Error).message || 'Network request failed')
  } finally {
    clearTimeout(timer)
  }

  // 401 handling + single retry
  if (response.status === 401 && !_skipAuth && !_retried) {
    const newToken = await refreshAccessToken()

    if (!newToken) {
      const auth = authStoreGetter?.()
      await auth?.logout()
      routerPushFn?.('/auth/login')
      throw new ApiClientError('UNAUTHORIZED', 'Session expired.')
    }

    return coreFetch(url, {
      ...options,
      _retried: true,
      headers: {
        ...(init.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${newToken}`,
      },
    })
  }

  return response
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * Fetch and parse a JSON response. Throws `ApiClientError` on non-2xx status.
 */
export async function fetchJSON<T>(url: string, options: FetchOptions = {}): Promise<T> {
  // Prefix relative paths with baseURL
  const fullURL = url.startsWith('http') ? url : `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`

  const response = await coreFetch(fullURL, options)

  let body: unknown
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    body = await response.json()
  } else {
    body = await response.text()
  }

  if (!response.ok) {
    const errorPayload = (body as { error?: ApiError } | undefined)?.error
    throw new ApiClientError(
      errorPayload?.code ?? 'HTTP_ERROR',
      errorPayload?.message ?? `HTTP ${response.status}`,
      errorPayload?.details,
      response.status,
    )
  }

  return body as T
}

/** Convenience wrappers matching common usage patterns. */
export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) =>
    fetchJSON<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data?: unknown, options?: FetchOptions) =>
    fetchJSON<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(url: string, data?: unknown, options?: FetchOptions) =>
    fetchJSON<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T>(url: string, data?: unknown, options?: FetchOptions) =>
    fetchJSON<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T>(url: string, options?: FetchOptions) =>
    fetchJSON<T>(url, { ...options, method: 'DELETE' }),
}

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

export type ApiError = {
  code: string
  message: string
  details?: Record<string, unknown>
}

export class ApiClientError extends Error implements ApiError {
  readonly code: string
  readonly details?: Record<string, unknown>
  readonly status?: number

  constructor(
    code: string,
    message: string,
    details?: Record<string, unknown>,
    status?: number,
  ) {
    super(message)
    this.name = 'ApiClientError'
    this.code = code
    this.details = details
    this.status = status
  }
}

/**
 * Extracts a normalised `ApiError` from anything thrown by `fetchJSON`.
 * Drop-in replacement for the old `unwrapError`.
 */
export function unwrapError(err: unknown): ApiError {
  if (err instanceof ApiClientError) {
    return { code: err.code, message: err.message, details: err.details }
  }
  return {
    code: 'UNKNOWN_ERROR',
    message: err instanceof Error ? err.message : 'Något gick fel.',
  }
}