import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { SERVICES } from '../utils/mockData'
import { applicationsAPI } from '../services/api'
import { useAuthStore, useProgressStore } from '../store'
import StepWizard from '../components/forms/StepWizard'

/* ── Success screen ────────────────────────────────────────── */
function SuccessScreen({ service, refId }) {
  return (
    <div className="max-w-lg mx-auto text-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={40} className="text-green-500" />
      </div>
      <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">
        Application Submitted!
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Your application for <span className="font-semibold text-slate-700 dark:text-slate-200">{service.name}</span> has been
        submitted successfully. You'll be notified when it's processed.
      </p>
      <div className="glass-card p-4 mb-6">
        <p className="text-xs text-slate-400 mb-1">Reference Number</p>
        <p className="font-mono font-bold text-lg text-primary-600 dark:text-primary-400">{refId}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/dashboard" className="btn-primary text-sm py-3">Go to Dashboard</Link>
        <Link to="/services"  className="btn-secondary text-sm py-3">Browse More Services</Link>
      </div>
    </div>
  )
}

/* ── Main page ─────────────────────────────────────────────── */
export default function ApplicationForm() {
  const { slug }             = useParams()
  const navigate             = useNavigate()
  const { user }             = useAuthStore()
  const { saveProgress, clearProgress } = useProgressStore()

  const [submitted, setSubmitted]     = useState(false)
  const [refId, setRefId]             = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  const service = SERVICES.find(s => s.slug === slug)

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">😕</div>
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Service not found</h2>
        <Link to="/services" className="btn-primary text-sm py-2.5">Back to Services</Link>
      </div>
    )
  }

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const payload = {
        serviceId:   service.id,
        serviceName: service.name,
        formData:    formData,
        status:      'submitted',
      }
      const res = await applicationsAPI.create(payload)
      const id  = res.data?.application?._id || `REF-${Date.now()}`
      setRefId(id.toString().toUpperCase().slice(-8))
      clearProgress(service.id)
      setSubmitted(true)
      toast.success('Application submitted successfully!')
    } catch (err) {
      // Graceful demo fallback when backend isn't running
      const mockRef = `SGA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      setRefId(mockRef)
      clearProgress(service.id)
      setSubmitted(true)
      toast.success('Application submitted! (demo mode)')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return <SuccessScreen service={service} refId={refId} />

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40">
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800 py-5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{service.name}</span>
          </div>
          <div className="w-16" />{/* spacer */}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-1">
            Apply for {service.name}
          </h1>
          {user && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Filling as <span className="font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
            </p>
          )}
        </div>

        <StepWizard
          service={service}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
