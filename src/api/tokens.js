import { apiRequest } from './client.js'

export function createToken(queueId, userSessionId) {
  return apiRequest(`/queues/${encodeURIComponent(queueId)}/tokens`, {
    method: 'POST',
    body: JSON.stringify({ userSessionId }),
  })
}

export function getToken(tokenId) {
  return apiRequest(`/tokens/${encodeURIComponent(tokenId)}`)
}

export function leaveToken(tokenId) {
  return apiRequest(`/tokens/${encodeURIComponent(tokenId)}/leave`, {
    method: 'POST',
  })
}
