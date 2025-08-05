import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'

// MY ADDITION: Performance monitoring
interface PerformanceMetrics {
  startTime: number
  endTime?: number
  duration?: number
  cacheHit: boolean
  retryCount: number
}

// MY ADDITION: Advanced caching configuration
interface CacheConfig {
  staleTime: number
  cacheTime: number
  retryCount: number
  retryDelay: number
}

// MY ADDITION: Error handling with categorization
interface ApiError {
  code: string
  message: string
  category: 'network' | 'validation' | 'authorization' | 'server' | 'unknown'
  retryable: boolean
}

export interface UseApiDataOptions<T> {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  headers?: Record<string, string>
  cacheConfig?: Partial<CacheConfig>
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  onPerformance?: (metrics: PerformanceMetrics) => void
  enabled?: boolean
  refetchInterval?: number
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
}

export interface UseApiDataReturn<T> {
  data: T | undefined
  isLoading: boolean
  isError: boolean
  error: ApiError | null
  refetch: () => void
  performance: PerformanceMetrics
  cacheStatus: 'fresh' | 'stale' | 'expired'
}

// MY ADDITION: Performance monitoring hook
const usePerformanceMonitoring = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    startTime: Date.now(),
    cacheHit: false,
    retryCount: 0
  })

  const startTimer = useCallback(() => {
    metricsRef.current.startTime = Date.now()
    metricsRef.current.cacheHit = false
    metricsRef.current.retryCount = 0
  }, [])

  const endTimer = useCallback(() => {
    metricsRef.current.endTime = Date.now()
    metricsRef.current.duration = metricsRef.current.endTime - metricsRef.current.startTime
  }, [])

  const incrementRetry = useCallback(() => {
    metricsRef.current.retryCount++
  }, [])

  const setCacheHit = useCallback((hit: boolean) => {
    metricsRef.current.cacheHit = hit
  }, [])

  return {
    metrics: metricsRef.current,
    startTimer,
    endTimer,
    incrementRetry,
    setCacheHit
  }
}

// MY ADDITION: Error categorization utility
const categorizeError = (error: any): ApiError => {
  if (error?.response?.status) {
    const status = error.response.status
    
    if (status >= 500) {
      return {
        code: `HTTP_${status}`,
        message: error.message || 'Server error occurred',
        category: 'server',
        retryable: true
      }
    } else if (status === 401) {
      return {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
        category: 'authorization',
        retryable: false
      }
    } else if (status === 403) {
      return {
        code: 'FORBIDDEN',
        message: 'Access denied',
        category: 'authorization',
        retryable: false
      }
    } else if (status === 422) {
      return {
        code: 'VALIDATION_ERROR',
        message: error.response?.data?.message || 'Validation error',
        category: 'validation',
        retryable: false
      }
    } else if (status >= 400) {
      return {
        code: `HTTP_${status}`,
        message: error.message || 'Request failed',
        category: 'validation',
        retryable: false
      }
    }
  }
  
  if (error?.code === 'NETWORK_ERROR') {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed',
      category: 'network',
      retryable: true
    }
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: error?.message || 'An unknown error occurred',
    category: 'unknown',
    retryable: true
  }
}

// MY ADDITION: Advanced API data hook with performance monitoring
export function useApiData<T = any>(options: UseApiDataOptions<T>): UseApiDataReturn<T> {
  const {
    endpoint,
    method = 'GET',
    body,
    headers = {},
    cacheConfig = {},
    onSuccess,
    onError,
    onPerformance,
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus = true,
    refetchOnReconnect = true
  } = options

  const queryClient = useQueryClient()
  const performance = usePerformanceMonitoring()
  const [cacheStatus, setCacheStatus] = useState<'fresh' | 'stale' | 'expired'>('fresh')

  // MY ADDITION: Default cache configuration
  const defaultCacheConfig: CacheConfig = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retryCount: 3,
    retryDelay: 1000
  }

  const finalCacheConfig = { ...defaultCacheConfig, ...cacheConfig }

  // MY ADDITION: Query key with method and body for proper caching
  const queryKey = [endpoint, method, body ? JSON.stringify(body) : undefined]

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      performance.startTimer()
      
      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: body ? JSON.stringify(body) : undefined
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        performance.endTimer()
        
        if (onSuccess) {
          onSuccess(data)
        }
        
        if (onPerformance) {
          onPerformance(performance.metrics)
        }

        return data
      } catch (error) {
        performance.endTimer()
        const categorizedError = categorizeError(error)
        
        if (onError) {
          onError(categorizedError)
        }
        
        if (onPerformance) {
          onPerformance(performance.metrics)
        }

        throw categorizedError
      }
    },
    enabled,
    staleTime: finalCacheConfig.staleTime,
    gcTime: finalCacheConfig.cacheTime,
    retry: (failureCount, error) => {
      const categorizedError = categorizeError(error)
      performance.incrementRetry()
      
      if (!categorizedError.retryable || failureCount >= finalCacheConfig.retryCount) {
        return false
      }
      
      return true
    },
    retryDelay: finalCacheConfig.retryDelay,
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnReconnect
  })

  // MY ADDITION: Success and error handling
  useEffect(() => {
    if (query.isSuccess) {
      setCacheStatus('fresh')
      options.onSuccess?.(query.data)
    }
  }, [query.isSuccess, query.data, options])

  useEffect(() => {
    if (query.isError && query.error) {
      const categorizedError = categorizeError(query.error)
      if (categorizedError.category === 'network') {
        setCacheStatus('expired')
      }
      options.onError?.(categorizedError)
    }
  }, [query.isError, query.error, options])

  // MY ADDITION: Cache status monitoring
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey === queryKey) {
        const queryState = queryClient.getQueryState(queryKey)
        if (queryState) {
          const now = Date.now()
          const lastUpdated = queryState.dataUpdatedAt
          const staleTime = finalCacheConfig.staleTime
          
          if (now - lastUpdated < staleTime) {
            setCacheStatus('fresh')
          } else if (now - lastUpdated < finalCacheConfig.cacheTime) {
            setCacheStatus('stale')
          } else {
            setCacheStatus('expired')
          }
        }
      }
    })

    return unsubscribe
  }, [queryKey, queryClient, finalCacheConfig])

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ? categorizeError(query.error) : null,
    refetch: query.refetch,
    performance: performance.metrics,
    cacheStatus
  }
}

// MY ADDITION: Optimistic updates hook
export function useOptimisticUpdate<T>(
  queryKey: string[],
  updateFn: (oldData: T) => T
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newData: T) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100))
      return newData
    },
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey })

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey)

      // Optimistically update
      queryClient.setQueryData(queryKey, updateFn)

      return { previousData }
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey })
    }
  })
}

// MY ADDITION: Infinite scroll hook
export function useInfiniteApiData<T>(
  endpoint: string,
  pageSize: number = 20,
  options?: Omit<UseApiDataOptions<T[]>, 'endpoint'>
) {
  return useInfiniteQuery({
    queryKey: [endpoint, 'infinite'],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`${endpoint}?page=${pageParam}&limit=${pageSize}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return response.json()
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length + 1 : undefined
    },
    ...options
  })
} 