const express = require('express')
const router  = express.Router()
const { upload, uploadFiles } = require('../controllers/uploadController')
const { protect }             = require('../middleware/authMiddleware')

// POST /api/upload — up to 5 files per request
router.post('/', protect, upload.array('files', 5), uploadFiles)

module.exports = router
