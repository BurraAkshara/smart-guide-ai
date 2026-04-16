import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { SERVICES, CATEGORIES } from '../utils/mockData'
import { useLanguageStore } from '../store'
import { t } from '../utils/i18n'
import ServiceCard from '../components/dashboard/ServiceCard'
import clsx from 'clsx'

export default function ServicesPage() {
  const { lang }                      = useLanguageStore()
  const [activeCategory, setCategory] = useState('all')
  const [query, setQuery]             = useState('')

  const filtered = useMemo(() => {
    return SERVICES.filter(s => {
      const matchCat = activeCategory === 'all' || s.category === activeCategory
      const matchQ   = !query || s.name.toLowerCase().includes(query.toLowerCase()) ||
                       s.description.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQ
    })
  }, [activeCategory, query])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40">

      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2">
            Service Catalogue
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-2">
            Government Services
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Browse and apply for certificates, ID services, education benefits, and welfare schemes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t(lang, 'search')}
              className="form-input pl-10 pr-10"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <SlidersHorizontal size={15} className="text-slate-400 flex-shrink-0" />
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={clsx(
                  'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  activeCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                )}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results meta */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filtered.length}</span> services
          {query && <> matching "<span className="font-semibold text-primary-600">{query}</span>"</>}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s, i) => (
              <ServiceCard key={s.id} service={s} delay={i * 60} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-2">
              No services found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Try a different search term or category filter.
            </p>
            <button
              onClick={() => { setQuery(''); setCategory('all') }}
              className="btn-primary mt-5 text-sm py-2.5"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
