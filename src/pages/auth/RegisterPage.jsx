import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import useForm from '../../hooks/useForm'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Form validation rules
  const validationRules = {
    name: {
      required: 'Full name is required',
      minLength: {
        value: 2,
        message: 'Name must be at least 2 characters'
      }
    },
    email: {
      required: 'Email is required',
      email: 'Please enter a valid email address'
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters'
      },
      validate: (value) => {
        if (!/(?=.*[a-z])/.test(value)) {
          return 'Password must contain at least one lowercase letter'
        }
        if (!/(?=.*\d)/.test(value)) {
          return 'Password must contain at least one number'
        }
        return null
      }
    },
    confirmPassword: {
      required: 'Please confirm your password',
      validate: (value, allValues) => {
        if (value !== allValues.password) {
          return 'Passwords do not match'
        }
        return null
      }
    }
  }

  // Form hook
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    isSubmitting
  } = useForm(
    { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    },
    validationRules
  )

  // Handle form submission
  const onSubmit = async (formData) => {
    // Remove confirmPassword from submission data
    const { confirmPassword, ...submitData } = formData
    
    const result = await register(submitData)
    
    if (result.success) {
      navigate('/dashboard', { replace: true })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Join us and start taking quizzes today
          </p>
        </div>

        {/* Register Form */}
        <Card className="mt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('name')}
              leftIcon={User}
              required
              autoComplete="name"
            />

            {/* Email Field */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('email')}
              leftIcon={Mail}
              required
              autoComplete="email"
            />

            {/* Password Field */}
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('password')}
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              required
              autoComplete="new-password"
              helperText="Must contain at least 6 characters with 1 lowercase letter and 1 number"
            />

            {/* Confirm Password Field */}
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('confirmPassword')}
              leftIcon={Lock}
              rightIcon={showConfirmPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              required
              autoComplete="new-password"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              Create Account
            </Button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <Link to="#" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </p>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage