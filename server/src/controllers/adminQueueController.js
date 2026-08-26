import mongoose from 'mongoose'
import Queue from '../models/Queue.js'
import QueueEvent from '../models/QueueEvent.js'
import Staff from '../models/Staff.js'
import Token from '../models/Token.js'
import { createQueueEvent, createTokenNotification, notifyTokenRecipients } from '../services/notificationService.js'
import { currentServingToken, isValidId } from './queueController.js'

const staffStatuses = new Set(['available', 'busy', 'unavailable'])

function apiError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

async function withTransaction(work) {
  const session = await mongoose.startSession()
  try {
    let result
    await session.withTransaction(async () => {
      result = await work(session)
    })
    return result
  } finally {
    await session.endSession()
  }
}

async function assertQueueAccess(queue, user, session) {
  if (user.role === 'admin') return
  if (user.role !== 'staff' || !user.staffId) throw apiError(403, 'Insufficient permissions')
  const assignedStaff = await Staff.findOne({
    _id: user.staffId,
    active: true,
    placeId: queue.placeId,
    serviceIds: queue.serviceId,
  }).session(session).lean()
  if (!assignedStaff) throw apiError(403, 'Staff member is not assigned to this queue')
}

function invalidQueueId(request, response) {
  if (!isValidId(request.params.queueId)) {
    response.status(400).json({ status: 'error', message: 'Invalid queue ID' })
    return true
  }
  return false
}

function invalidTokenId(request, response) {
  if (!isValidId(request.params.tokenId)) {
    response.status(400).json({ status: 'error', message: 'Invalid token ID' })
    return true
  }
  return false
}

function invalidStaffId(request, response) {
  if (!isValidId(request.params.staffId)) {
    response.status(400).json({ status: 'error', message: 'Invalid staff ID' })
    return true
  }
  return false
}

export async function callNextToken(request, response, next) {
  try {
    if (invalidQueueId(request, response)) return

    const result = await withTransaction(async (session) => {
      const queue = await Queue.findById(request.params.queueId).session(session)
      if (!queue) throw apiError(404, 'Queue not found')
      await assertQueueAccess(queue, request.user, session)
      if (queue.status !== 'active') throw apiError(409, 'Queue is not active')
      if (queue.paused) throw apiError(409, 'Queue is paused')

      const servingToken = await Token.findOne({ queueId: queue._id, status: 'serving' }).session(session)
      if (servingToken) throw apiError(409, 'A token is already being served')

      const nextToken = await Token.findOneAndUpdate(
        { queueId: queue._id, status: 'waiting', tokenNumber: { $gt: queue.currentNumber } },
        { $set: { status: 'serving', calledAt: new Date() } },
        { sort: { tokenNumber: 1 }, new: true, session },
      )
      if (!nextToken) throw apiError(409, 'No waiting tokens available')

      queue.currentNumber = nextToken.tokenNumber
      await queue.save({ session })
      const event = await createQueueEvent({ queueId: queue._id, tokenId: nextToken._id, eventType: 'called' }, session)
      await createTokenNotification(nextToken, event, { type: 'token_called', title: 'itsYourTurn', message: 'itsYourTurn' }, session)

      return { token: nextToken.toObject(), queue: queue.toObject() }
    })

    response.json({ ...result, currentServingToken: currentServingToken(result.queue) })
  } catch (error) {
    if (error.code === 11000) return next(apiError(409, 'Another token is already being served'))
    next(error)
  }
}

export async function completeToken(request, response, next) {
  try {
    if (invalidTokenId(request, response)) return

    const token = await withTransaction(async (session) => {
      const existingToken = await Token.findById(request.params.tokenId).session(session)
      if (!existingToken) throw apiError(404, 'Token not found')
      const queue = await Queue.findById(existingToken.queueId).session(session)
      if (!queue) throw apiError(404, 'Queue not found')
      await assertQueueAccess(queue, request.user, session)
      if (existingToken.status !== 'serving') throw apiError(409, `Token cannot be completed from ${existingToken.status} state`)

      existingToken.status = 'completed'
      existingToken.completedAt = new Date()
      await existingToken.save({ session })
      const event = await createQueueEvent({ queueId: existingToken.queueId, tokenId: existingToken._id, eventType: 'completed' }, session)
      await createTokenNotification(existingToken, event, { type: 'token_completed', title: 'completed', message: 'completed' }, session)
      return existingToken.toObject()
    })

    response.json(token)
  } catch (error) {
    next(error)
  }
}

