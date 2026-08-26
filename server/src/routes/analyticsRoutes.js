import { Router } from 'express'
import {
  getAdminAnalytics,
  getAdminOverview,
  getMyTokenHistory,
  getQueueHistory,
} from '../controllers/analyticsController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/admin/overview', requireAuth, requireRole('admin'), getAdminOverview)
router.get('/admin/analytics', requireAuth, requireRole('admin'), getAdminAnalytics)
router.get('/queues/:queueId/history', requireAuth, requireRole('staff', 'admin'), getQueueHistory)
router.get('/users/me/tokens/history', requireAuth, getMyTokenHistory)

export default router
