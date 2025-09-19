import api from './api'

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      
      // Store token and user data
      if (response.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response
    } catch (error) {
      // Re-throw with better error handling
      throw {
        response: {
          data: {
            message: error.response?.data?.message || 'Login failed. Please try again.'
          }
        }
      }
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      
      // Store token and user data
      if (response.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response
    } catch (error) {
      // Handle specific registration errors
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      
      throw {
        response: {
          data: { message }
        }
      }
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Don't redirect here, let the component handle it
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    try {
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('user')
      return null
    }
  },

  getToken() {
    return localStorage.getItem('token')
  },

  isAuthenticated() {
    const token = this.getToken()
    const user = this.getCurrentUser()
    return !!(token && user)
  },

  isAdmin() {
    const user = this.getCurrentUser()
    return user?.role === 'ADMIN'
  }
}