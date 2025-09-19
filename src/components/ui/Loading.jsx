import { Loader2 } from 'lucide-react'

function Loading({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  variant = 'spinner' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  if (variant === 'page') {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 py-12">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-500 mb-4`} />
        <p className="text-gray-600 text-lg">{text}</p>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-500`} />
        <span className="text-gray-600">{text}</span>
      </div>
    )
  }

  // Default spinner variant
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-500`} />
    </div>
  )
}

export default Loading