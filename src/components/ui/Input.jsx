import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

const Input = forwardRef(({
  label,
  name,
  as = 'input',          // 👉 NEW: 'input' | 'textarea' | 'select'
  type = 'text',   
  options = [],      
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  rows = 4,              
  ...props
}, ref) => {
  
  const baseClasses = `
    w-full rounded-lg border border-gray-300
    bg-gray-50 placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    px-4 py-2 text-sm
    ${error ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${LeftIcon ? 'pl-10' : ''}
    ${RightIcon ? 'pr-10' : ''}
    ${className}
  `.trim()

  const renderField = () => {
    if (as === 'textarea') {
      return (
        <textarea
          ref={ref}
          name={name}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={baseClasses}
          {...props}
        />
      )
    }

    if (as === 'select') {
      return (
        <select
          ref={ref}
          name={name}
          id={name}
          disabled={disabled}
          className={baseClasses}
          {...props}
        >
          <option value="">{placeholder || 'Select option'}</option>
          {options.map((opt) => (
            <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
              {opt.label ?? opt.name}
            </option>
          ))}
        </select>
      )
    }

    // default = input
    return (
      <input
        ref={ref}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        className={baseClasses}
        {...props}
      />
    )
  }

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        {renderField()}

        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {onRightIconClick ? (
              <button
                type="button"
                onClick={onRightIconClick}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RightIcon className="h-5 w-5" />
              </button>
            ) : (
              <RightIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
