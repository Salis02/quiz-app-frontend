import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  BookOpen, 
  Users, 
  TrendingUp,
  Eye,
  Edit,
  Settings,
  BarChart3,
  Calendar,
  Clock,
  Trophy
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { adminService } from '../../services/adminService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import toast from 'react-hot-toast'

function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    publishedQuizzes: 0,
    totalCategories: 0,
    totalAttempts: 0
  })
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load quizzes
      const quizzesResponse = await adminService.getAllQuizzes()
      const quizzes = quizzesResponse.data
      
      // Load categories
      const categoriesResponse = await adminService.getCategories()
      const cats = categoriesResponse.data
      
      // Calculate stats
      const totalAttempts = quizzes.reduce((sum, quiz) => sum + (quiz._count?.results || 0), 0)
      const publishedCount = quizzes.filter(q => q.published).length
      
      setStats({
        totalQuizzes: quizzes.length,
        publishedQuizzes: publishedCount,
        totalCategories: cats.length,
        totalAttempts: totalAttempts
      })
      
      setRecentQuizzes(quizzes.slice(0, 5))
      setCategories(cats)
      
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
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
      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Published
      </span>
    ) : (
      <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
        Draft
      </span>
    )
  }

  if (loading) {
    return <Loading variant="page" text="Loading admin dashboard..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Manage your quizzes and view analytics.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            variant="primary"
            onClick={() => navigate('/admin/quiz/create')}
            icon={Plus}
            className="h-20 flex-col"
          >
            <span className="text-sm font-medium">Create New Quiz</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/admin/categories')}
            icon={BookOpen}
            className="h-20 flex-col"
          >
            <span className="text-sm font-medium">Manage Categories</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/admin/quizzes')}
            icon={Settings}
            className="h-20 flex-col"
          >
            <span className="text-sm font-medium">All Quizzes</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/admin/analytics')}
            icon={BarChart3}
            className="h-20 flex-col"
          >
            <span className="text-sm font-medium">Analytics</span>
          </Button>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalQuizzes}
                </p>
                <p className="text-xs text-gray-500">
                  {stats.publishedQuizzes} published
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quiz Attempts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAttempts}
                </p>
                <p className="text-xs text-gray-500">
                  Total completions
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCategories}
                </p>
                <p className="text-xs text-gray-500">
                  Active categories
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. per Quiz</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalQuizzes > 0 ? Math.round(stats.totalAttempts / stats.totalQuizzes) : 0}
                </p>
                <p className="text-xs text-gray-500">
                  Attempts per quiz
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Quizzes */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Quizzes
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin/quizzes')}
                  icon={Eye}
                >
                  View All
                </Button>
              </div>

              {recentQuizzes.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No quizzes created yet</p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/admin/quiz/create')}
                    icon={Plus}
                    className="mt-4"
                  >
                    Create Your First Quiz
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900">
                            {quiz.title}
                          </h3>
                          {getStatusBadge(quiz.published)}
                        </div>
                        
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
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
                            {formatDate(quiz.created_at)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/quiz/${quiz.id}/edit`)}
                          icon={Edit}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/quiz/${quiz.id}/results`)}
                          icon={BarChart3}
                        >
                          Results
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Stats & Categories */}
          <div className="space-y-6">
            
            {/* Categories Overview */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              
              {categories.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-3">No categories yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/categories')}
                    icon={Plus}
                  >
                    Create Category
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.slice(0, 5).map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-600">
                          {category._count?.quizzes || 0} quizzes
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {categories.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/admin/categories')}
                      className="w-full mt-3"
                    >
                      View All Categories
                    </Button>
                  )}
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/quiz/create')}
                  icon={Plus}
                  className="w-full justify-start"
                >
                  Create New Quiz
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/categories/create')}
                  icon={BookOpen}
                  className="w-full justify-start"
                >
                  Add Category
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/analytics')}
                  icon={BarChart3}
                  className="w-full justify-start"
                >
                  View Analytics
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/settings')}
                  icon={Settings}
                  className="w-full justify-start"
                >
                  Settings
                </Button>
              </div>
            </Card>

            {/* Performance Summary */}
            <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">
                📊 Performance Overview
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-700">Published Quizzes:</span>
                  <span className="font-medium text-primary-900">
                    {stats.publishedQuizzes} / {stats.totalQuizzes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Total Attempts:</span>
                  <span className="font-medium text-primary-900">
                    {stats.totalAttempts}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Avg. per Quiz:</span>
                  <span className="font-medium text-primary-900">
                    {stats.totalQuizzes > 0 ? Math.round(stats.totalAttempts / stats.totalQuizzes) : 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard