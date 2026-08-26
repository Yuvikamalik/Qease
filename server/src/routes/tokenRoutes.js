import { Router } from 'express'
import { getToken, leaveToken } from '../controllers/tokenController.js'

const router = Router()

router.get('/tokens/:tokenId', getToken)
router.post('/tokens/:tokenId/leave', leaveToken)

export default router
