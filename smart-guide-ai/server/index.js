/**
 * Smart Guide AI — Express Backend
 */

require('dotenv').config()
const express     = require('express')
const cors        = require('cors')
const helmet      = require('helmet')
const morgan      = require('morgan')
const path        = require('path')
const rateLimit   = require('express-rate-limit')
const connectDB   = require('./utils/db')

// Routes
const authRoutes         = require('./routes/auth')
const servicesRoutes     = require('./routes/services')
const applicationsRoutes = require('./routes/applications')
const chatRoutes         = require('./routes/chat')
const uploadRoutes       = require('./routes/upload')

// Error middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// App setup
const app  = express()
const PORT = process.env.PORT || 5000

// Connect DB
connectDB()

// Security & logging
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true)
    else cb(new Error(`CORS: ${origin} not allowed`))
  },
  credentials: true,
}))

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
})

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, message: 'Chat rate limit reached. Please wait a moment.' },
})

app.use('/api', apiLimiter)
app.use('/api/chat', chatLimiter)

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Guide AI API is running',
  })
})

// API routes
app.use('/api/auth',         authRoutes)
app.use('/api/services',     servicesRoutes)
app.use('/api/applications', applicationsRoutes)
app.use('/api/chat',         chatRoutes)
app.use('/api/upload',       uploadRoutes)

// ❌ REMOVED FRONTEND SERVING BLOCK (IMPORTANT FIX)

// Error handlers
app.use(notFound)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

module.exports = app