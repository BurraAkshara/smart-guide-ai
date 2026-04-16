import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Clock, CheckCircle2,
  Plus, ArrowRight, RefreshCw, Sparkles, TrendingUp
} from 'lucide-react'
import { useAuthStore, useProgressStore } from '../store'
import { SERVICES, CATEGORIES } from '../utils/mockData'
import { applicationsAPI } from '../services/api'
import ServiceCard from '../components/dashboard/ServiceCard'
import clsx from 'clsx'

/* ── Status badge ──────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    submitted:   { color: 'bg-blue-50  dark:bg-blue-900/20  text-blue-600  dark:text-blue-400  border-blue-100  dark:border-blue-800',  label: 'Submitted' },
    processing:  { color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800', label: 'Processing' },
    approved:    { color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800', label: 'Approved' },
    rejected:    { color: 'bg-red-50   dark:bg-red-900/20   text-red-600   dark:text-red-400   border-red-100   dark:border-red-800',   label: 'Rejected' },
  }
  const s = map[status] || map.submitted
  return (
    <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold border', s.color)}>
      {s.label}
    </span>
  )
}

/* ── Application row ───────────────────────────────────────── */
function AppRow({ app, index }) {
  const svc = SERVICES.find(s => s.id === app.serviceId || s.name === app.serviceName)
  return (
    <div
      className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 animate-fade-up opacity-0-start"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
    >
      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-xl flex-shrink-0">
        {svc?.icon || '📄'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{app.serviceName}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
          <Clock size={11} />
          {new Date(app.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
      <StatusBadge status={app.status} />
      <Link
        to={`/track/${app._id || app.id}`}
        className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1"
      >
        Track <ArrowRight size={12} />
      </Link>
    </div>
  )
}

/* ── Stat card ─────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <div
      className="glass-card p-5 flex items-center gap-4 animate-fade-up opacity-0-start"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', color)}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}

/* ── Main Dashboard ────────────────────────────────────────── */
export default function Dashboard() {
  const { user }        = useAuthStore()
  const { applications: savedProgress } = useProgressStore()

  const [activeCategory, setCategory] = useState('all')
  const [myApps, setMyApps]           = useState([])
  const [loading, setLoading]         = useState(true)

  // Try to fetch real applications; fallback to empty list
  useEffect(() => {
    applicationsAPI.getMyApps()
      .then(res => setMyApps(res.data?.applications || []))
      .catch(() => setMyApps([]))
      .finally(() => setLoading(false))
  }, [])

  // In-progress from local store
  const inProgressKeys = Object.keys(savedProgress)

  const filteredServices = SERVICES.filter(s =>
    activeCategory === 'all' || s.category === activeCategory
  )

  const stats = [
    { icon: FileText,     label: 'Total Applications', value: myApps.length,  color: 'bg-primary-600',  delay: 0   },
    { icon: Clock,        label: 'In Progress',         value: inProgressKeys.length, color: 'bg-amber-500', delay: 80  },
    { icon: CheckCircle2, label: 'Approved',            value: myApps.filter(a => a.status === 'approved').length, color: 'bg-green-500', delay: 160 },
    { icon: TrendingUp,   label: 'Services Available',  value: SERVICES.length, color: 'bg-violet-500',  delay: 240 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40">

      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-1">
                Welcome back 👋
              </p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {user?.name || 'User'}'s Dashboard
              </h1>
            </div>
            <Link to="/services" className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} /> New Application
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* In-progress applications */}
        {inProgressKeys.length > 0 && (
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw size={16} className="text-amber-500" />
                In Progress
              </h2>
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full font-semibold">
                {inProgressKeys.length} saved
              </span>
            </div>
            <div className="p-4 grid sm:grid-cols-2 gap-3">
              {inProgressKeys.map(key => {
                const svc = SERVICES.find(s => s.id === key)
                if (!svc) return null
                return (
                  <div key={key} className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/40 rounded-xl">
                    <span className="text-2xl">{svc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{svc.name}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Step {savedProgress[key].step + 1} of {svc.steps.length}
                      </p>
                    </div>
                    <Link to={`/apply/${svc.slug}`} className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0">
                      Resume →
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* My applications table */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <LayoutDashboard size={16} className="text-primary-600" />
              My Applications
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <RefreshCw size={16} className="animate-spin" />
              Loading applications…
            </div>
          ) : myApps.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-5xl mb-4">📂</div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">No applications yet</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                Start by applying for a government service.
              </p>
              <Link to="/services" className="btn-primary text-sm py-2.5">Browse Services</Link>
            </div>
          ) : (
            <div>
              {myApps.map((app, i) => <AppRow key={app._id || i} app={app} index={i} />)}
            </div>
          )}
        </div>

        {/* Service catalogue section */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-display font-semibold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-primary-600" />
              Explore Services
            </h2>
            {/* Category filter */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={clsx(
                    'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    activeCategory === cat.id
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-300'
                  )}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} delay={i * 60} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
