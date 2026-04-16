const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },

    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      lowercase: true,
      trim:     true,
      validate: {
        validator: validator.isEmail,
        message:   'Please provide a valid email',
      },
    },

    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select:   false,          // never returned by default
    },

    // Language preference: en | ta | hi
    language: {
      type:    String,
      enum:    ['en', 'ta', 'hi'],
      default: 'en',
    },

    // Application IDs linked to this user
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    ],

    // Profile fields (optional, collected on first use)
    phone:   { type: String, default: '' },
    aadhaar: { type: String, default: '', select: false },
    address: { type: String, default: '' },

    role: {
      type:    String,
      enum:    ['user', 'admin'],
      default: 'user',
    },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,   // adds createdAt + updatedAt
    toJSON:  { virtuals: true },
    toObject:{ virtuals: true },
  }
)

// ── Indexes ───────────────────────────────────────────────────
userSchema.index({ email: 1 })

// ── Pre-save: hash password if modified ───────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt   = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ── Instance method: compare plain password ───────────────────
userSchema.methods.matchPassword = async function (plain) {
  return bcrypt.compare(plain, this.password)
}

// ── Remove sensitive fields from JSON output ──────────────────
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.aadhaar
  return obj
}

module.exports = mongoose.model('User', userSchema)
