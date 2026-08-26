const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')
const authStorageKey = 'qease-auth-token'
const sessionStorageKey = 'qease-user-session-id'

function getStoredSessionId() {
  const value = window.localStorage.getItem(sessionStorageKey)
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export async function apiRequest(path, options = {}) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(window.localStorage.getItem(authStorageKey) ? { Authorization: `Bearer ${window.localStorage.getItem(authStorageKey)}` } : {}),
        ...(getStoredSessionId() ? { 'X-Queue-Session-Id': getStoredSessionId() } : {}),
        ...options.headers,
      },
      signal: controller.signal,
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(data?.message || 'The QEase service is unavailable.')
    }
    return data
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The QEase service timed out.')
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}
