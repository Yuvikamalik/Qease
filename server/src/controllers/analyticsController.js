import mongoose from 'mongoose'
import Place from '../models/Place.js'
import Queue from '../models/Queue.js'
import Service from '../models/Service.js'
import Staff from '../models/Staff.js'
import Token from '../models/Token.js'

const dayPattern = /^\d{4}-\d{2}-\d{2}$/

function dayRange(date) {
  if (!date) return null
  if (!dayPattern.test(date)) return { invalid: true }
  const start = new Date(`${date}T00:00:00.000Z`)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 1)
  return { start, end }
}

function dateMatch(field, range) {
  return range ? { [field]: { $gte: range.start, $lt: range.end } } : {}
}

async function resolveFilters(request) {
  const range = dayRange(request.query.date)
  if (range?.invalid) return { invalid: true }
  let placeId
  let serviceId

  if (request.query.place) {
    const place = await Place.findOne({ slug: request.query.place }).select('_id').lean()
    if (!place) return { empty: true, range }
    placeId = place._id
  }
  if (request.query.service) {
    const service = await Service.findOne({ slug: request.query.service }).select('_id').lean()
    if (!service) return { empty: true, range }
    serviceId = service._id
  }

  return { range, placeId, serviceId }
}

function tokenMatch(filters) {
  return {
    ...dateMatch('joinedAt', filters.range),
    ...(filters.placeId || filters.serviceId ? { queueId: { $exists: true } } : {}),
  }
}

async function filteredTokenMatch(filters) {
  const match = tokenMatch(filters)
  if (!filters.placeId && !filters.serviceId) return match
  const queueIds = await Queue.find({
    ...(filters.placeId ? { placeId: filters.placeId } : {}),
    ...(filters.serviceId ? { serviceId: filters.serviceId } : {}),
  }).select('_id').lean()
  return { ...match, queueId: { $in: queueIds.map((queue) => queue._id) } }
}

export async function getAdminOverview(request, response, next) {
  try {
    const today = dayRange(new Date().toISOString().slice(0, 10))
    const [activeQueues, peopleWaiting, currentlyServing, completedToday, skippedToday, durations, pausedQueues, activeStaff] = await Promise.all([
      Queue.countDocuments({ status: 'active' }),
      Token.countDocuments({ status: 'waiting' }),
      Token.countDocuments({ status: 'serving' }),
      Token.countDocuments({ status: 'completed', ...dateMatch('completedAt', today) }),
      Token.countDocuments({ status: 'skipped', ...dateMatch('skippedAt', today) }),
      Token.aggregate([
        { $match: { status: 'completed', calledAt: { $ne: null }, joinedAt: { $ne: null }, completedAt: { $ne: null } } },
        { $group: { _id: null, averageWaitingMinutes: { $avg: { $divide: [{ $subtract: ['$calledAt', '$joinedAt'] }, 60000] } }, averageServiceMinutes: { $avg: { $divide: [{ $subtract: ['$completedAt', '$calledAt'] }, 60000] } } } },
      ]),
      Queue.countDocuments({ status: 'active', paused: true }),
      Staff.countDocuments({ active: true, status: 'available' }),
    ])

    response.json({
      activeQueues,
      peopleWaiting,
      currentlyServing,
      completedToday,
      skippedToday,
      averageWaitingMinutes: durations[0]?.averageWaitingMinutes ?? null,
      averageServiceMinutes: durations[0]?.averageServiceMinutes ?? null,
      pausedQueues,
      activeStaff,
    })
  } catch (error) {
    next(error)
  }
}

