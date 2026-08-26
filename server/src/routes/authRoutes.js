import { Router } from 'express'
import { login, logout, me, register } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/auth/register', register)
router.post('/auth/login', login)
router.get('/auth/me', requireAuth, me)
router.post('/auth/logout', requireAuth, logout)

export default router
