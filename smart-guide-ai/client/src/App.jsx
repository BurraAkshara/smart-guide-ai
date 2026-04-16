import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore, useAuthStore } from './store'

// Layout
import Layout from './components/layout/Layout'

// Pages
import LandingPage     from './pages/LandingPage'
import ServicesPage    from './pages/ServicesPage'
import ServiceDetail   from './pages/ServiceDetail'
import ApplicationForm from './pages/ApplicationForm'
import Dashboard       from './pages/Dashboard'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import TrackingPage    from './pages/TrackingPage'
import NotFound        from './pages/NotFound'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { initTheme } = useThemeStore()

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/"                element={<LandingPage />} />
        <Route path="/services"        element={<ServicesPage />} />
        <Route path="/services/:slug"  element={<ServiceDetail />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />

        {/* Protected */}
        <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/apply/:slug"     element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
        <Route path="/track/:id"       element={<ProtectedRoute><TrackingPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
