import { Link } from 'react-router-dom'
import { Bot, Heart, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Smart<span className="text-primary-400">Guide</span>
                <span className="text-accent-400"> AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Empowering citizens with digital literacy and AI-powered guidance to access government services with ease.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Github size={16} /></a>
              <a href="#" className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Twitter size={16} /></a>
              <a href="#" className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Mail size={16} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Services</h4>
            <ul className="space-y-2 text-sm">
              {['Income Certificate','Caste Certificate','Birth Certificate','Pension Scheme'].map(s => (
                <li key={s}><Link to="/services" className="hover:text-white transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              {[['Home','/'],['Services','/services'],['Dashboard','/dashboard'],['Login','/login']].map(([l,p]) => (
                <li key={l}><Link to={p} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">© 2024 Smart Guide AI. All rights reserved.</p>
          <p className="text-xs flex items-center gap-1">
            Made with <Heart size={11} className="text-red-400 fill-red-400" /> for citizens of India
          </p>
        </div>
      </div>
    </footer>
  )
}
