import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { publicUser, signUserToken } from '../middleware/auth.js'

function credentialsError() {
  const error = new Error('Invalid credentials')
  error.status = 401
  return error
}

function validateIdentifier(email, phone) {
  if (typeof email !== 'string' && typeof phone !== 'string') return false
  return Boolean(email?.trim() || phone?.trim())
}

export async function register(request, response, next) {
  try {
    const { name, email, phone, password } = request.body || {}
    if (typeof name !== 'string' || name.trim().length < 1 || !validateIdentifier(email, phone) || typeof password !== 'string' || password.length < 8) {
      return response.status(400).json({ status: 'error', message: 'Name, email or phone, and a password of at least 8 characters are required' })
    }
    if (email && phone) {
      return response.status(400).json({ status: 'error', message: 'Provide email or phone, not both' })
    }

    const normalizedEmail = email?.trim().toLowerCase() || undefined
    const normalizedPhone = phone?.trim() || undefined
    const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] }).lean()
    if (existingUser) {
      return response.status(409).json({ status: 'error', message: 'An account with those details already exists' })
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'user',
    })

    response.status(201).json({ user: publicUser(user), token: signUserToken(user) })
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ status: 'error', message: 'An account with those details already exists' })
    next(error)
  }
}

export async function login(request, response, next) {
  try {
    const { email, phone, password } = request.body || {}
    if (!validateIdentifier(email, phone) || typeof password !== 'string') return next(credentialsError())
    if (email && phone) return next(credentialsError())

    const identifier = email?.trim().toLowerCase() || phone?.trim()
    const user = await User.findOne({ [email ? 'email' : 'phone']: identifier }).select('+passwordHash')
    if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) return next(credentialsError())

    response.json({ user: publicUser(user), token: signUserToken(user) })
  } catch (error) {
    next(error)
  }
}

export function me(request, response) {
  response.json({ user: publicUser(request.user) })
}

export function logout(_request, response) {
  response.status(204).send()
}
