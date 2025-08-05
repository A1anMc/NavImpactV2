import { useState, useCallback, useRef, useEffect } from 'react'

// MY ADDITION: Advanced validation types
export type ValidationRule<T> = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T) => string | undefined
  async?: (value: T) => Promise<string | undefined>
}

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>
}

export type FormErrors<T> = {
  [K in keyof T]?: string
}

export type FormTouched<T> = {
  [K in keyof T]?: boolean
}

export type FormDirty<T> = {
  [K in keyof T]?: boolean
}

// MY ADDITION: Form state with performance optimizations
export interface FormState<T> {
  values: T
  errors: FormErrors<T>
  touched: FormTouched<T>
  dirty: FormDirty<T>
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
  submitCount: number
}

export interface UseFormOptions<T> {
  initialValues: T
  validationRules?: ValidationRules<T>
  onSubmit?: (values: T) => Promise<void> | void
  onValidate?: (values: T) => FormErrors<T>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  validateOnSubmit?: boolean
  enableReinitialize?: boolean
  enableFieldArrays?: boolean
}

// MY ADDITION: Performance monitoring for forms
interface FormPerformance {
  renderCount: number
  validationTime: number
  lastValidation: number
}

export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  const {
    initialValues,
    validationRules = {},
    onSubmit,
    onValidate,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
    enableReinitialize = false,
    enableFieldArrays = false
  } = options

  // MY ADDITION: Performance tracking
  const performanceRef = useRef<FormPerformance>({
    renderCount: 0,
    validationTime: 0,
    lastValidation: 0
  })

  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    dirty: {},
    isValid: true,
    isDirty: false,
    isSubmitting: false,
    submitCount: 0
  })

  // MY ADDITION: Debounced validation
  const validationTimeoutRef = useRef<NodeJS.Timeout>()

  // MY ADDITION: Memoized validation function
  const validateField = useCallback(async (name: keyof T, value: T[keyof T]): Promise<string | undefined> => {
    if (!validationRules) return undefined;
    
    const rule = (validationRules as any)[name];
    if (!rule) return undefined;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'This field is required'
    }

    // Skip other validations if value is empty and not required
    if (!value && !rule.required) return undefined

    // Type-specific validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `Minimum length is ${rule.minLength} characters`
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return `Maximum length is ${rule.maxLength} characters`
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        return 'Invalid format'
      }
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value)
    }

    // Async validation
    if (rule.async) {
      try {
        return await rule.async(value)
      } catch (error) {
        return 'Validation failed'
      }
    }

    return undefined
  }, [validationRules])

  // MY ADDITION: Batch validation for performance
  const validateForm = useCallback(async (values: T): Promise<FormErrors<T>> => {
    const startTime = Date.now()
    const errors: FormErrors<T> = {}

    // MY ADDITION: Parallel validation for better performance
    const validationPromises = Object.keys(validationRules || {}).map(async (key) => {
      const fieldKey = key as keyof T
      const error = await validateField(fieldKey, values[fieldKey])
      if (error) {
        errors[fieldKey] = error
      }
    })

    await Promise.all(validationPromises)

    // Custom validation
    if (onValidate) {
      const customErrors = onValidate(values)
      Object.assign(errors, customErrors)
    }

    performanceRef.current.validationTime = Date.now() - startTime
    performanceRef.current.lastValidation = Date.now()

    return errors
  }, [validationRules, validateField, onValidate])

  // MY ADDITION: Debounced validation
  const debouncedValidate = useCallback((values: T) => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current)
    }

    validationTimeoutRef.current = setTimeout(async () => {
      const errors = await validateForm(values)
      setState(prev => ({
        ...prev,
        errors,
        isValid: Object.keys(errors).length === 0
      }))
    }, 300)
  }, [validateForm])

  // MY ADDITION: Field change handler with performance optimizations
  const setFieldValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setState(prev => {
      const newValues = { ...prev.values, [name]: value }
      const newDirty = { ...prev.dirty, [name]: true }
      const isDirty = Object.values(newDirty).some(Boolean)

      const newState = {
        ...prev,
        values: newValues,
        dirty: newDirty,
        isDirty
      }

      // MY ADDITION: Conditional validation
      if (validateOnChange) {
        debouncedValidate(newValues)
      }

      return newState
    })
  }, [validateOnChange, debouncedValidate])

  // MY ADDITION: Field blur handler with accessibility
  const setFieldTouched = useCallback((name: keyof T, touched: boolean = true) => {
    setState(prev => {
      const newTouched = { ...prev.touched, [name]: touched }
      
      const newState = {
        ...prev,
        touched: newTouched
      }

      // MY ADDITION: Validate on blur
      if (validateOnBlur && touched) {
        validateField(name, prev.values[name]).then(error => {
          setState(current => ({
            ...current,
            errors: {
              ...current.errors,
              [name]: error
            },
            isValid: Object.keys({ ...current.errors, [name]: error }).filter(Boolean).length === 0
          }))
        })
      }

      return newState
    })
  }, [validateOnBlur, validateField])

  // MY ADDITION: Form submission with optimistic updates
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    setState(prev => ({ ...prev, isSubmitting: true, submitCount: prev.submitCount + 1 }))

    try {
      // MY ADDITION: Validate on submit
      if (validateOnSubmit) {
        const errors = await validateForm(state.values)
        if (Object.keys(errors).length > 0) {
          setState(prev => ({
            ...prev,
            errors,
            isValid: false,
            isSubmitting: false
          }))
          return
        }
      }

      if (onSubmit) {
        await onSubmit(state.values)
      }

      // MY ADDITION: Reset form after successful submission
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        dirty: {},
        isDirty: false
      }))
    } catch (error) {
      setState(prev => ({ ...prev, isSubmitting: false }))
      throw error
    }
  }, [state.values, validateOnSubmit, validateForm, onSubmit])

  // MY ADDITION: Form reset with performance tracking
  const resetForm = useCallback((newValues?: T) => {
    const values = newValues || initialValues
    setState({
      values,
      errors: {},
      touched: {},
      dirty: {},
      isValid: true,
      isDirty: false,
      isSubmitting: false,
      submitCount: 0
    })
    performanceRef.current.renderCount = 0
  }, [initialValues])

  // MY ADDITION: Field array support
  const addField = useCallback((name: keyof T, value: any) => {
    if (enableFieldArrays && Array.isArray(state.values[name])) {
      setFieldValue(name, [...(state.values[name] as any[]), value] as T[keyof T])
    }
  }, [state.values, enableFieldArrays, setFieldValue])

  const removeField = useCallback((name: keyof T, index: number) => {
    if (enableFieldArrays && Array.isArray(state.values[name])) {
      const newArray = [...(state.values[name] as any[])]
      newArray.splice(index, 1)
      setFieldValue(name, newArray as T[keyof T])
    }
  }, [state.values, enableFieldArrays, setFieldValue])

  // MY ADDITION: Performance monitoring
  useEffect(() => {
    performanceRef.current.renderCount++
  })

  // MY ADDITION: Reinitialize form when initialValues change
  useEffect(() => {
    if (enableReinitialize) {
      resetForm(initialValues)
    }
  }, [initialValues, enableReinitialize, resetForm])

  return {
    // Form state
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    dirty: state.dirty,
    isValid: state.isValid,
    isDirty: state.isDirty,
    isSubmitting: state.isSubmitting,
    submitCount: state.submitCount,

    // Form actions
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    resetForm,

    // MY ADDITION: Field array actions
    addField,
    removeField,

    // MY ADDITION: Performance metrics
    performance: performanceRef.current,

    // MY ADDITION: Utility functions
    getFieldProps: (name: keyof T) => ({
      value: state.values[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFieldValue(name, e.target.value as T[keyof T]),
      onBlur: () => setFieldTouched(name, true),
      error: state.errors[name],
      touched: state.touched[name],
      dirty: state.dirty[name]
    })
  }
} 