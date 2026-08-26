import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    sessionId: { type: String, trim: true, default: null, index: true },
    tokenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Token', default: null, index: true },
    queueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue', default: null, index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'QueueEvent', default: null },
    recipientKey: { type: String, required: true, index: true },
    dedupeKey: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

notificationSchema.index({ userId: 1, createdAt: -1 })
notificationSchema.index({ sessionId: 1, createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)
