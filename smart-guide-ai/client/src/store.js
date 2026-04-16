import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Auth Store ───────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    { name: 'sga-auth' }
  )
)

// ─── Theme Store ──────────────────────────────────────────────
export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () =>
        set((state) => {
          const next = !state.isDark
          document.documentElement.classList.toggle('dark', next)
          return { isDark: next }
        }),
      initTheme: () =>
        set((state) => {
          document.documentElement.classList.toggle('dark', state.isDark)
          return state
        }),
    }),
    { name: 'sga-theme' }
  )
)

// ─── Language Store ───────────────────────────────────────────
export const useLanguageStore = create(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'sga-lang' }
  )
)

// ─── Application Progress Store ───────────────────────────────
export const useProgressStore = create(
  persist(
    (set) => ({
      applications: {}, // { [serviceId]: { step, data } }

      saveProgress: (serviceId, step, data) =>
        set((state) => ({
          applications: {
            ...state.applications,
            [serviceId]: { step, data, updatedAt: new Date().toISOString() },
          },
        })),

      clearProgress: (serviceId) =>
        set((state) => {
          const apps = { ...state.applications }
          delete apps[serviceId]
          return { applications: apps }
        }),
    }),
    { name: 'sga-progress' }
  )
)