export async function skipToken(request, response, next) {
  try {
    if (invalidTokenId(request, response)) return

    const token = await withTransaction(async (session) => {
      const existingToken = await Token.findById(request.params.tokenId).session(session)
      if (!existingToken) throw apiError(404, 'Token not found')
      const queue = await Queue.findById(existingToken.queueId).session(session)
      if (!queue) throw apiError(404, 'Queue not found')
      await assertQueueAccess(queue, request.user, session)
      if (!['waiting', 'serving'].includes(existingToken.status)) {
        throw apiError(409, `Token cannot be skipped from ${existingToken.status} state`)
      }

      existingToken.status = 'skipped'
      existingToken.skippedAt = new Date()
      await existingToken.save({ session })
      const event = await createQueueEvent({ queueId: existingToken.queueId, tokenId: existingToken._id, eventType: 'skipped' }, session)
      await createTokenNotification(existingToken, event, { type: 'token_skipped', title: 'queueLeft', message: 'queueLeft' }, session)
      return existingToken.toObject()
    })

    response.json(token)
  } catch (error) {
    next(error)
  }
}

export async function pauseQueue(request, response, next) {
  try {
    if (invalidQueueId(request, response)) return

    const queue = await withTransaction(async (session) => {
      const existingQueue = await Queue.findById(request.params.queueId).session(session)
      if (!existingQueue) throw apiError(404, 'Queue not found')
      await assertQueueAccess(existingQueue, request.user, session)
      if (existingQueue.status !== 'active') throw apiError(409, 'Queue is not active')
      if (existingQueue.paused) throw apiError(409, 'Queue is already paused')

      existingQueue.paused = true
      existingQueue.pausedAt = new Date()
      await existingQueue.save({ session })
      const event = await createQueueEvent({ queueId: existingQueue._id, eventType: 'paused' }, session)
      await notifyTokenRecipients(existingQueue._id, event, { type: 'queue_paused', title: 'queuePaused', message: 'queuePaused' }, session)
      return existingQueue.toObject()
    })

    response.json(queue)
  } catch (error) {
    next(error)
  }
}

export async function resumeQueue(request, response, next) {
  try {
    if (invalidQueueId(request, response)) return

    const queue = await withTransaction(async (session) => {
      const existingQueue = await Queue.findById(request.params.queueId).session(session)
      if (!existingQueue) throw apiError(404, 'Queue not found')
      await assertQueueAccess(existingQueue, request.user, session)
      if (existingQueue.status !== 'active') throw apiError(409, 'Queue is not active')
      if (!existingQueue.paused) throw apiError(409, 'Queue is not paused')

      existingQueue.paused = false
      existingQueue.resumedAt = new Date()
      await existingQueue.save({ session })
      const event = await createQueueEvent({ queueId: existingQueue._id, eventType: 'resumed' }, session)
      await notifyTokenRecipients(existingQueue._id, event, { type: 'queue_resumed', title: 'resumeSimulation', message: 'resumeSimulation' }, session)
      return existingQueue.toObject()
    })

    response.json(queue)
  } catch (error) {
    next(error)
  }
}

export async function updateStaffStatus(request, response, next) {
  try {
    if (invalidStaffId(request, response)) return

    const { status, expectedAvailableAt = null } = request.body || {}
    if (!staffStatuses.has(status)) {
      return response.status(400).json({ status: 'error', message: 'Status must be available, busy, or unavailable' })
    }
    if (expectedAvailableAt !== null && typeof expectedAvailableAt !== 'string') {
      return response.status(400).json({ status: 'error', message: 'expectedAvailableAt must be a string or null' })
    }

    const staff = await withTransaction(async (session) => {
      const existingStaff = await Staff.findById(request.params.staffId).session(session)
      if (!existingStaff) throw apiError(404, 'Staff member not found')
      if (request.user.role !== 'admin' && request.user.staffId?.toString() !== existingStaff._id.toString()) {
        throw apiError(403, 'Staff member can only update their own status')
      }

      existingStaff.status = status
      existingStaff.expectedAvailableAt = expectedAvailableAt
      await existingStaff.save({ session })
      await QueueEvent.create([{
        staffId: existingStaff._id,
        eventType: 'staff_status_changed',
        metadata: { status, expectedAvailableAt },
      }], { session })
      return existingStaff.toObject()
    })

    response.json(staff)
  } catch (error) {
    next(error)
  }
}
