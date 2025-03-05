import { defineStore } from 'pinia'
import { Auth } from '@/services/authentication'
import type { LoginPayload } from '@/services/authentication'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    error: null as string | null,
    isLoading: false,
  }),

  actions: {
    async login(payload: LoginPayload) {
      this.isLoading = true
      this.error = null
      try {
        await Auth.login(payload)
        const token = localStorage.getItem('user')
        if (token) {
          this.token = JSON.parse(token)
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Login failed'
        }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      Auth.logout()
      this.token = null
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})
