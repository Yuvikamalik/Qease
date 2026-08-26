import mongoose from 'mongoose'

const localizedTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    hi: { type: String, required: true, trim: true },
  },
  { _id: false },
)

const staffSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    icon: { type: String, required: true, trim: true },
    name: { type: localizedTextSchema, required: true },
    role: { type: localizedTextSchema, required: true },
    status: { type: String, enum: ['available', 'busy', 'unavailable'], required: true },
    expectedAvailableAt: { type: String, trim: true, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.model('Staff', staffSchema)
