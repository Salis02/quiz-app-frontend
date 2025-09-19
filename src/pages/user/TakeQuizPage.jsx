import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  BookOpen,
  Flag
} from 'lucide-react'
import { useQuiz } from '../../context/QuizContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import toast from 'react-hot-toast'

function TakeQuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    currentQuiz,
    currentQuestion,
    answers,
    loading,
    submittingAnswer,
    submitAnswer,
    finishQuiz,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    getCurrentQuestion,
    getAnsweredQuestionsCount,
    canFinishQuiz,
    resetQuizState
  } = useQuiz()

  const [selectedOption, setSelectedOption] = useState(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [finishing, setFinishing] = useState(false)

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Reset quiz state when component unmounts
  useEffect(() => {
    return () => {
      // Don't reset if we're finishing the quiz
      if (!finishing) {
        resetQuizState()
      }
    }
  }, [resetQuizState, finishing])

  // Set selected option when question changes
  useEffect(() => {
    const question = getCurrentQuestion()
    if (question && answers[question.id]) {
      setSelectedOption(answers[question.id].optionId)
    } else {
      setSelectedOption(null)
    }
  }, [currentQuestion, answers, getCurrentQuestion])

  // Redirect if no active quiz
  useEffect(() => {
    if (!loading && !currentQuiz) {
      toast.error('No active quiz session found')
      navigate(`/quiz/${id}`)
    }
  }, [currentQuiz, loading, navigate, id])

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId)
  }

  const handleSubmitAnswer = async () => {
    if (!selectedOption) {
      toast.error('Please select an answer')
      return
    }

    const question = getCurrentQuestion()
    if (!question) return

    const result = await submitAnswer(question.id, selectedOption)
    
    if (result.success) {
      toast.success(result.isCorrect ? 'Correct! 🎉' : 'Not quite right', {
        duration: 1500
      })
    }
  }

  const handleNextQuestion = async () => {
    // Submit answer if not already submitted
    const question = getCurrentQuestion()
    if (selectedOption && question && !answers[question.id]) {
      await handleSubmitAnswer()
    }
    nextQuestion()
  }

  const handlePreviousQuestion = () => {
    previousQuestion()
  }

  const handleQuestionNavigation = (questionIndex) => {
    goToQuestion(questionIndex)
  }

  const handleFinishQuiz = async () => {
    try {
      setFinishing(true)
      
      // Submit current answer if not submitted
      const question = getCurrentQuestion()
      if (selectedOption && question && !answers[question.id]) {
        await handleSubmitAnswer()
      }

      const result = await finishQuiz(parseInt(id))
      
      if (result.success) {
        navigate('/results', { 
          state: { 
            newResult: result.result,
            fromQuiz: true 
          } 
        })
      }
    } catch (error) {
      setFinishing(false)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return <Loading variant="page" text="Loading quiz..." />
  }

  if (!currentQuiz) {
    return <Loading variant="page" text="Starting quiz..." />
  }

  const question = getCurrentQuestion()
  const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100
  const answeredCount = getAnsweredQuestionsCount()
  const isCurrentQuestionAnswered = question && answers[question.id]

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Question Not Found</h2>
          <Button onClick={() => navigate(`/quiz/${id}`)} icon={ArrowLeft}>
            Back to Quiz
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentQuiz.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(timeElapsed)}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {answeredCount} / {currentQuiz.questions.length} answered
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmSubmit(true)}
                disabled={!canFinishQuiz()}
                icon={Flag}
              >
                Finish Quiz
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Question {currentQuestion + 1} of {currentQuiz.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Questions
              </h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {currentQuiz.questions.map((q, index) => {
                  const isAnswered = answers[q.id]
                  const isCurrent = index === currentQuestion
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleQuestionNavigation(index)}
                      className={`
                        w-10 h-10 rounded-lg text-sm font-medium transition-colors
                        ${isCurrent
                          ? 'bg-primary-500 text-white'
                          : isAnswered
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {index + 1}
                      {isAnswered && !isCurrent && (
                        <CheckCircle className="w-3 h-3 ml-1 inline" />
                      )}
                    </button>
                  )
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{answeredCount}/{currentQuiz.questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(answeredCount / currentQuiz.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card>
              {/* Question Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary-600">
                    Question {currentQuestion + 1}
                  </span>
                  {isCurrentQuestionAnswered && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Answered
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {question.text}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-8">
                {question.options.map((option) => {
                  const isSelected = selectedOption === option.id
                  const isAnswered = isCurrentQuestionAnswered
                  const wasSelected = isAnswered && answers[question.id].optionId === option.id
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => !isAnswered && handleOptionSelect(option.id)}
                      disabled={isAnswered}
                      className={`
                        w-full p-4 text-left border-2 rounded-lg transition-all duration-200
                        ${isSelected && !isAnswered
                          ? 'border-primary-500 bg-primary-50'
                          : wasSelected && isAnswered
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                        ${isAnswered ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center">
                        <div className={`
                          w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                          ${isSelected && !isAnswered
                            ? 'border-primary-500 bg-primary-500'
                            : wasSelected && isAnswered
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                          }
                        `}>
                          {(isSelected && !isAnswered) || (wasSelected && isAnswered) ? (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          ) : null}
                        </div>
                        <span className="text-gray-900">{option.text}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  icon={ArrowLeft}
                >
                  Previous
                </Button>

                <div className="flex space-x-3">
                  {!isCurrentQuestionAnswered && (
                    <Button
                      variant="primary"
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOption || submittingAnswer}
                      loading={submittingAnswer}
                    >
                      Submit Answer
                    </Button>
                  )}
                  
                  {currentQuestion < currentQuiz.questions.length - 1 ? (
                    <Button
                      variant={isCurrentQuestionAnswered ? "primary" : "outline"}
                      onClick={handleNextQuestion}
                      icon={ArrowRight}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => setShowConfirmSubmit(true)}
                      disabled={!canFinishQuiz()}
                      icon={Flag}
                    >
                      Finish Quiz
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Finish Quiz?
            </h3>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Questions answered:</span>
                <span className="font-medium">{answeredCount} / {currentQuiz.questions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Time elapsed:</span>
                <span className="font-medium">{formatTime(timeElapsed)}</span>
              </div>
            </div>

            {answeredCount < currentQuiz.questions.length && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      You have {currentQuiz.questions.length - answeredCount} unanswered questions.
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Unanswered questions will be marked as incorrect.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1"
              >
                Continue Quiz
              </Button>
              <Button
                variant="primary"
                onClick={handleFinishQuiz}
                loading={finishing}
                className="flex-1"
              >
                Finish Quiz
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default TakeQuizPage