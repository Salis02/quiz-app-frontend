import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  Play,
  Eye,
  Calendar,
  User
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useQuiz } from '../../context/QuizContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'

function UserDashboard() {
  const { user } = useAuth()
  const { 
    quizzes, 
    userResults, 
    loadingQuizzes, 
    fetchQuizzes, 
    fetchUserResults 
  } = useQuiz()
  const navigate = useNavigate()

  // Fetch data on component mount
  useEffect(() => {
    fetchQuizzes()
    fetchUserResults()
  }, [])

  // Calculate user stats
  const userStats = {
    totalQuizzesTaken: userResults.length,
    averageScore: userResults.length > 0 
      ? userResults.reduce((sum, result) => sum + result.score, 0) / userResults.length 
      : 0,
    bestScore: userResults.length > 0 
      ? Math.max(...userResults.map(result => result.score)) 
      : 0,
    availableQuizzes: quizzes.length,
  }

  // Get recent results (last 5)
  const recentResults = userResults
    .sort((a, b) => new Date(b.finished_at) - new Date(a.finished_at))
    .slice(0, 5)

  // Get recommended quizzes (ones user hasn't taken)
  const takenQuizIds = userResults.map(result => result.quiz.id)
  const recommendedQuizzes = quizzes
    .filter(quiz => !takenQuizIds.includes(quiz.id))
    .slice(0, 6)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's your learning progress and available quizzes
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.totalQuizzesTaken}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.averageScore.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.bestScore}%
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.availableQuizzes}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Results */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Results
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/results')}
                  icon={Eye}
                >
                  View All
                </Button>
              </div>

              {recentResults.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No quiz results yet</p>
                  <p className="text-sm text-gray-400">
                    Take your first quiz to see results here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900">
                          {result.quiz.title}
                        </h3>
                        <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(result.finished_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-lg font-semibold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </span>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getScoreBadgeColor(result.score)}`}>
                          {result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-start"
                  onClick={() => navigate('/results')}
                  icon={Trophy}
                >
                  View All Results
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/')}
                  icon={BookOpen}
                >
                  Browse All Quizzes
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                  icon={User}
                >
                  Edit Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Recommended Quizzes */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recommended for You
            </h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              icon={Eye}
            >
              View All
            </Button>
          </div>

          {loadingQuizzes ? (
            <Loading variant="inline" text="Loading recommendations..." />
          ) : recommendedQuizzes.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">You've completed all available quizzes!</p>
                <p className="text-sm text-gray-400 mb-4">
                  Great job! Check back later for new content.
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/results')}
                  icon={Trophy}
                >
                  View Your Results
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedQuizzes.map((quiz) => (
                <Card key={quiz.id} hover>
                  <div className="flex flex-col h-full">
                    {quiz.category && (
                      <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3 self-start">
                        {quiz.category.name}
                      </span>
                    )}
                    
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {quiz.description}
                        </p>
                      )}
                    </div>

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

                    <Button
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                      variant="primary"
                      className="w-full"
                      icon={Play}
                    >
                      Take Quiz
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard