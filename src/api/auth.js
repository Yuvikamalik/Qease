import { apiRequest } from './client.js'

const authStorageKey = 'qease-auth-token'

export function getAuthToken() {
  return window.localStorage.getItem(authStorageKey)
}

export function setAuthToken(token) {
  window.localStorage.setItem(authStorageKey, token)
}

export function clearAuthToken() {
  window.localStorage.removeItem(authStorageKey)
}

export async function registerUser(details) {
  const result = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(details),
  })
  setAuthToken(result.token)
  return result
}

export async function loginUser(credentials) {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  setAuthToken(result.token)
  return result
}

export function getCurrentUser() {
  return apiRequest('/auth/me', { headers: { Authorization: `Bearer ${getAuthToken()}` } })
}

export async function logoutUser() {
  try {
    if (getAuthToken()) await apiRequest('/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${getAuthToken()}` } })
  } finally {
    clearAuthToken()
  }
}
