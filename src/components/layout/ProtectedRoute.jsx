import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loading from '../ui/Loading'

function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireAdmin = false, 
  redirectTo = '/login' 
}) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Show loading while checking auth status
  if (loading) {
    return <Loading variant="page" text="Checking authentication..." />
  }

  // Redirect to login if authentication required but user not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    )
  }

  // Redirect if admin access required but user is not admin
  if (requireAdmin && !isAdmin()) {
    return (
      <Navigate 
        to="/dashboard" 
        replace 
      />
    )
  }

  // Render children if all checks pass
  return children
}

export default ProtectedRoute