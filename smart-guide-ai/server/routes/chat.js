const express = require('express')
const router  = express.Router()
const { sendMessage } = require('../controllers/chatController')

// Public — no auth required for chat (rate-limited at app level)
router.post('/', sendMessage)

module.exports = router