export async function getAdminAnalytics(request, response, next) {
  try {
    const filters = await resolveFilters(request)
    if (filters.invalid) return response.status(400).json({ status: 'error', message: 'date must use YYYY-MM-DD format' })
    if (filters.empty) return response.json({ totalTokens: 0, completedTokens: 0, skippedTokens: 0, averageWaitingMinutes: null, averageServiceMinutes: null, completionRate: 0, skipRate: 0, busiestServices: [], busiestHours: [], dailyTokenCounts: [] })
    const match = await filteredTokenMatch(filters)
    const [summary, busiestServices, busiestHours, dailyTokenCounts] = await Promise.all([
      Token.aggregate([
        { $match: match },
        { $group: {
          _id: null,
          totalTokens: { $sum: 1 },
          completedTokens: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          skippedTokens: { $sum: { $cond: [{ $eq: ['$status', 'skipped'] }, 1, 0] } },
          averageWaitingMinutes: { $avg: { $cond: [{ $and: [{ $ne: ['$calledAt', null] }, { $ne: ['$joinedAt', null] }] }, { $divide: [{ $subtract: ['$calledAt', '$joinedAt'] }, 60000] }, null] } },
          averageServiceMinutes: { $avg: { $cond: [{ $and: [{ $ne: ['$completedAt', null] }, { $ne: ['$calledAt', null] }] }, { $divide: [{ $subtract: ['$completedAt', '$calledAt'] }, 60000] }, null] } },
        } },
      ]),
      Token.aggregate([
        { $match: match },
        { $lookup: { from: 'queues', localField: 'queueId', foreignField: '_id', as: 'queue' } },
        { $unwind: '$queue' },
        { $lookup: { from: 'services', localField: 'queue.serviceId', foreignField: '_id', as: 'service' } },
        { $unwind: '$service' },
        { $group: { _id: '$service.slug', name: { $first: '$service.name' }, tokenCount: { $sum: 1 } } },
        { $sort: { tokenCount: -1 } },
        { $limit: 10 },
      ]),
      Token.aggregate([
        { $match: match },
        { $group: { _id: { $hour: '$joinedAt', timezone: 'UTC' }, tokenCount: { $sum: 1 } } },
        { $sort: { tokenCount: -1 } },
        { $limit: 10 },
      ]),
      Token.aggregate([
        { $match: match },
        { $group: { _id: { $dateToString: { date: '$joinedAt', format: '%Y-%m-%d', timezone: 'UTC' } }, tokenCount: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 31 },
      ]),
    ])

    const values = summary[0] || { totalTokens: 0, completedTokens: 0, skippedTokens: 0, averageWaitingMinutes: null, averageServiceMinutes: null }
    const denominator = values.totalTokens || 0
    response.json({
      totalTokens: values.totalTokens,
      completedTokens: values.completedTokens,
      skippedTokens: values.skippedTokens,
      averageWaitingMinutes: values.averageWaitingMinutes ?? null,
      averageServiceMinutes: values.averageServiceMinutes ?? null,
      completionRate: denominator ? values.completedTokens / denominator : 0,
      skipRate: denominator ? values.skippedTokens / denominator : 0,
      busiestServices,
      busiestHours,
      dailyTokenCounts,
    })
  } catch (error) {
    next(error)
  }
}

export async function getQueueHistory(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.queueId)) return response.status(400).json({ status: 'error', message: 'Invalid queue ID' })
    const queue = await Queue.findById(request.params.queueId).lean()
    if (!queue) return response.status(404).json({ status: 'error', message: 'Queue not found' })
    if (request.user.role === 'staff') {
      const assigned = await Staff.exists({ _id: request.user.staffId, active: true, placeId: queue.placeId, serviceIds: queue.serviceId })
      if (!assigned) return response.status(403).json({ status: 'error', message: 'Insufficient permissions' })
    }
    const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1)
    const limit = Math.min(100, Math.max(1, Number.parseInt(request.query.limit, 10) || 25))
    const match = { queueId: queue._id }
    const [items, total] = await Promise.all([
      Token.aggregate([
        { $match: match },
        { $sort: { tokenNumber: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { displayToken: 1, tokenNumber: 1, status: 1, joinedAt: 1, calledAt: 1, completedAt: 1, skippedAt: 1, leftAt: 1, waitingDurationMinutes: { $cond: [{ $and: ['$joinedAt', '$calledAt'] }, { $divide: [{ $subtract: ['$calledAt', '$joinedAt'] }, 60000] }, null] }, serviceDurationMinutes: { $cond: [{ $and: ['$calledAt', '$completedAt'] }, { $divide: [{ $subtract: ['$completedAt', '$calledAt'] }, 60000] }, null] } } },
      ]),
      Token.countDocuments(match),
    ])
    response.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    next(error)
  }
}

export async function getMyTokenHistory(request, response, next) {
  try {
    const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1)
    const limit = Math.min(100, Math.max(1, Number.parseInt(request.query.limit, 10) || 25))
    const match = { userId: request.user._id }
    const [items, total] = await Promise.all([
      Token.aggregate([
        { $match: match },
        { $sort: { joinedAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $lookup: { from: 'queues', localField: 'queueId', foreignField: '_id', as: 'queue' } },
        { $unwind: { path: '$queue', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'places', localField: 'queue.placeId', foreignField: '_id', as: 'place' } },
        { $unwind: { path: '$place', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'services', localField: 'queue.serviceId', foreignField: '_id', as: 'service' } },
        { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1, token: '$displayToken', place: '$place.slug', service: '$service.slug', status: 1, joinedAt: 1, calledAt: 1, completedAt: 1, skippedAt: 1, leftAt: 1 } },
      ]),
      Token.countDocuments(match),
    ])
    response.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    next(error)
  }
}
