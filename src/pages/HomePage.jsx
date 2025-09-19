import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Clock,
  ArrowRight,
  Star,
  Play,
  User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useQuiz } from '../context/QuizContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loading from '../components/ui/Loading'

function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const { quizzes, loadingQuizzes, fetchQuizzes } = useQuiz()
  const navigate = useNavigate()

  // Fetch public quizzes on component mount
  useEffect(() => {
    fetchQuizzes()
  }, [])

  const handleTakeQuiz = (quizId) => {
    if (isAuthenticated) {
      navigate(`/quiz/${quizId}`)
    } else {
      navigate('/login', { state: { from: { pathname: `/quiz/${quizId}` } } })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Test Your Knowledge
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Take interactive quizzes, track your progress, and compete with others. 
              Perfect for learning, teaching, and skill assessment.
            </p>
            
            {isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-primary-100">
                  Welcome back, <span className="font-semibold">{user?.name}</span>!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate('/dashboard')}
                    icon={BookOpen}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-primary-600"
                    onClick={() => navigate('/results')}
                    icon={Trophy}
                  >
                    View Results
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/register')}
                  icon={ArrowRight}
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-primary-600"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {quizzes.length}+
              </h3>
              <p className="text-gray-600">Available Quizzes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">5000+</h3>
              <p className="text-gray-600">Quizzes Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Quizzes Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Available Quizzes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of carefully crafted quizzes. 
              Test your knowledge and see how you stack up!
            </p>
          </div>

          {loadingQuizzes ? (
            <Loading variant="page" text="Loading quizzes..." />
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No quizzes available yet
              </h3>
              <p className="text-gray-600">
                Check back later for new quizzes!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} hover className="h-full">
                  <div className="flex flex-col h-full">
                    {/* Quiz Category */}
                    {quiz.category && (
                      <div className="mb-3">
                        <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {quiz.category.name}
                        </span>
                      </div>
                    )}

                    {/* Quiz Title & Description */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {quiz.description}
                        </p>
                      )}
                    </div>

                    {/* Quiz Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {quiz._count?.questions || 0} questions
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        ~{Math.ceil((quiz._count?.questions || 0) * 1.5)} min
                      </div>
                    </div>

                    {/* Creator Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        by {quiz.creator?.name}
                      </div>
                      <div className="flex items-center text-sm text-yellow-500">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        4.5
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleTakeQuiz(quiz.id)}
                      variant="primary"
                      className="w-full"
                      icon={Play}
                    >
                      {isAuthenticated ? 'Take Quiz' : 'Login to Take Quiz'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already testing their knowledge 
              and improving their skills with our quizzes.
            </p>
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/register')}
              icon={ArrowRight}
            >
              Create Free Account
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage