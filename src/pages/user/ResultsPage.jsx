import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Target,
  TrendingUp,
  BookOpen,
  ArrowLeft,
  Eye,
  RefreshCw
} from 'lucide-react'
import { useQuiz } from '../../context/QuizContext'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'

function ResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { userResults, fetchUserResults } = useQuiz()
  
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('all') // all, week, month

  // Get new result from navigation state
  const newResult = location.state?.newResult
  const fromQuiz = location.state?.fromQuiz

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true)
      await fetchUserResults()
      setLoading(false)
    }
    
    loadResults()
  }, [fetchUserResults])

  // Filter results based on selected period
  const getFilteredResults = () => {
    if (selectedPeriod === 'all') return userResults
    
    const now = new Date()
    const cutoff = new Date()
    
    if (selectedPeriod === 'week') {
      cutoff.setDate(now.getDate() - 7)
    } else if (selectedPeriod === 'month') {
      cutoff.setMonth(now.getMonth() - 1)
    }
    
    return userResults.filter(result => 
      new Date(result.finished_at) >= cutoff
    )
  }

  // Calculate statistics
  const calculateStats = (results) => {
    if (results.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalTime: 0,
        improvement: 0
      }
    }

    const scores = results.map(r => r.score)
    const totalTime = results.reduce((sum, result) => {
      const start = new Date(result.started_at)
      const finish = new Date(result.finished_at)
      return sum + (finish - start) / 1000 / 60 // minutes
    }, 0)

    // Calculate improvement (last 3 vs first 3)
    let improvement = 0
    if (results.length >= 6) {
      const recent = results.slice(0, 3).reduce((sum, r) => sum + r.score, 0) / 3
      const older = results.slice(-3).reduce((sum, r) => sum + r.score, 0) / 3
      improvement = recent - older
    }

    return {
      totalQuizzes: results.length,
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      bestScore: Math.max(...scores),
      totalTime: totalTime,
      improvement: improvement
    }
  }

  const filteredResults = getFilteredResults()
  const stats = calculateStats(filteredResults)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const minutes = Math.floor((end - start) / 1000 / 60)
    const seconds = Math.floor(((end - start) / 1000) % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
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

  const getPerformanceIcon = (score) => {
    if (score >= 80) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (score >= 60) return <Target className="w-5 h-5 text-blue-500" />
    return <BookOpen className="w-5 h-5 text-gray-500" />
  }

  if (loading) {
    return <Loading variant="page" text="Loading your results..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quiz Results
            </h1>
            <p className="text-gray-600">
              Track your learning progress and achievements
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              icon={ArrowLeft}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              icon={BookOpen}
            >
              Take Another Quiz
            </Button>
          </div>
        </div>

        {/* New Result Celebration */}
        {newResult && fromQuiz && (
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="text-center py-6">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Quiz Completed! 🎉
              </h2>
              <div className="text-4xl font-bold mb-2">
                <span className={getScoreColor(newResult.score)}>
                  {newResult.score}%
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                You answered {newResult.correct_answers} out of {newResult.total_questions} questions correctly
              </p>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getScoreBadgeColor(newResult.score)}`}>
                {newResult.score >= 80 ? 'Excellent Work!' : newResult.score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
              </div>
            </div>
          </Card>
        )}

        {/* Period Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-sm font-medium text-gray-700">Show results from:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All Time' },
              { key: 'month', label: 'Last Month' },
              { key: 'week', label: 'Last Week' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedPeriod(key)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === key
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalQuizzes}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageScore.toFixed(1)}%
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
                  {stats.bestScore}%
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
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.totalTime)}m
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Results List */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Quiz History
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchUserResults}
              icon={RefreshCw}
            >
              Refresh
            </Button>
          </div>

          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedPeriod === 'all' 
                  ? "You haven't taken any quizzes yet" 
                  : `No quizzes taken in the selected time period`
                }
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
                icon={BookOpen}
              >
                Take Your First Quiz
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((result, index) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getPerformanceIcon(result.score)}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {result.quiz.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(result.finished_at)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDuration(result.started_at, result.finished_at)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getScoreBadgeColor(result.score)}`}>
                        {result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : 'Needs Work'}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/quiz/${result.quiz.id}`)}
                      icon={RefreshCw}
                    >
                      Retake
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Performance Insights */}
        {stats.totalQuizzes > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Performance Trend */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Insights
              </h3>
              <div className="space-y-4">
                {stats.improvement !== 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-900">
                        Recent Improvement
                      </span>
                    </div>
                    <span className={`font-semibold ${stats.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.improvement > 0 ? '+' : ''}{stats.improvement.toFixed(1)}%
                    </span>
                  </div>
                )}
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <strong>Strong Areas:</strong> Keep up the great work on topics where you're scoring above 80%!
                  </p>
                  <p>
                    <strong>Areas to Improve:</strong> Focus on reviewing topics where you scored below 60%.
                  </p>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Achievements
              </h3>
              <div className="space-y-3">
                {stats.totalQuizzes >= 5 && (
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Quiz Master</p>
                      <p className="text-xs text-yellow-700">Completed 5+ quizzes</p>
                    </div>
                  </div>
                )}
                
                {stats.bestScore >= 90 && (
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Target className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-900">High Achiever</p>
                      <p className="text-xs text-green-700">Scored 90%+ on a quiz</p>
                    </div>
                  </div>
                )}
                
                {stats.averageScore >= 75 && (
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Consistent Performer</p>
                      <p className="text-xs text-blue-700">Average score above 75%</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsPage