const path   = require('path')
const fs     = require('fs')
const multer = require('multer')

// ── Ensure uploads directory exists ──────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

// ── Multer storage config ─────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
    const ext    = path.extname(file.originalname).toLowerCase()
    cb(null, `${req.user._id}-${unique}${ext}`)
  },
})

// ── File filter ───────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error('Only PDF, JPG, and PNG files are allowed'), false)
}

// ── Multer instance ───────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
})

// ── POST /api/upload ──────────────────────────────────────────
// Uses multer middleware directly in route; this is the handler
const uploadFiles = (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ success: false, message: 'No files uploaded' })

  const files = req.files.map(f => ({
    originalName: f.originalname,
    filename:     f.filename,
    size:         f.size,
    mimetype:     f.mimetype,
    url:          `/uploads/${f.filename}`,
  }))

  res.json({
    success: true,
    message: `${files.length} file(s) uploaded`,
    files,
  })
}

module.exports = { upload, uploadFiles }
