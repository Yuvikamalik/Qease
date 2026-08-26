import Place from '../models/Place.js'
import Service from '../models/Service.js'
import Staff from '../models/Staff.js'

export async function listPlaces(_request, response, next) {
  try {
    const places = await Place.find({ active: true }).sort({ slug: 1 }).lean()
    response.json(places)
  } catch (error) {
    next(error)
  }
}

export async function listPlaceServices(request, response, next) {
  try {
    const place = await Place.findOne({ slug: request.params.placeId, active: true }).lean()
    if (!place) {
      return response.status(404).json({ status: 'error', message: 'Place not found' })
    }

    const services = await Service.find({ placeId: place._id, active: true }).sort({ slug: 1 }).lean()
    response.json(services)
  } catch (error) {
    next(error)
  }
}

export async function listServiceStaff(request, response, next) {
  try {
    const service = await Service.findOne({ slug: request.params.serviceId, active: true }).lean()
    if (!service) {
      return response.status(404).json({ status: 'error', message: 'Service not found' })
    }

    const staff = await Staff.find({ serviceIds: service._id, active: true }).sort({ slug: 1 }).lean()
    response.json(staff)
  } catch (error) {
    next(error)
  }
}
