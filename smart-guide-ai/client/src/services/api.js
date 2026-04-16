import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL + '/api'   // ✅ FIXED

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const stored = JSON.parse(localStorage.getItem('sga-auth') || '{}')
  const token = stored?.state?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sga-auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data)      => api.post('/auth/register', data),
  login:    (data)      => api.post('/auth/login', data),
  me:       ()          => api.get('/auth/me'),
}

// ─── Services ─────────────────────────────────────────────────
export const servicesAPI = {
  getAll:    (params)   => api.get('/services', { params }),
  getById:   (id)       => api.get(`/services/${id}`),
  getBySlug: (slug)     => api.get(`/services/slug/${slug}`),
}

// ─── Applications ─────────────────────────────────────────────
export const applicationsAPI = {
  create:    (data)     => api.post('/applications', data),
  getById:   (id)       => api.get(`/applications/${id}`),
  getMyApps: ()         => api.get('/applications/my'),
  update:    (id, data) => api.patch(`/applications/${id}`, data),
}

// ─── AI Chat ──────────────────────────────────────────────────
export const chatAPI = {
  send: (message, history, lang) =>
    api.post('/chat', { message, history, lang }),
}

// ─── File Upload ──────────────────────────────────────────────
export const uploadAPI = {
  upload: (formData) =>
    api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export default api