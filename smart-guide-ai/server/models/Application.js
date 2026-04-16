const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },

    serviceId: {
      type:     String,
      required: true,
    },

    serviceName: {
      type:     String,
      required: true,
    },

    serviceSlug: {
      type: String,
    },

    // Status lifecycle
    status: {
      type:    String,
      enum:    ['draft', 'submitted', 'processing', 'approved', 'rejected'],
      default: 'submitted',
      index:   true,
    },

    // All form field values submitted
    formData: {
      type:    mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Array of uploaded file paths (relative to /uploads)
    documents: [String],

    // Admin remarks or rejection reason
    remarks:      { type: String, default: '' },
    rejectReason: { type: String, default: '' },

    // Reference number shown to user
    referenceNumber: {
      type:   String,
      unique: true,
      sparse: true,
    },

    // Optional: expected completion date
    expectedDate: { type: Date },

    // Status history log
    history: [
      {
        status:  String,
        note:    String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

// ── Auto-generate reference number before save ────────────────
applicationSchema.pre('save', function (next) {
  if (!this.referenceNumber) {
    this.referenceNumber = `SGA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`
  }
  next()
})

// ── Push status change into history ──────────────────────────
applicationSchema.methods.updateStatus = async function (newStatus, note = '') {
  this.status = newStatus
  this.history.push({ status: newStatus, note })
  return this.save()
}

module.exports = mongoose.model('Application', applicationSchema)
