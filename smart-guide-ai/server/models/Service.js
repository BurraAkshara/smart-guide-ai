const mongoose = require('mongoose')

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc:  { type: String, required: true },
}, { _id: false })

const fieldSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  label:     { type: String, required: true },
  type:      { type: String, default: 'text' },
  required:  { type: Boolean, default: false },
  maxLength: { type: Number },
  options:   [String],
}, { _id: false })

const serviceSchema = new mongoose.Schema(
  {
    slug: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
      trim:     true,
    },

    name: {
      type:     String,
      required: [true, 'Service name is required'],
      trim:     true,
    },

    category: {
      type: String,
      enum: ['Certificates', 'ID Services', 'Education', 'Welfare'],
      required: true,
    },

    icon: { type: String, default: '📄' },

    description: { type: String, required: true },

    processingTime: { type: String, required: true },

    fees: { type: String, required: true },

    popular: { type: Boolean, default: false },

    documents: [String],

    steps: [stepSchema],

    formFields: [fieldSchema],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

serviceSchema.index({ slug: 1 })
serviceSchema.index({ category: 1 })
serviceSchema.index({ popular: -1 })

module.exports = mongoose.model('Service', serviceSchema)
