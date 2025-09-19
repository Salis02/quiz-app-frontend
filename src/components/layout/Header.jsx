import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  User, 
  LogOut, 
  BookOpen, 
  BarChart3, 
  Settings,
  Menu,
  X 
} from 'lucide-react'
import { useState } from 'react'

function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
              onClick={closeMobileMenu}
            >
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">QuizApp</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {/* User Navigation */}
                {!isAdmin() && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/results" 
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      My Results
                    </Link>
                  </>
                )}

                {/* Admin Navigation */}
                {isAdmin() && (
                  <>
                    <Link 
                      to="/admin" 
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Admin Panel
                    </Link>
                    <Link 
                      to="/admin/quizzes" 
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Manage Quizzes
                    </Link>
                  </>
                )}

                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                    <User className="w-5 h-5" />
                    <span>{user?.name}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      {user?.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Guest Navigation */
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b">
                    Welcome, {user?.name}
                  </div>
                  
                  {!isAdmin() && (
                    <>
                      <Link 
                        to="/dashboard" 
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/results" 
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        My Results
                      </Link>
                    </>
                  )}

                  {isAdmin() && (
                    <>
                      <Link 
                        to="/admin" 
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        Admin Panel
                      </Link>
                      <Link 
                        to="/admin/quizzes" 
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        Manage Quizzes
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 btn btn-primary text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header