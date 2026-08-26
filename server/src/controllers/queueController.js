import mongoose from 'mongoose'
import Place from '../models/Place.js'
import Queue from '../models/Queue.js'
import Service from '../models/Service.js'
import Token from '../models/Token.js'

function isValidId(value) {
  return mongoose.isValidObjectId(value)
}

function currentServingToken(queue) {
  return queue.currentNumber > 0 ? `${queue.prefix}-${queue.currentNumber}` : null
}

export async function initializeQueue(request, response, next) {
  const { placeId, serviceId } = request.body || {}
  const sessionId = request.body?.sessionId || new Date().toISOString().slice(0, 10)
  let queueKey

  try {
    if (!placeId || !serviceId || typeof sessionId !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(sessionId)) {
      return response.status(400).json({ status: 'error', message: 'placeId, serviceId, and a valid sessionId are required' })
    }

    const place = await Place.findOne({ slug: placeId, active: true }).lean()
    if (!place) {
      return response.status(404).json({ status: 'error', message: 'Place not found' })
    }

    const service = await Service.findOne({ slug: serviceId, placeId: place._id, active: true }).lean()
    if (!service) {
      return response.status(404).json({ status: 'error', message: 'Service not found' })
    }

    queueKey = `${place.slug}:${service.slug}:${sessionId}`
    const queue = await Queue.findOneAndUpdate(
      { queueKey },
      {
        $setOnInsert: {
          queueKey,
          placeId: place._id,
          serviceId: service._id,
          sessionId,
          prefix: service.prefix,
          currentNumber: 0,
          nextNumber: 1,
          status: 'active',
          paused: false,
          averageServiceTimeMinutes: service.averageServiceTimeMinutes,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean()

    response.status(200).json(queue)
  } catch (error) {
    if (error.code === 11000) {
      const queue = await Queue.findOne({ queueKey }).lean()
      if (queue) return response.status(200).json(queue)
    }
    next(error)
  }
}

export async function getQueueStatus(request, response, next) {
  try {
    if (!isValidId(request.params.queueId)) {
      return response.status(400).json({ status: 'error', message: 'Invalid queue ID' })
    }

    const queue = await Queue.findById(request.params.queueId).lean()
    if (!queue) {
      return response.status(404).json({ status: 'error', message: 'Queue not found' })
    }

    const [peopleWaiting, latestToken] = await Promise.all([
      Token.countDocuments({ queueId: queue._id, status: 'waiting' }),
      Token.findOne({ queueId: queue._id }).sort({ tokenNumber: -1 }).lean(),
    ])

    response.json({
      queueId: queue._id,
      sessionId: queue.sessionId,
      currentServingToken: currentServingToken(queue),
      latestToken,
      peopleWaiting,
      estimatedWaitMinutes: peopleWaiting * queue.averageServiceTimeMinutes,
      status: queue.status,
      paused: queue.paused,
    })
  } catch (error) {
    next(error)
  }
}

export { currentServingToken, isValidId }
