import { apiRequest } from './client.js'

export function getPlaces() {
  return apiRequest('/places')
}

export function getPlaceServices(placeId) {
  return apiRequest(`/places/${encodeURIComponent(placeId)}/services`)
}

export function getServiceStaff(serviceId) {
  return apiRequest(`/services/${encodeURIComponent(serviceId)}/staff`)
}
