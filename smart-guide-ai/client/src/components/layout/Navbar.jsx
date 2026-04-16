import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Moon, Sun, Globe, Menu, X, Bot, ChevronDown } from 'lucide-react'
import { useAuthStore, useThemeStore, useLanguageStore } from '../../store'
import { LANGUAGES } from '../../utils/i18n'

export default function Navbar() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { isDark, toggleTheme }           = useThemeStore()
  const { lang, setLang }                 = useLanguageStore()
  const [menuOpen, setMenuOpen]           = useState(false)
  const [langOpen, setLangOpen]           = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <Bot size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Smart<span className="text-primary-600">Guide</span>
              <span className="text-accent-500"> AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/services"
              className={`text-sm font-medium transition-colors ${isActive('/services') ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'}`}
            >
              Services
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'}`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Globe size={15} />
                <span className="hidden sm:block font-medium">{LANGUAGES.find(l => l.code === lang)?.flag}</span>
                <ChevronDown size={13} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 animate-fade-in">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${lang === l.code ? 'text-primary-600 font-semibold' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      <span>{l.flag}</span>{l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Hi, <span className="font-semibold text-slate-800 dark:text-white">{user?.name?.split(' ')[0]}</span>
                </span>
                <button onClick={handleLogout} className="btn-secondary py-2 px-4 text-xs">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"    className="btn-secondary py-2 px-4 text-xs">Sign In</Link>
                <Link to="/register" className="btn-primary  py-2 px-4 text-xs">Get Started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pb-4 pt-2 animate-fade-in">
          <nav className="flex flex-col gap-2">
            <Link to="/services"  onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Services</Link>
            {isAuthenticated && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Dashboard</Link>}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn-secondary text-sm py-2">Logout</button>
              ) : (
                <>
                  <Link to="/login"    onClick={() => setMenuOpen(false)} className="btn-secondary text-center text-sm py-2">Sign In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary  text-center text-sm py-2">Get Started</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
