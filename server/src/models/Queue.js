import mongoose from 'mongoose'

const queueSchema = new mongoose.Schema(
  {
    queueKey: { type: String, required: true, unique: true, index: true, trim: true },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    sessionId: { type: String, required: true, trim: true },
    prefix: { type: String, required: true, trim: true, default: 'A' },
    currentNumber: { type: Number, required: true, min: 0, default: 0 },
    nextNumber: { type: Number, required: true, min: 1, default: 1 },
    status: { type: String, enum: ['active', 'closed'], required: true, default: 'active' },
    paused: { type: Boolean, default: false },
    pausedAt: { type: Date, default: null },
    resumedAt: { type: Date, default: null },
    averageServiceTimeMinutes: { type: Number, required: true, min: 0, default: 3 },
  },
  { timestamps: true },
)

queueSchema.index({ placeId: 1, serviceId: 1, sessionId: 1 }, { unique: true })

export default mongoose.model('Queue', queueSchema)
