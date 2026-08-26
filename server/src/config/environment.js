const localOrigins = new Set(['http://localhost:5173', 'http://127.0.0.1:5173'])

export function getPort() {
  const port = Number(process.env.PORT || 5000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535')
  }
  return port
}

export function getAllowedOrigin(origin) {
  const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '')
  if (process.env.NODE_ENV === 'production' && !frontendUrl) {
    throw new Error('FRONTEND_URL is required in production')
  }
  if (!origin || localOrigins.has(origin) || (frontendUrl && origin === frontendUrl)) return true
  return false
}

export function validateEnvironment() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured')
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured')
  if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) throw new Error('FRONTEND_URL is required in production')
  return getPort()
}
