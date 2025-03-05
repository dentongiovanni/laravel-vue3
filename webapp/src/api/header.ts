// header.ts
import axios from 'axios'
import type { AxiosInstance } from 'axios'


// Safely parse the stored token
const storedToken = localStorage.getItem('user')
const accessToken = storedToken ? JSON.parse(storedToken) : null

// Create an Axios instance with baseURL and default headers
const rest: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
  },
})

export default rest
