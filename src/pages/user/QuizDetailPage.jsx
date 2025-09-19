import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Clock, 
  User, 
  Play, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Trophy,
  Calendar
} from 'lucide-react'
import { useQuiz } from '../../context/QuizContext'
import { quizService } from '../../services/quizService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import toast from 'react-hot-toast'

function QuizDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { startQuiz, userResults, fetchUserResults } = useQuiz()
  
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  // Fetch quiz details
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        setLoading(true)
        // We'll use the public quizzes endpoint to get basic info
        // In a real app, you might have a specific endpoint for quiz details
        const response = await quizService.getPublicQuizzes()
        const foundQuiz = response.data.find(q => q.id === parseInt(id))
        
        if (foundQuiz) {
          setQuiz(foundQuiz)
        } else {
          toast.error('Quiz not found')
          navigate('/')
        }
      } catch (error) {
        toast.error('Failed to load quiz details')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchQuizDetails()
      fetchUserResults()
    }
  }, [id, navigate, fetchUserResults])

  // Handle start quiz
  const handleStartQuiz = async () => {
    try {
      setStarting(true)
      const result = await startQuiz(parseInt(id))
      
      if (result.success) {
        navigate(`/quiz/${id}/take`)
      }
    } catch (error) {
      // Error is handled by the startQuiz function
    } finally {
      setStarting(false)
    }
  }

  // Check if user has taken this quiz before
  const previousResult = userResults.find(result => result.quiz.id === parseInt(id))
  const hasCompletedQuiz = !!previousResult

  if (loading) {
    return <Loading variant="page" text="Loading quiz details..." />
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} icon={ArrowLeft}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const estimatedTime = Math.ceil((quiz._count?.questions || 0) * 1.5)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
          className="mb-6"
        >
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              {/* Category Badge */}
              {quiz.category && (
                <div className="mb-4">
                  <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                    {quiz.category.name}
                  </span>
                </div>
              )}

              {/* Quiz Title & Description */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {quiz.title}
              </h1>
              
              {quiz.description && (
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {quiz.description}
                </p>
              )}

              {/* Quiz Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {quiz._count?.questions || 0}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ~{estimatedTime} min
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <User className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Created by</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quiz.creator?.name}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(quiz.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Previous Result (if exists) */}
              {hasCompletedQuiz && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-blue-900 mb-1">
                        You've completed this quiz before
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-blue-700">
                        <span>Score: <strong>{previousResult.score}%</strong></span>
                        <span>
                          Completed on {new Date(previousResult.finished_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        You can retake this quiz to improve your score.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Instructions */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Instructions
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Read each question carefully before selecting your answer
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      You can navigate between questions and change your answers
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Make sure to answer all questions before submitting
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Your results will be available immediately after submission
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Start Quiz Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ready to Start?
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-medium">{quiz._count?.questions || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated time:</span>
                  <span className="font-medium">~{estimatedTime} minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium text-yellow-600">Medium</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleStartQuiz}
                  variant="primary"
                  size="lg"
                  loading={starting}
                  className="w-full"
                  icon={Play}
                >
                  {hasCompletedQuiz ? 'Retake Quiz' : 'Start Quiz'}
                </Button>
              </div>
            </Card>

            {/* Achievement Card */}
            {hasCompletedQuiz && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Best Result
                </h3>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-yellow-600" />
                  </div>
                  
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {previousResult.score}%
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Completed on {new Date(previousResult.finished_at).toLocaleDateString()}
                  </p>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    previousResult.score >= 80 
                      ? 'bg-green-100 text-green-800' 
                      : previousResult.score >= 60 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {previousResult.score >= 80 ? 'Excellent' : previousResult.score >= 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">
                💡 Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-primary-800">
                <li>• Take your time to read each question</li>
                <li>• Eliminate obviously wrong answers first</li>
                <li>• Trust your first instinct when unsure</li>
                <li>• Review your answers before submitting</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizDetailPage