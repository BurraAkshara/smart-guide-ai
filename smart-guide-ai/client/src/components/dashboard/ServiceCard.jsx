import { Link } from 'react-router-dom'
import { Clock, IndianRupee, ArrowRight, Star } from 'lucide-react'
import clsx from 'clsx'

export default function ServiceCard({ service, delay = 0 }) {
  return (
    <div
      className="group glass-card p-5 flex flex-col gap-4 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 transition-all duration-300 animate-fade-up opacity-0-start"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-2xl">
            {service.icon}
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-900 dark:text-white text-sm leading-tight">
              {service.name}
            </h3>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
              {service.category}
            </span>
          </div>
        </div>
        {service.popular && (
          <div className="flex items-center gap-0.5 px-2 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-full">
            <Star size={10} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Popular</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
        {service.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock size={12} className="text-primary-500" />
          {service.processingTime}
        </span>
        <span className="flex items-center gap-1">
          <IndianRupee size={12} className="text-green-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{service.fees.replace('₹','')}</span>
        </span>
      </div>

      {/* CTA */}
      <Link
        to={`/services/${service.slug}`}
        className={clsx(
          'flex items-center justify-center gap-2',
          'btn-primary py-2.5 text-xs w-full',
          'group-hover:gap-3 transition-all'
        )}
      >
        Apply Now
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}
