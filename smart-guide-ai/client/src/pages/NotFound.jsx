import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6 animate-float">🗺️</div>
      <h1 className="font-display font-extrabold text-6xl text-slate-900 dark:text-white mb-3">404</h1>
      <p className="font-display font-semibold text-xl text-slate-700 dark:text-slate-200 mb-2">Page Not Found</p>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
        Looks like you've ventured somewhere that doesn't exist. Let's get you back on track.
      </p>
      <div className="flex gap-3">
        <Link to="/"        className="btn-primary text-sm py-3 px-6">← Home</Link>
        <Link to="/services" className="btn-secondary text-sm py-3 px-6">Browse Services</Link>
      </div>
    </div>
  )
}
