const Application = require('../models/Application')
const User        = require('../models/User')

// ── POST /api/applications ────────────────────────────────────
const create = async (req, res, next) => {
  try {
    const { serviceId, serviceName, serviceSlug, formData, documents } = req.body

    if (!serviceId || !serviceName)
      return res.status(400).json({ success: false, message: 'serviceId and serviceName are required' })

    const application = await Application.create({
      user:        req.user._id,
      serviceId,
      serviceName,
      serviceSlug: serviceSlug || '',
      formData:    formData    || {},
      documents:   documents   || [],
      status:      'submitted',
      history:     [{ status: 'submitted', note: 'Application created by user' }],
    })

    // Link to user's applications array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { applications: application._id } }
    )

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/applications/my ──────────────────────────────────
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-formData -__v')

    res.json({ success: true, count: applications.length, applications })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/applications/:id ─────────────────────────────────
const getById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
    if (!application)
      return res.status(404).json({ success: false, message: 'Application not found' })

    // Ensure user owns this application (or is admin)
    if (application.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised to view this application' })

    res.json({ success: true, application })
  } catch (err) {
    next(err)
  }
}

// ── PATCH /api/applications/:id ───────────────────────────────
const update = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
    if (!application)
      return res.status(404).json({ success: false, message: 'Application not found' })

    if (application.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' })

    const allowed = ['formData', 'documents', 'status', 'remarks']
    allowed.forEach(f => {
      if (req.body[f] !== undefined) application[f] = req.body[f]
    })

    if (req.body.status) {
      application.history.push({
        status:    req.body.status,
        note:      req.body.remarks || '',
        changedAt: new Date(),
      })
    }

    await application.save()
    res.json({ success: true, application })
  } catch (err) {
    next(err)
  }
}

// ── DELETE /api/applications/:id ──────────────────────────────
const remove = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
    if (!application)
      return res.status(404).json({ success: false, message: 'Application not found' })

    if (application.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' })

    await application.deleteOne()
    res.json({ success: true, message: 'Application deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, getMyApplications, getById, update, remove }
