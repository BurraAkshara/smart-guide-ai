import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Clock, IndianRupee, FileCheck2, CheckCircle2,
  ChevronRight, AlertCircle, ArrowRight, Bot
} from 'lucide-react'
import { SERVICES } from '../utils/mockData'
import { useAuthStore } from '../store'
import clsx from 'clsx'

export default function ServiceDetail() {
  const { slug }           = useParams()
  const navigate           = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const service = SERVICES.find(s => s.slug === slug)

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">😕</div>
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Service not found</h2>
        <Link to="/services" className="btn-primary text-sm py-2.5">← Back to Services</Link>
      </div>
    )
  }

  const handleApply = () => {
    if (!isAuthenticated) navigate('/login', { state: { from: `/apply/${slug}` } })
    else navigate(`/apply/${slug}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40">

      {/* Breadcrumb header */}
      <div className="bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/services" className="hover:text-primary-600 transition-colors">Services</Link>
            <ChevronRight size={14} />
            <span className="text-slate-700 dark:text-slate-200 font-medium">{service.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Header card */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-3xl flex-shrink-0">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">{service.name}</h1>
                      <span className="inline-block mt-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-0.5 rounded-full">
                        {service.category}
                      </span>
                    </div>
                    {service.popular && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-100 dark:border-amber-800">
                        ⭐ Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">{service.description}</p>
                </div>
              </div>

              {/* Meta row */}
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Clock size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Processing Time</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{service.processingTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <IndianRupee size={16} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Application Fee</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{service.fees}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Required documents */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileCheck2 size={18} className="text-primary-600" />
                Required Documents
              </h2>
              <ul className="space-y-3">
                {service.documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application steps / timeline */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="text-xl">🗺️</span> Application Timeline
              </h2>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-slate-100 dark:bg-slate-700" />
                <div className="space-y-5">
                  {service.steps.map((step, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className={clsx(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10',
                        'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                      )}>
                        {i + 1}
                      </div>
                      <div className="pb-1">
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">{step.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Important note */}
            <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Ensure all uploaded documents are clear, legible, and in PDF, JPG, or PNG format (max 2MB each).
                Incomplete applications may cause delays.
              </p>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Apply card */}
            <div className="glass-card p-5 sticky top-20">
              <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Ready to apply?</h3>
              <button
                onClick={handleApply}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
              >
                Apply Now <ArrowRight size={16} />
              </button>
              {!isAuthenticated && (
                <p className="text-xs text-slate-400 text-center mt-2">
                  You'll be asked to <Link to="/login" className="text-primary-600 font-medium">sign in</Link> first
                </p>
              )}

              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 space-y-3">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quick Info</p>
                {[
                  { label: 'Steps',           value: `${service.steps.length} steps` },
                  { label: 'Documents',       value: `${service.documents.length} required` },
                  { label: 'Processing',      value: service.processingTime },
                  { label: 'Fee',             value: service.fees },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="font-medium text-slate-800 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Help card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Bot size={18} />
                <p className="font-semibold text-sm">Need help?</p>
              </div>
              <p className="text-primary-200 text-xs mb-4 leading-relaxed">
                Ask our AI assistant about this service, required documents, or how to fill the form.
              </p>
              <button
                onClick={() => {
                  // Trigger the chatbot to open — use a custom event
                  window.dispatchEvent(new CustomEvent('open-chatbot'))
                }}
                className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
              >
                Chat with AI Assistant →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
