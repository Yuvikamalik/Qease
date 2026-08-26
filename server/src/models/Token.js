import mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema(
  {
    queueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue', required: true, index: true },
    userSessionId: { type: String, trim: true, index: true, default: null },
    tokenNumber: { type: Number, required: true, min: 1 },
    displayToken: { type: String, required: true, trim: true },
    status: { type: String, enum: ['waiting', 'serving', 'completed', 'skipped', 'left'], required: true, default: 'waiting' },
    joinedAt: { type: Date, default: Date.now },
    calledAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    skippedAt: { type: Date, default: null },
    leftAt: { type: Date, default: null },
    estimatedWaitMinutes: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
)

tokenSchema.index({ queueId: 1, tokenNumber: 1 }, { unique: true })
tokenSchema.index({ queueId: 1, status: 1, tokenNumber: 1 })

export default mongoose.model('Token', tokenSchema)
