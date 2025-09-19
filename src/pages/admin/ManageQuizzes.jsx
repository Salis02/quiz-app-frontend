import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3,
  Search,
  Filter,
  BookOpen,
  Users,
  Calendar,
  ArrowLeft,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { adminService } from '../../services/adminService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Loading from '../../components/ui/Loading'
import toast from 'react-hot-toast'

function ManageQuizzes() {
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [quizzes, setQuizzes] = useState([])
  const [filteredQuizzes, setFilteredQuizzes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all, published, draft
  const [categories, setCategories] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterQuizzes()
  }, [quizzes, searchTerm, statusFilter, categoryFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [quizzesResponse, categoriesResponse] = await Promise.all([
        adminService.getAllQuizzes(),
        adminService.getCategories()
      ])
      
      setQuizzes(quizzesResponse.data)
      setCategories(categoriesResponse.data)
      
    } catch (error) {
      toast.error('Failed to load quizzes')
      console.error('Load quizzes error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterQuizzes = () => {
    let filtered = quizzes

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quiz => {
        if (statusFilter === 'published') return quiz.published
        if (statusFilter === 'draft') return !quiz.published
        return true
      })
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(quiz => 
        quiz.category_id === parseInt(categoryFilter)
      )
    }

    setFilteredQuizzes(filtered)
  }

  const handleTogglePublish = async (quizId, currentStatus) => {
    try {
      if (currentStatus) {
        // Unpublish - we'll need to add this endpoint
        await adminService.unpublishQuiz(quizId)
        toast.success('Quiz unpublished successfully')
      } else {
        await adminService.publishQuiz(quizId)
        toast.success('Quiz published successfully')
      }
      
      // Reload data
      loadData()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quiz status'
      toast.error(message)
    }
  }

  const handleDeleteQuiz = async (quizId, quizTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      await adminService.deleteQuiz(quizId)
      toast.success('Quiz deleted successfully')
      loadData()
    } catch (error) {
      toast.error('Failed to delete quiz')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (published) => {
    return published ? (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        <CheckCircle className="w-3 h-3 mr-1" />
        Published
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
        <XCircle className="w-3 h-3 mr-1" />
        Draft
      </span>
    )
  }

  if (loading) {
    return <Loading variant="page" text="Loading quizzes..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              icon={ArrowLeft}
            >
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Quizzes
              </h1>
              <p className="text-gray-600">
                Create, edit, and manage all your quizzes
              </p>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={() => navigate('/admin/quiz/create')}
            icon={Plus}
          >
            Create New Quiz
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={Search}
              />
            </div>

            {/* Status Filter */}
            <div className="sm:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredQuizzes.length} of {quizzes.length} quizzes
          </p>
        </div>

        {/* Quizzes List */}
        {filteredQuizzes.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {quizzes.length === 0 ? 'No quizzes yet' : 'No quizzes match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {quizzes.length === 0 
                  ? 'Create your first quiz to get started'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {quizzes.length === 0 && (
                <Button
                  variant="primary"
                  onClick={() => navigate('/admin/quiz/create')}
                  icon={Plus}
                >
                  Create Your First Quiz
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {quiz.title}
                          </h3>
                          {getStatusBadge(quiz.published)}
                        </div>
                        
                        {quiz.description && (
                          <p className="text-gray-600 text-sm mb-3">
                            {quiz.description}
                          </p>
                        )}

                        {/* Category */}
                        {quiz.category && (
                          <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
                            {quiz.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600"></div>
                    <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {quiz._count?.questions || 0} questions
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {quiz._count?.results || 0} attempts
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Created {formatDate(quiz.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/quiz/${quiz.id}/edit`)}
                      icon={Edit}
                      title="Edit Quiz"
                    >
                      Edit
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/quiz/${quiz.id}/results`)}
                      icon={BarChart3}
                      title="View Results"
                    >
                      Results
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                      icon={Eye}
                      title="Preview Quiz"
                    >
                      Preview
                    </Button>

                    <Button
                      variant={quiz.published ? "outline" : "primary"}
                      size="sm"
                      onClick={() => handleTogglePublish(quiz.id, quiz.published)}
                      icon={quiz.published ? XCircle : CheckCircle}
                    >
                      {quiz.published ? 'Unpublish' : 'Publish'}
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                      icon={Trash2}
                      title="Delete Quiz"
                    >
                      Delete
                    </Button>
                  </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageQuizzes