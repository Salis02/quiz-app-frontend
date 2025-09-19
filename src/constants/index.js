// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  QUIZ: {
    PUBLIC: '/quizzes/public',
    START: (id) => `/quizzes/${id}/start`,
    FINISH: (id) => `/quizzes/${id}/finish`,
    RESULTS: '/quizzes/results/me',
  },
  ADMIN: {
    CATEGORIES: '/admin/categories',
    QUIZZES: '/admin/quizzes',
    QUIZ_RESULTS: (id) => `/admin/results/${id}`,
  }
}

// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
}

// Quiz question types
export const QUESTION_TYPES = {
  MCQ: 'MCQ',
  TRUE_FALSE: 'TRUE_FALSE',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  QUIZ_DETAIL: (id) => `/quiz/${id}`,
  TAKE_QUIZ: (id) => `/quiz/${id}/take`,
  RESULTS: '/results',
  ADMIN: '/admin',
  ADMIN_QUIZZES: '/admin/quizzes',
  ADMIN_CREATE_QUIZ: '/admin/quiz/create',
}