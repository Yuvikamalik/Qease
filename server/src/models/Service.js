import mongoose from 'mongoose'

const localizedTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    hi: { type: String, required: true, trim: true },
  },
  { _id: false },
)

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
    icon: { type: String, required: true, trim: true },
    name: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema, required: true },
    prefix: { type: String, required: true, trim: true, default: 'A' },
    averageServiceTimeMinutes: { type: Number, required: true, min: 0, default: 3 },
    active: { type: Boolean, default: true },
    paused: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model('Service', serviceSchema)
