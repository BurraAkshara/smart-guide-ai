import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Loader2, Bot, UserPlus, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store'

const PERKS = [
  'Apply for any government service online',
  'AI assistant guides you every step',
  'Track application status in real time',
  'Multi-language support (EN / TA / HI)',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth  = useAuthStore(s => s.setAuth)
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const pwd = watch('password', '')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = { name: data.name, email: data.email, password: data.password }
      const res = await authAPI.register(payload)
      setAuth(res.data.user, res.data.token)
      toast.success('Account created! Welcome to Smart Guide AI 🎉')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">

        {/* Left — benefits */}
        <div className="hidden lg:block">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/30">
            <Bot size={22} className="text-white" />
          </div>
          <h2 className="font-display font-extrabold text-4xl text-slate-900 dark:text-white mb-4 leading-tight">
            Access all government services in one place
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Smart Guide AI eliminates confusion and bureaucratic complexity — 
            letting you focus on what matters.
          </p>
          <ul className="space-y-4">
            {PERKS.map(perk => (
              <li key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={14} className="text-green-500" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 text-sm">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div>
          <div className="text-center lg:text-left mb-6">
            <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Free forever. No credit card required.</p>
          </div>

          <div className="glass-card p-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ravi Kumar"
                  className="form-input"
                  {...register('name', {
                    required:  'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="form-input"
                  {...register('email', {
                    required: 'Email is required',
                    pattern:  { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    className="form-input pr-11"
                    {...register('password', {
                      required:  'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      pattern:   { value: /(?=.*[A-Z])(?=.*\d)/, message: 'Must include 1 uppercase letter and 1 number' },
                    })}
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  className="form-input"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: v => v === pwd || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 accent-primary-600"
                  {...register('terms', { required: 'You must accept the terms' })}
                />
                <label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                  I agree to the <span className="text-primary-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary-600 hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>
              {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={17} className="animate-spin" /> Creating account…</> : <><UserPlus size={15} /> Create Free Account</>}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
              <span className="text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
