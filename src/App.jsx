import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { QuizProvider } from './context/QuizContext'

// Layout & Protection
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Public Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// User Pages
import UserDashboard from './pages/user/UserDashboard'
import QuizDetailPage from './pages/user/QuizDetailPage'
import TakeQuizPage from './pages/user/TakeQuizPage'
import ResultsPage from './pages/user/ResultsPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageQuizzes from './pages/admin/ManageQuizzes'
import CreateQuiz from './pages/admin/CreateQuiz'
import ManageCategories from './pages/admin/ManageCategories'

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/quiz/:id" element={
                  <ProtectedRoute>
                    <QuizDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/quiz/:id/take" element={
                  <ProtectedRoute>
                    <TakeQuizPage />
                  </ProtectedRoute>
                } />
                <Route path="/results" element={
                  <ProtectedRoute>
                    <ResultsPage />
                  </ProtectedRoute>
                } />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/quizzes" element={
                  <ProtectedRoute requireAdmin={true}>
                    <ManageQuizzes />
                  </ProtectedRoute>
                } />
                <Route path="/admin/quiz/create" element={
                  <ProtectedRoute requireAdmin={true}>
                    <CreateQuiz />
                  </ProtectedRoute>
                } />
                <Route path="/admin/categories" element={
                  <ProtectedRoute requireAdmin={true}>
                    <ManageCategories />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </QuizProvider>
    </AuthProvider>
  )
}

export default App