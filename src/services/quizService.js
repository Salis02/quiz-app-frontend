import api from './api'

export const quizService = {
    async getPublicQuizzes() {
        try {
            return await api.get('/quizzes/public')
        } catch (error) {
            console.error('Failed to fetch public quizzes:', error)
            throw error
        }
    },

    async startQuiz(quizId) {
        try {
            return await api.post(`/quizzes/${quizId}/start`)
        } catch (error) {
            console.error('Failed to start quiz:', error)
            throw error
        }
    },

    async submitAnswer(questionId, optionId) {
        try {
            return await api.post(`/quizzes/questions/${questionId}/answer`, {
                option_id: optionId
            })
        } catch (error) {
            console.error('Failed to submit answer:', error)
            throw error
        }
    },

    async finishQuiz(quizId) {
        try {
            return await api.post(`/quizzes/${quizId}/finish`)
        } catch (error) {
            console.error('Failed to finish quiz:', error)
            throw error
        }
    },

    async getUserResults() {
        try {
            return await api.get('/quizzes/results/me')
        } catch (error) {
            console.error('Failed to fetch user results:', error)
            throw error
        }
    }
}