import { Router } from 'express'
import { createToken } from '../controllers/tokenController.js'
import { getQueueStatus, initializeQueue } from '../controllers/queueController.js'

const router = Router()

router.post('/queues/initialize', initializeQueue)
router.get('/queues/:queueId/status', getQueueStatus)
router.post('/queues/:queueId/tokens', createToken)

export default router
