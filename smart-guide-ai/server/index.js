/**
 * Smart Guide AI — Express Backend
 * Entry point: sets up middleware, routes, DB connection
 */

require('dotenv').config()
const express     = require('express')
const cors        = require('cors')
const helmet      = require('helmet')
const morgan      = require('morgan')
const path        = require('path')
const rateLimit   = require('express-rate-limit')
const connectDB   = require('./utils/db')

// ── Route imports ─────────────────────────────────────────────
const authRoutes        = require('./routes/auth')
const servicesRoutes    = require('./routes/services')
const applicationsRoutes = require('./routes/applications')
const chatRoutes        = require('./routes/chat')
const uploadRoutes      = require('./routes/upload')

// ── Error middleware ──────────────────────────────────────────
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// ── App setup ─────────────────────────────────────────────────
const app  = express()
const PORT = process.env.PORT || 5000

// Connect MongoDB
connectDB()

// ── Security & logging ─────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── CORS ──────────────────────────────────────────────────────
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

// ── Body parser ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Rate limiting ─────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max:      100,
  message:  { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
})

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max:      20,
  message:  { success: false, message: 'Chat rate limit reached. Please wait a moment.' },
})

app.use('/api', apiLimiter)
app.use('/api/chat', chatLimiter)

// ── Static — uploaded files ───────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Guide AI API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// ── API routes ────────────────────────────────────────────────
app.use('/api/auth',         authRoutes)
app.use('/api/services',     servicesRoutes)
app.use('/api/applications', applicationsRoutes)
app.use('/api/chat',         chatRoutes)
app.use('/api/upload',       uploadRoutes)

// ── Serve React build in production ──────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist')
  app.use(express.static(clientBuild))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'))
  })
}

// ── Error handlers ────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Smart Guide AI server running on port ${PORT}`)
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`)
})

module.exports = app
