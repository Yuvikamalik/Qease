import mongoose from 'mongoose'
import Notification from '../models/Notification.js'

function recipientFilter(request) {
  if (request.user) return { userId: request.user._id }
  const sessionId = request.get('x-queue-session-id')
  return sessionId ? { sessionId } : null
}

function requireRecipient(request, response) {
  const filter = recipientFilter(request)
  if (!filter) {
    response.status(401).json({ status: 'error', message: 'Authentication or queue session required' })
    return null
  }
  return filter
}

export async function listNotifications(request, response, next) {
  try {
    const filter = requireRecipient(request, response)
    if (!filter) return
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(100).lean()
    response.json(notifications)
  } catch (error) {
    next(error)
  }
}

export async function markNotificationRead(request, response, next) {
  try {
    const filter = requireRecipient(request, response)
    if (!filter) return
    if (!mongoose.isValidObjectId(request.params.notificationId)) {
      return response.status(400).json({ status: 'error', message: 'Invalid notification ID' })
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: request.params.notificationId, ...filter },
      { $set: { read: true } },
      { new: true },
    ).lean()
    if (!notification) return response.status(404).json({ status: 'error', message: 'Notification not found' })
    response.json(notification)
  } catch (error) {
    next(error)
  }
}

export async function markAllNotificationsRead(request, response, next) {
  try {
    const filter = requireRecipient(request, response)
    if (!filter) return
    const result = await Notification.updateMany({ ...filter, read: false }, { $set: { read: true } })
    response.json({ updatedCount: result.modifiedCount })
  } catch (error) {
    next(error)
  }
}
