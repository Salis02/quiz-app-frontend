import axios from 'axios'
import toast from 'react-hot-toast'

// Base API configuration
const API_BASE_URL = 'http://localhost:3000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data // Return only data part
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

export default api