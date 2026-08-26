import { Router } from 'express'
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../controllers/notificationController.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

router.use(optionalAuth)
router.get('/notifications', listNotifications)
router.patch('/notifications/:notificationId/read', markNotificationRead)
router.patch('/notifications/read-all', markAllNotificationsRead)

export default router
