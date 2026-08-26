import { Router } from 'express'
import {
  listPlaceServices,
  listPlaces,
  listServiceStaff,
} from '../controllers/catalogController.js'

const router = Router()

router.get('/places', listPlaces)
router.get('/places/:placeId/services', listPlaceServices)
router.get('/services/:serviceId/staff', listServiceStaff)

export default router
