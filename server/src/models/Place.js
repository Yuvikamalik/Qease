import mongoose from 'mongoose'

const localizedTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    hi: { type: String, required: true, trim: true },
  },
  { _id: false },
)

const placeSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    icon: { type: String, required: true, trim: true },
    name: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema, required: true },
    type: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.model('Place', placeSchema)
