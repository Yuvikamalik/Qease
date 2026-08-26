import { Router } from 'express'
import {
  callNextToken,
  completeToken,
  pauseQueue,
  resumeQueue,
  skipToken,
  updateStaffStatus,
} from '../controllers/adminQueueController.js'

const router = Router()

// Authentication and authorization must protect these staff/admin routes before production use.
router.post('/queues/:queueId/next', callNextToken)
router.post('/tokens/:tokenId/complete', completeToken)
router.post('/tokens/:tokenId/skip', skipToken)
router.post('/queues/:queueId/pause', pauseQueue)
router.post('/queues/:queueId/resume', resumeQueue)
router.patch('/staff/:staffId/status', updateStaffStatus)

export default router
