const { verifyToken } = require('../utils/jwt')
const User = require('../models/User')

/**
 * Protect — verifies JWT, attaches req.user
 */
const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'Not authorised — no token' })

    const token   = auth.split(' ')[1]
    const decoded = verifyToken(token)

    const user = await User.findById(decoded.id).select('-password')
    if (!user)
      return res.status(401).json({ success: false, message: 'Token invalid — user not found' })

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token expired or invalid' })
  }
}

module.exports = { protect }
