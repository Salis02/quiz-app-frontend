import api from './api'

export const adminService = {
  // Categories
  async createCategory(categoryData) {
    try {
      return await api.post('/admin/categories', categoryData)
    } catch (error) {
      console.error('Failed to create category:', error)
      throw error
    }
  },

  async getCategories() {
    try {
      return await api.get('/admin/categories')
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },

  async updateCategory(categoryId, categoryData) {
    try {
      return await api.put(`/admin/categories/${categoryId}`, categoryData)
    } catch (error) {
      console.error('Failed to update category:', error)
      throw error
    }
  },

  async deleteCategory(categoryId) {
    try {
      return await api.delete(`/admin/categories/${categoryId}`)
    } catch (error) {
      console.error('Failed to delete category:', error)
      throw error
    }
  },

  // Quizzes
  async createQuiz(quizData) {
    try {
      return await api.post('/admin/quizzes', quizData)
    } catch (error) {
      console.error('Failed to create quiz:', error)
      throw error
    }
  },

  async getAllQuizzes() {
    try {
      return await api.get('/admin/quizzes')
    } catch (error) {
      console.error('Failed to fetch quizzes:', error)
      throw error
    }
  },

  async getQuizById(quizId) {
    try {
      return await api.get(`/admin/quizzes/${quizId}`)
    } catch (error) {
      console.error('Failed to fetch quiz:', error)
      throw error
    }
  },

  async updateQuiz(quizId, quizData) {
    try {
      return await api.put(`/admin/quizzes/${quizId}`, quizData)
    } catch (error) {
      console.error('Failed to update quiz:', error)
      throw error
    }
  },

  async deleteQuiz(quizId) {
    try {
      return await api.delete(`/admin/quizzes/${quizId}`)
    } catch (error) {
      console.error('Failed to delete quiz:', error)
      throw error
    }
  },

  async publishQuiz(quizId) {
    try {
      return await api.patch(`/admin/quizzes/${quizId}/publish`)
    } catch (error) {
      console.error('Failed to publish quiz:', error)
      throw error
    }
  },

  async unpublishQuiz(quizId) {
    try {
      return await api.patch(`/admin/quizzes/${quizId}/unpublish`)
    } catch (error) {
      console.error('Failed to unpublish quiz:', error)
      throw error
    }
  },

  // Questions
  async addQuestion(quizId, questionData) {
    try {
      return await api.post(`/admin/quizzes/${quizId}/questions`, questionData)
    } catch (error) {
      console.error('Failed to add question:', error)
      throw error
    }
  },

  async updateQuestion(questionId, questionData) {
    try {
      return await api.put(`/admin/questions/${questionId}`, questionData)
    } catch (error) {
      console.error('Failed to update question:', error)
      throw error
    }
  },

  async deleteQuestion(questionId) {
    try {
      return await api.delete(`/admin/questions/${questionId}`)
    } catch (error) {
      console.error('Failed to delete question:', error)
      throw error
    }
  },

  // Options
  async addOption(questionId, optionData) {
    try {
      return await api.post(`/admin/questions/${questionId}/options`, optionData)
    } catch (error) {
      console.error('Failed to add option:', error)
      throw error
    }
  },

  async updateOption(optionId, optionData) {
    try {
      return await api.put(`/admin/options/${optionId}`, optionData)
    } catch (error) {
      console.error('Failed to update option:', error)
      throw error
    }
  },

  async deleteOption(optionId) {
    try {
      return await api.delete(`/admin/options/${optionId}`)
    } catch (error) {
      console.error('Failed to delete option:', error)
      throw error
    }
  },

  // Results & Analytics
  async getQuizResults(quizId) {
    try {
      return await api.get(`/admin/results/${quizId}`)
    } catch (error) {
      console.error('Failed to fetch quiz results:', error)
      throw error
    }
  },

  async getAnalytics(params = {}) {
    try {
      return await api.get('/admin/analytics', { params })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      throw error
    }
  }
}