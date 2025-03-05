// src/services/authentication.ts
import rest from '@/api/header'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  // add more fields if needed
}

interface LoginResponse {
  access_token: string
  token_type?: string
  [key: string]: any
}

export const Auth = {
  login,
  register,
  logout,
}

async function login(payload: LoginPayload): Promise<void> {
  try {
    const { data } = await rest.post<LoginResponse>('api/login', payload)
    if (data.access_token) {
      localStorage.clear()
      localStorage.setItem('user', JSON.stringify(data.access_token))
      rest.defaults.headers.Authorization = `Bearer ${data.access_token}`
    }
  } catch (error) {
    handleAxiosError(error)
  }
}

/** Optional registration method */
async function register(payload: RegisterPayload): Promise<void> {
  try {
    const { data } = await rest.post<LoginResponse>('api/register', payload)
    if (data.access_token) {
      localStorage.clear()
      localStorage.setItem('user', JSON.stringify(data.access_token))
      rest.defaults.headers.Authorization = `Bearer ${data.access_token}`
    }
  } catch (error) {
    handleAxiosError(error)
  }
}

function logout(): void {
  localStorage.clear()
  delete rest.defaults.headers.Authorization
}

function handleAxiosError(error: any): never {
  if (error.response) {
    if (error.response.status === 401) {
      logout()
      location.reload()
    }
    const msg = error.response.data?.message || error.response.statusText
    throw new Error(msg)
  }
  throw error
}
