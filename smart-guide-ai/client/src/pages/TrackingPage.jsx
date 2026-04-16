import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Clock, ArrowLeft, RefreshCw, FileText, AlertCircle } from 'lucide-react'
import { applicationsAPI } from '../services/api'
import clsx from 'clsx'

/* ── Timeline step ─────────────────────────────────────────── */
function TimelineStep({ label, date, done, active, last }) {
  return (
    <div className="flex gap-4 relative">
      {/* Connector */}
      {!last && (
        <div className={clsx('absolute left-4 top-8 bottom-0 w-0.5', done ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700')} />
      )}
      {/* Dot */}
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-sm font-bold',
        done   && 'bg-green-500 text-white',
        active && 'bg-primary-600 text-white ring-4 ring-primary-200 dark:ring-primary-900',
        !done && !active && 'bg-slate-200 dark:bg-slate-700 text-slate-400'
      )}>
        {done ? <CheckCircle2 size={16} /> : active ? '●' : '○'}
      </div>
      {/* Text */}
      <div className="pb-6">
        <p className={clsx('font-semibold text-sm', done || active ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500')}>
          {label}
        </p>
        {date && <p className="text-xs text-slate-400 mt-0.5">{date}</p>}
        {active && <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5 font-medium">Currently processing…</p>}
      </div>
    </div>
  )
}

const TIMELINE_STEPS = [
  'Application Submitted',
  'Document Verification',
  'Field Officer Review',
  'Department Approval',
  'Certificate Issued',
]

/* ── Status map ────────────────────────────────────────────── */
const STATUS_IDX = {
  submitted:  0,
  processing: 2,
  approved:   4,
  rejected:   -1,
}

export default function TrackingPage() {
  const { id }              = useParams()
  const [app, setApp]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)

  const loadApp = () => {
    setLoading(true)
    applicationsAPI.getById(id)
      .then(res => setApp(res.data?.application))
      .catch(() => {
        // Fallback mock for demo
        setApp({
          _id:         id,
          serviceName: 'Income Certificate',
          status:      'processing',
          createdAt:   new Date(Date.now() - 86400000 * 3).toISOString(),
          formData:    { fullName: 'Demo User' },
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadApp() }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-slate-400 gap-2">
      <RefreshCw size={18} className="animate-spin" /> Loading application…
    </div>
  )

  const activeStep = STATUS_IDX[app?.status] ?? 0
  const isRejected = app?.status === 'rejected'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="glass-card overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-primary-200 text-sm mb-1">Application Tracking</p>
                <h1 className="font-display font-bold text-xl text-white">{app?.serviceName}</h1>
              </div>
              <div className="text-right">
                <p className="text-primary-200 text-xs">Reference ID</p>
                <p className="font-mono font-bold text-white">{id?.toString().toUpperCase().slice(-8)}</p>
              </div>
            </div>

            {/* Status pill */}
            <div className="mt-4">
              <span className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-bold border',
                isRejected
                  ? 'bg-red-500/20 text-red-200 border-red-400/30'
                  : app?.status === 'approved'
                  ? 'bg-green-500/20 text-green-200 border-green-400/30'
                  : 'bg-white/20 text-white border-white/30'
              )}>
                {isRejected ? '❌ Rejected' : app?.status === 'approved' ? '✅ Approved' : '🔄 ' + (app?.status || 'Submitted')}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="grid sm:grid-cols-3 gap-4 mb-6 text-sm">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Submitted On</p>
                <p className="font-semibold text-slate-800 dark:text-white flex items-center gap-1">
                  <Clock size={13} className="text-primary-500" />
                  {app?.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Applicant Name</p>
                <p className="font-semibold text-slate-800 dark:text-white">{app?.formData?.fullName || app?.formData?.headName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Expected By</p>
                <p className="font-semibold text-slate-800 dark:text-white">
                  {app?.createdAt
                    ? new Date(new Date(app.createdAt).getTime() + 10 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
                    : '—'}
                </p>
              </div>
            </div>

            {/* Timeline */}
            {isRejected ? (
              <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Application Rejected</p>
                  <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                    {app?.rejectReason || 'Your application was rejected. Please contact your local government office or reapply with correct documents.'}
                  </p>
                  <Link to={`/services/${app?.serviceSlug || ''}`} className="btn-primary text-xs py-2 px-4 mt-3 inline-block">
                    Reapply →
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                  Progress
                </h3>
                <div>
                  {TIMELINE_STEPS.map((step, i) => (
                    <TimelineStep
                      key={step}
                      label={step}
                      done={i < activeStep}
                      active={i === activeStep}
                      last={i === TIMELINE_STEPS.length - 1}
                      date={i < activeStep ? new Date(
                        new Date(app?.createdAt || Date.now()).getTime() + i * 86400000
                      ).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : null}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {app?.documents?.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                  <FileText size={15} className="text-primary-600" />
                  Submitted Documents
                </h3>
                <ul className="space-y-2">
                  {app.documents.map(doc => (
                    <li key={doc} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 size={14} className="text-green-500" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700 flex gap-3 flex-wrap">
              <button
                onClick={loadApp}
                className="btn-secondary flex items-center gap-2 text-sm py-2.5"
              >
                <RefreshCw size={14} /> Refresh Status
              </button>
              <Link to="/dashboard" className="btn-primary text-sm py-2.5">
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
