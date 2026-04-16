const express = require('express')
const router  = express.Router()
const {
  create, getMyApplications, getById, update, remove,
} = require('../controllers/applicationsController')
const { protect } = require('../middleware/authMiddleware')

// All routes require authentication
router.use(protect)

router.post('/',       create)
router.get('/my',      getMyApplications)
router.get('/:id',     getById)
router.patch('/:id',   update)
router.delete('/:id',  remove)

module.exports = router
