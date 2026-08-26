import Notification from '../models/Notification.js'
import QueueEvent from '../models/QueueEvent.js'
import Token from '../models/Token.js'

function recipientForToken(token) {
  if (token.userId) return { userId: token.userId, recipientKey: `user:${token.userId}` }
  if (token.userSessionId) return { sessionId: token.userSessionId, recipientKey: `session:${token.userSessionId}` }
  return null
}

export async function createTokenNotification(token, event, details, session) {
  const recipient = recipientForToken(token)
  if (!recipient) return null

  return Notification.findOneAndUpdate(
    { dedupeKey: `event:${event._id}:${recipient.recipientKey}` },
    {
      $setOnInsert: {
        ...recipient,
        recipientKey: recipient.recipientKey,
        tokenId: token._id,
        queueId: token.queueId,
        eventId: event._id,
        type: details.type,
        title: details.title,
        message: details.message,
        read: false,
      },
    },
    { upsert: true, new: true, session },
  )
}

export async function notifyTokenRecipients(queueId, event, details, session) {
  const tokens = await Token.find({ queueId, status: { $in: ['waiting', 'serving'] } }).session(session).lean()
  for (const token of tokens) {
    await createTokenNotification(token, event, details, session)
  }
}

export async function ensureApproachingNotification(token, peopleAhead) {
  const recipient = recipientForToken(token)
  if (!recipient || token.status !== 'waiting' || peopleAhead > 3) return null

  return Notification.findOneAndUpdate(
    { dedupeKey: `token:${token._id}:approaching:3` },
    {
      $setOnInsert: {
        ...recipient,
        recipientKey: recipient.recipientKey,
        tokenId: token._id,
        queueId: token.queueId,
        type: 'token_near',
        title: 'Your turn is approaching',
        message: `There ${peopleAhead === 1 ? 'is' : 'are'} ${peopleAhead} ${peopleAhead === 1 ? 'person' : 'people'} ahead of you.`,
        read: false,
      },
    },
    { upsert: true, new: true },
  )
}

export async function createQueueEvent(data, session) {
  const [event] = await QueueEvent.create([data], { session })
  return event
}
