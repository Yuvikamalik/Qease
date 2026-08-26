const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

export async function apiRequest(path, options = {}) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
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
