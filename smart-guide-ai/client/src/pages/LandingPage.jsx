import { Link } from 'react-router-dom'
import {
  ArrowRight, Shield, Zap, Globe, CheckCircle2,
  Star, ChevronRight, Sparkles, Users, Clock
} from 'lucide-react'
import { useLanguageStore } from '../store'
import { t } from '../utils/i18n'
import { SERVICE_TAGS, SERVICES } from '../utils/mockData'
import ServiceCard from '../components/dashboard/ServiceCard'

const STATS = [
  { label: 'Citizens Served', value: '2.4M+', icon: Users },
  { label: 'Services Available', value: '50+',   icon: Sparkles },
  { label: 'Avg Processing',  value: '7 days',  icon: Clock },
  { label: 'Success Rate',    value: '98.2%',   icon: Star },
]

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Guidance',
    desc:  'Get real-time, step-by-step help from our AI assistant for any government service.',
    color: 'from-blue-500 to-primary-600',
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    desc:  'Your data is encrypted and handled with bank-grade security protocols.',
    color: 'from-green-500 to-teal-600',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    desc:  'Access services in English, Tamil, and Hindi — more languages coming soon.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Zap,
    title: 'Fast & Simple',
    desc:  'Apply in minutes with guided forms, document checklists, and auto-fill support.',
    color: 'from-amber-500 to-orange-600',
  },
]

export default function LandingPage() {
  const { lang } = useLanguageStore()

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center bg-white dark:bg-surface-dark overflow-hidden">

        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary-500/15 via-primary-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy */}
            <div>
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 mb-6 animate-fade-up" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                <Sparkles size={14} className="text-primary-600 dark:text-primary-400" />
                <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                  AI-Powered Government Service Platform
                </span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-slate-900 dark:text-white mb-4 animate-fade-up opacity-0-start animation-delay-100"
                style={{ animationFillMode: 'forwards' }}>
                {t(lang, 'hero_title')}{' '}
                <span className="gradient-text">{t(lang, 'hero_subtitle')}</span>
              </h1>

              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-lg animate-fade-up opacity-0-start animation-delay-200"
                style={{ animationFillMode: 'forwards' }}>
                {t(lang, 'hero_desc')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 mb-10 animate-fade-up opacity-0-start animation-delay-300"
                style={{ animationFillMode: 'forwards' }}>
                <Link to="/register" className="btn-primary flex items-center gap-2 py-3.5 px-7 text-sm">
                  {t(lang, 'get_started')}
                  <ArrowRight size={16} />
                </Link>
                <Link to="/services" className="btn-secondary flex items-center gap-2 py-3.5 px-7 text-sm">
                  Browse Services
                  <ChevronRight size={16} />
                </Link>
              </div>

              {/* Service tags */}
              <div className="animate-fade-up opacity-0-start animation-delay-400"
                style={{ animationFillMode: 'forwards' }}>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 font-medium uppercase tracking-wider">
                  Popular Services
                </p>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_TAGS.map((tag) => (
                    <Link key={tag} to="/services" className="service-tag">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — floating UI mockup */}
            <div className="hidden lg:block relative">
              <div className="animate-float">
                {/* Main card */}
                <div className="glass-card p-6 w-full max-w-sm ml-auto shadow-2xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Income Certificate</p>
                      <p className="text-xs text-slate-400">Step 2 of 5 — Family Details</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full mb-5">
                    <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: '40%' }} />
                  </div>
                  {/* Fake form fields */}
                  {['Full Name', 'Aadhaar Number', 'Annual Income'].map((f, i) => (
                    <div key={f} className="mb-3">
                      <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">{f}</label>
                      <div className={`h-9 rounded-lg border ${i === 1 ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`} />
                    </div>
                  ))}
                  <button className="btn-primary w-full text-xs py-2.5 mt-2">Continue →</button>
                </div>

                {/* Floating status badge */}
                <div className="absolute -top-4 -left-4 glass-card px-4 py-3 flex items-center gap-2 shadow-xl">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Application Submitted!</span>
                </div>

                {/* Floating AI badge */}
                <div className="absolute -bottom-4 -right-4 glass-card px-4 py-3 flex items-center gap-2 shadow-xl">
                  <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">AI Assistant</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">Ready to help</p>
                  </div>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-dot" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-12 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon size={20} className="text-primary-200 mx-auto mb-2" />
                <p className="font-display font-extrabold text-3xl text-white">{value}</p>
                <p className="text-primary-200 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Services ─────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2">What we offer</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
              Popular Government Services
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Find and apply for the most commonly requested government certificates and schemes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.filter(s => s.popular).map((s, i) => (
              <ServiceCard key={s.id} service={s} delay={i * 80} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="btn-secondary inline-flex items-center gap-2">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2">Why Smart Guide AI?</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Everything you need, in one place
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg transition-all duration-300 group animate-fade-up opacity-0-start"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2">Simple process</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-12">
            Apply in 3 easy steps
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-300 to-primary-400" />
            {[
              { num: '01', title: 'Choose Service',   desc: 'Browse our catalogue and select the certificate or service you need.' },
              { num: '02', title: 'Fill & Upload',    desc: 'Complete the guided form and upload required documents securely.' },
              { num: '03', title: 'Track & Receive',  desc: 'Monitor your application status and receive your certificate.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white font-display font-bold text-xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30 z-10">
                  {num}
                </div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Start your application today
          </h2>
          <p className="text-primary-200 mb-8 text-lg">
            Join 2.4 million citizens who already use Smart Guide AI to access government services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:shadow-xl hover:scale-105 transition-all text-sm">
              Get Started — Free
            </Link>
            <Link to="/services" className="border border-primary-400 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all text-sm">
              Browse Services
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
