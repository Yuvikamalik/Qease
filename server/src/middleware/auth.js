import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export function getJwtSecret() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured')
  return process.env.JWT_SECRET
}

function getBearerToken(request) {
  const authorization = request.headers.authorization
  if (!authorization?.startsWith('Bearer ')) return null
  return authorization.slice(7).trim() || null
}

export async function requireAuth(request, _response, next) {
  try {
    const token = getBearerToken(request)
    if (!token) {
      const error = new Error('Authentication required')
      error.status = 401
      return next(error)
    }

    const payload = jwt.verify(token, getJwtSecret())
    const user = await User.findOne({ _id: payload.sub, active: true }).lean()
    if (!user) {
      const error = new Error('Authentication required')
      error.status = 401
      return next(error)
    }

    request.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      error.status = 401
      error.message = 'Authentication required'
    }
    next(error)
  }
}

export function requireRole(...roles) {
  return (request, _response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      const error = new Error('Insufficient permissions')
      error.status = 403
      return next(error)
    }
    next()
  }
}

export function optionalAuth(request, _response, next) {
  const token = getBearerToken(request)
  if (!token) return next()

  try {
    const payload = jwt.verify(token, getJwtSecret())
    User.findOne({ _id: payload.sub, active: true }).lean().then((user) => {
      if (user) request.user = user
      next()
    }).catch(next)
  } catch {
    next()
  }
}

export function signUserToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, getJwtSecret(), { expiresIn: '1h' })
}

export function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email || null,
    phone: user.phone || null,
    role: user.role,
    staffId: user.staffId || null,
    active: user.active,
  }
}
