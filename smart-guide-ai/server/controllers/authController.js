const User      = require('../models/User')
const { signToken } = require('../utils/jwt')

// ── Helper: send token + user JSON ────────────────────────────
const sendToken = (res, user, statusCode = 200) => {
  const token = signToken(user._id)
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:      user._id,
      name:     user.name,
      email:    user.email,
      language: user.language,
      role:     user.role,
    },
  })
}

// ── POST /api/auth/register ───────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, language } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' })

    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists)
      return res.status(409).json({ success: false, message: 'An account with this email already exists' })

    const user = await User.create({ name, email, password, language: language || 'en' })
    sendToken(res, user, 201)
  } catch (err) {
    next(err)
  }
}

// ── POST /api/auth/login ──────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' })

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' })

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact support.' })

    sendToken(res, user)
  } catch (err) {
    next(err)
  }
}

// ── GET /api/auth/me ──────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('applications', 'serviceName status createdAt')
    res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

// ── PATCH /api/auth/me ────────────────────────────────────────
const updateMe = async (req, res, next) => {
  try {
    const allowed = ['name', 'language', 'phone', 'address']
    const updates = {}
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f] })

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, getMe, updateMe }
