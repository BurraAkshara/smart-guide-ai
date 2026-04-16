/**
 * 404 handler — catches unmatched routes
 */
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`)
  err.statusCode = 404
  next(err)
}

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  const status  = err.statusCode || err.status || 500
  const isDev   = process.env.NODE_ENV !== 'production'

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors:  messages,
    })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ success: false, message: 'Invalid token' })
  if (err.name === 'TokenExpiredError')
    return res.status(401).json({ success: false, message: 'Token expired' })

  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack }),
  })
}

module.exports = { notFound, errorHandler }
