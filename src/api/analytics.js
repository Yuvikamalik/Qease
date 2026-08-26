import { apiRequest } from './client.js'

export function getAdminOverview() {
  return apiRequest('/admin/overview')
}

export function getAdminAnalytics(filters = {}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return apiRequest(`/admin/analytics${query ? `?${query}` : ''}`)
}

export function getQueueHistory(queueId, page = 1, limit = 25) {
  return apiRequest(`/queues/${encodeURIComponent(queueId)}/history?page=${page}&limit=${limit}`)
}

export function getMyTokenHistory(page = 1, limit = 25) {
  return apiRequest(`/users/me/tokens/history?page=${page}&limit=${limit}`)
}
