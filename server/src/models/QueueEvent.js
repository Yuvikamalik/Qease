import mongoose from 'mongoose'

const queueEventSchema = new mongoose.Schema(
  {
    queueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue', default: null, index: true },
    tokenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Token', default: null, index: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null, index: true },
    eventType: {
      type: String,
      enum: ['joined', 'called', 'completed', 'skipped', 'paused', 'resumed', 'staff_status_changed'],
      required: true,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export default mongoose.model('QueueEvent', queueEventSchema)
