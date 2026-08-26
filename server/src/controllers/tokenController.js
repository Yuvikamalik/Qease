import Queue from '../models/Queue.js'
import QueueEvent from '../models/QueueEvent.js'
import Token from '../models/Token.js'
import { createTokenNotification, ensureApproachingNotification } from '../services/notificationService.js'
import { currentServingToken, isValidId } from './queueController.js'

function invalidTokenId(request, response) {
  if (!isValidId(request.params.tokenId)) {
    response.status(400).json({ status: 'error', message: 'Invalid token ID' })
    return true
  }
  return false
}

export async function createToken(request, response, next) {
  try {
    if (!isValidId(request.params.queueId)) {
      return response.status(400).json({ status: 'error', message: 'Invalid queue ID' })
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const queue = await Queue.findOneAndUpdate(
        { _id: request.params.queueId, status: 'active', paused: false },
        { $inc: { nextNumber: 1 } },
        { new: true },
      ).lean()

      if (!queue) {
        const existingQueue = await Queue.findById(request.params.queueId).lean()
        if (!existingQueue) {
          return response.status(404).json({ status: 'error', message: 'Queue not found' })
        }
        if (existingQueue.paused) {
          return response.status(409).json({ status: 'error', message: 'Queue is paused' })
        }
        return response.status(409).json({ status: 'error', message: 'Queue is not active' })
      }

      const tokenNumber = queue.nextNumber - 1
      const peopleAhead = await Token.countDocuments({
        queueId: queue._id,
        status: 'waiting',
        tokenNumber: { $gt: queue.currentNumber, $lt: tokenNumber },
      })

      try {
        const token = await Token.create({
          queueId: queue._id,
          userId: request.user?._id || null,
          userSessionId: typeof request.body?.userSessionId === 'string' ? request.body.userSessionId : null,
          tokenNumber,
          displayToken: `${queue.prefix}-${tokenNumber}`,
          status: 'waiting',
          estimatedWaitMinutes: peopleAhead * queue.averageServiceTimeMinutes,
        })
        const [event] = await QueueEvent.create([{ queueId: queue._id, tokenId: token._id, eventType: 'joined' }])
        await createTokenNotification(token, event, { type: 'token_joined', title: 'queueJoined', message: 'queueJoined' })
        return response.status(201).json(token)
      } catch (error) {
        if (error.code !== 11000 || attempt === 2) throw error
      }
    }
  } catch (error) {
    next(error)
  }
}

export async function getToken(request, response, next) {
  try {
    if (invalidTokenId(request, response)) return

    const token = await Token.findById(request.params.tokenId).lean()
    if (!token) {
      return response.status(404).json({ status: 'error', message: 'Token not found' })
    }

    const queue = await Queue.findById(token.queueId).lean()
    if (!queue) {
      return response.status(404).json({ status: 'error', message: 'Queue not found' })
    }

    const peopleAhead = token.status === 'waiting'
      ? await Token.countDocuments({
        queueId: queue._id,
        status: 'waiting',
        tokenNumber: { $gt: queue.currentNumber, $lt: token.tokenNumber },
      })
      : 0
    await ensureApproachingNotification(token, peopleAhead)

    response.json({
      token,
      queueId: queue._id,
      currentServingToken: currentServingToken(queue),
      peopleAhead,
      estimatedWaitMinutes: peopleAhead * queue.averageServiceTimeMinutes,
      queueStatus: queue.status,
      paused: queue.paused,
    })
  } catch (error) {
    next(error)
  }
}

export async function leaveToken(request, response, next) {
  try {
    if (invalidTokenId(request, response)) return

    const token = await Token.findOneAndUpdate(
      { _id: request.params.tokenId, status: 'waiting' },
      { $set: { status: 'left', leftAt: new Date() } },
      { new: true },
    )

    if (token) return response.json(token)

    const existingToken = await Token.findById(request.params.tokenId).lean()
    if (!existingToken) {
      return response.status(404).json({ status: 'error', message: 'Token not found' })
    }
    return response.status(409).json({ status: 'error', message: `Token cannot leave from ${existingToken.status} state` })
  } catch (error) {
    next(error)
  }
}

