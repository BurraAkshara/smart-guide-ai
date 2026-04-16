const jwt = require('jsonwebtoken')

const SECRET  = process.env.JWT_SECRET  || 'sga_super_secret_dev_key_change_in_prod'
const EXPIRES = process.env.JWT_EXPIRES || '7d'

/**
 * Sign a JWT for a given user id
 */
const signToken = (userId) =>
  jwt.sign({ id: userId }, SECRET, { expiresIn: EXPIRES })

/**
 * Verify and decode a JWT
 */
const verifyToken = (token) =>
  jwt.verify(token, SECRET)

module.exports = { signToken, verifyToken }
