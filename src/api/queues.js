import { apiRequest } from './client.js'

export function initializeQueue(placeId, serviceId) {
  return apiRequest('/queues/initialize', {
    method: 'POST',
    body: JSON.stringify({ placeId, serviceId }),
  })
}

export function getQueueStatus(queueId) {
  return apiRequest(`/queues/${encodeURIComponent(queueId)}/status`)
}
