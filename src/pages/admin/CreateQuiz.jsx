import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { adminService } from '../../services/adminService'
import useForm from '../../hooks/useForm'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Loading from '../../components/ui/Loading'
import toast from 'react-hot-toast'

function CreateQuiz() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentStep, setCurrentStep] = useState(1) // 1: Basic Info, 2: Questions, 3: Review
  const [savedQuizId, setSavedQuizId] = useState(null)

  // Form validation for quiz basic info
  const validationRules = {
    title: {
      required: 'Quiz title is required',
      minLength: {
        value: 3,
        message: 'Title must be at least 3 characters'
      }
    },
    description: {
      minLength: {
        value: 10,
        message: 'Description must be at least 10 characters'
      }
    }
  }

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    isSubmitting,
    setValues
  } = useForm(
    {
      title: '',
      description: '',
      category_id: ''
    },
    validationRules
  )

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await adminService.getCategories()
      setCategories(response.data)
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  // Save basic quiz info
  const saveBasicInfo = async (formData) => {
    try {
      setLoading(true)

      // Convert category_id to number if provided
      const quizData = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null
      }

      const response = await adminService.createQuiz(quizData)
      setSavedQuizId(response.data.id)
      setCurrentStep(2)
      toast.success('Quiz created! Now add some questions.')

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create quiz'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  // Add new question
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(), // Temporary ID
      text: '',
      type: 'MCQ',
      options: [
        { id: Date.now() + 1, text: '', is_correct: false },
        { id: Date.now() + 2, text: '', is_correct: false }
      ]
    }
    setQuestions([...questions, newQuestion])
  }

  // Update question
  const updateQuestion = (questionId, field, value) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, [field]: value } : q
    ))
  }

  // Add option to question
  const addOption = (questionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? {
          ...q,
          options: [...q.options, {
            id: Date.now(),
            text: '',
            is_correct: false
          }]
        }
        : q
    ))
  }

  // Update option
  const updateOption = (questionId, optionId, field, value) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? {
          ...q,
          options: q.options.map(opt =>
            opt.id === optionId ? { ...opt, [field]: value } : opt
          )
        }
        : q
    ))
  }

  // Remove option
  const removeOption = (questionId, optionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, options: q.options.filter(opt => opt.id !== optionId) }
        : q
    ))
  }

  // Remove question
  const removeQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId))
  }

  // Set correct answer (only one for MCQ)
  const setCorrectAnswer = (questionId, optionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? {
          ...q,
          options: q.options.map(opt => ({
            ...opt,
            is_correct: opt.id === optionId
          }))
        }
        : q
    ))
  }

  // Save questions to backend
  const saveQuestions = async () => {
    if (!savedQuizId) {
      toast.error('Please save basic info first')
      return
    }

    try {
      setLoading(true)

      for (const question of questions) {
        // Validate question
        if (!question.text.trim()) {
          toast.error('All questions must have text')
          return
        }

        if (question.options.length < 2) {
          toast.error('Each question must have at least 2 options')
          return
        }

        const hasCorrectAnswer = question.options.some(opt => opt.is_correct)
        if (!hasCorrectAnswer) {
          toast.error('Each question must have at least one correct answer')
          return
        }

        // Save question
        const questionResponse = await adminService.addQuestion(savedQuizId, {
          text: question.text,
          type: question.type
        })

        const savedQuestionId = questionResponse.data.id

        // Save options
        for (const option of question.options) {
          if (option.text.trim()) {
            await adminService.addOption(savedQuestionId, {
              text: option.text,
              is_correct: option.is_correct
            })
          }
        }
      }

      setCurrentStep(3)
      toast.success('Questions saved successfully!')

    } catch (error) {
      toast.error('Failed to save questions')
      console.error('Save questions error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Publish quiz
  const publishQuiz = async () => {
    if (!savedQuizId) return

    try {
      setLoading(true)
      await adminService.publishQuiz(savedQuizId)
      toast.success('Quiz published successfully!')
      navigate('/admin/quizzes')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to publish quiz'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
              ${currentStep >= step
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 ml-4 ${currentStep > step ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  if (loading && currentStep === 1) {
    return <Loading variant="page" text="Loading..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/quizzes')}
              icon={ArrowLeft}
            >
              Back to Quizzes
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Quiz
              </h1>
              <p className="text-gray-600">
                Create an engaging quiz with multiple choice questions
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>

            <form onSubmit={handleSubmit(saveBasicInfo)} className="space-y-6">
              <Input
                label="Quiz Title"
                name="title"
                placeholder="Enter quiz title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getFieldError('title')}
                required
              />

              <Input
                as="textarea"
                label="Description"
                name="description"
                placeholder="Describe what this quiz is about..."
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getFieldError('description')}
                rows={4}
              />

              <Input
                as="select"
                label="Category (Optional)"
                name="category_id"
                value={values.category_id}
                onChange={handleChange}
                options={categories.map(c => ({ value: c.id, label: c.name }))}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  icon={Save}
                >
                  Save & Continue
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Step 2: Add Questions */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Questions ({questions.length})
              </h2>
              <Button
                variant="primary"
                onClick={addQuestion}
                icon={Plus}
              >
                Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No questions yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your first question to get started
                  </p>
                  <Button
                    variant="primary"
                    onClick={addQuestion}
                    icon={Plus}
                  >
                    Add First Question
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                {questions.map((question, questionIndex) => (
                  <Card key={question.id}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Question {questionIndex + 1}
                      </h3>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        icon={Trash2}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Input
                        as="textarea"
                        label="Question Text"
                        placeholder="Enter your question..."
                        value={question.text}
                        rows={3}
                        onChange={(e) =>
                          updateQuestion(question.id, 'text', e.target.value)
                        }
                      />
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-700">
                            Answer Options
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(question.id)}
                            icon={Plus}
                          >
                            Add Option
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={option.id} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`question-${question.id}-correct`}
                                checked={option.is_correct}
                                onChange={() => setCorrectAnswer(question.id, option.id)}
                                className="w-4 h-4 text-primary-600"
                              />
                              <Input
                                placeholder={`Option ${optionIndex + 1}`}
                                value={option.text}
                                onChange={(e) =>
                                  updateOption(
                                    question.id,
                                    option.id,
                                    'text',
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                              {question.options.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(question.id, option.id)}
                                  icon={Trash2}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Select the radio button next to the correct answer
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back to Basic Info
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveQuestions}
                    loading={loading}
                    icon={Save}
                    disabled={questions.length === 0}
                  >
                    Save Questions & Continue
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Review & Publish */}
        {currentStep === 3 && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Review & Publish
            </h2>

            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-sm font-medium text-green-900">
                    Quiz Created Successfully!
                  </h3>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your quiz has been saved with {questions.length} questions.
                  You can now publish it to make it available to users.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Quiz Title</p>
                  <p className="font-medium text-gray-900">{values.title}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="font-medium text-gray-900">{questions.length}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-yellow-600">Draft</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/quizzes')}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="success"
                  onClick={publishQuiz}
                  loading={loading}
                  icon={CheckCircle}
                >
                  Publish Quiz
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default CreateQuiz