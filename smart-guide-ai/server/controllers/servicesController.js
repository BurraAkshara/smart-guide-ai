const Service = require('../models/Service')

// ── GET /api/services ─────────────────────────────────────────
const getAll = async (req, res, next) => {
  try {
    const { category, popular, search } = req.query
    const filter = { isActive: true }

    if (category && category !== 'all') filter.category = category
    if (popular === 'true')             filter.popular   = true
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const services = await Service.find(filter)
      .select('-formFields -steps -__v')
      .sort({ popular: -1, name: 1 })

    res.json({ success: true, count: services.length, services })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/services/:id ─────────────────────────────────────
const getById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service || !service.isActive)
      return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true, service })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/services/slug/:slug ──────────────────────────────
const getBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true })
    if (!service)
      return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true, service })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/services (admin only, optional) ─────────────────
const create = async (req, res, next) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json({ success: true, service })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, getBySlug, create }
