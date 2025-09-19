import { useState } from 'react'

function useForm(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setValues(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle input blur (when user leaves field)
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    // Validate field on blur
    validateField(name, values[name])
  }

  // Validate single field
  const validateField = (fieldName, value) => {
    const rule = validationRules[fieldName]
    if (!rule) return true

    let error = ''

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      error = rule.required
    }
    // Min length validation
    else if (rule.minLength && value && value.length < rule.minLength.value) {
      error = rule.minLength.message
    }
    // Email validation
    else if (rule.email && value && !/\S+@\S+\.\S+/.test(value)) {
      error = rule.email
    }
    // Custom validation
    else if (rule.validate && value) {
      const customError = rule.validate(value, values)
      if (customError) error = customError
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))

    return !error
  }

  // Validate all fields
  const validateForm = () => {
    let isValid = true
    const newErrors = {}

    Object.keys(validationRules).forEach(fieldName => {
      const isFieldValid = validateField(fieldName, values[fieldName])
      if (!isFieldValid) {
        isValid = false
        newErrors[fieldName] = errors[fieldName]
      }
    })

    // Mark all fields as touched
    const allTouched = {}
    Object.keys(validationRules).forEach(fieldName => {
      allTouched[fieldName] = true
    })
    setTouched(allTouched)

    return isValid
  }

  // Handle form submission
const handleSubmit = (onSubmit) => {
  return async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
}


  // Reset form
  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }

  // Check if field has error and is touched
  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName]
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldError,
    validateForm,
    setValues,
    setErrors,
  }
}

export default useForm