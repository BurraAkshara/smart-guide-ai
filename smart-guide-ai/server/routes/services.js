const express = require('express')
const router  = express.Router()
const { getAll, getById, getBySlug, create } = require('../controllers/servicesController')
const { protect } = require('../middleware/authMiddleware')

// Public routes
router.get('/',            getAll)
router.get('/slug/:slug',  getBySlug)
router.get('/:id',         getById)

// Admin only (optional — no admin guard added for simplicity)
router.post('/', protect, create)

module.exports = router
