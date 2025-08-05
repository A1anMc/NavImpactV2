import { useState, useCallback, useMemo, useRef, useEffect } from 'react'

// MY ADDITION: Advanced search types
export interface SearchFilter<T> {
  field: keyof T
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex' | 'range' | 'in' | 'not_in'
  value: any
  caseSensitive?: boolean
}

export interface SortOption<T> {
  field: keyof T
  direction: 'asc' | 'desc'
}

export interface SearchOptions<T> {
  data: T[]
  searchFields: (keyof T)[]
  filters?: SearchFilter<T>[]
  sortOptions?: SortOption<T>[]
  debounceMs?: number
  fuzzySearch?: boolean
  highlightResults?: boolean
  maxResults?: number
  enableVirtualization?: boolean
}

export interface SearchResult<T> {
  item: T
  score: number
  highlights: Record<keyof T, string[]>
  matchedFields: (keyof T)[]
}

export interface UseSearchReturn<T> {
  results: SearchResult<T>[]
  filteredData: T[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  filters: SearchFilter<T>[]
  setFilters: (filters: SearchFilter<T>[]) => void
  sortOptions: SortOption<T>[]
  setSortOptions: (sortOptions: SortOption<T>[]) => void
  isLoading: boolean
  totalResults: number
  performance: {
    searchTime: number
    filterTime: number
    sortTime: number
    lastSearch: number
  }
}

// MY ADDITION: Fuzzy search implementation
const fuzzySearch = (text: string, query: string): number => {
  if (!query) return 1
  
  const textLower = text.toLowerCase()
  const queryLower = query.toLowerCase()
  
  let score = 0
  let queryIndex = 0
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 1
      queryIndex++
    }
  }
  
  return score / queryLower.length
}

// MY ADDITION: Highlight matching text
const highlightText = (text: string, query: string, caseSensitive: boolean = false): string[] => {
  if (!query) return [text]
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, caseSensitive ? 'g' : 'gi')
  const parts = text.split(regex)
  
  return parts.filter(part => part.length > 0)
}

// MY ADDITION: Advanced search hook with performance optimizations
export function useSearch<T extends Record<string, any>>(options: SearchOptions<T>): UseSearchReturn<T> {
  const {
    data,
    searchFields,
    filters = [],
    sortOptions = [],
    debounceMs = 300,
    fuzzySearch: enableFuzzySearch = true,
    highlightResults = true,
    maxResults,
    enableVirtualization = false
  } = options

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // MY ADDITION: Performance tracking
  const performanceRef = useRef({
    searchTime: 0,
    filterTime: 0,
    sortTime: 0,
    lastSearch: 0
  })

  // MY ADDITION: Debounced search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, debounceMs])

  // MY ADDITION: Memoized search results with performance optimization
  const searchResults = useMemo(() => {
    const startTime = Date.now()
    setIsLoading(true)

    try {
      let results: SearchResult<T>[] = []

      // Apply search term
      if (debouncedSearchTerm) {
        results = data.map(item => {
          let maxScore = 0
          let highlights: Record<keyof T, string[]> = {} as Record<keyof T, string[]>
          let matchedFields: (keyof T)[] = []

          for (const field of searchFields) {
            const fieldValue = String(item[field] || '')
            
            if (enableFuzzySearch) {
              const score = fuzzySearch(fieldValue, debouncedSearchTerm)
              if (score > 0.3) { // Threshold for fuzzy matching
                maxScore = Math.max(maxScore, score)
                matchedFields.push(field)
                
                if (highlightResults) {
                  highlights[field] = highlightText(fieldValue, debouncedSearchTerm)
                }
              }
            } else {
              const isMatch = fieldValue.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
              if (isMatch) {
                maxScore = Math.max(maxScore, 1)
                matchedFields.push(field)
                
                if (highlightResults) {
                  highlights[field] = highlightText(fieldValue, debouncedSearchTerm)
                }
              }
            }
          }

          return {
            item,
            score: maxScore,
            highlights,
            matchedFields
          }
        }).filter(result => result.score > 0)
      } else {
        // No search term, include all items with default score
        results = data.map(item => ({
          item,
          score: 1,
          highlights: {} as Record<keyof T, string[]>,
          matchedFields: []
        }))
      }

      performanceRef.current.searchTime = Date.now() - startTime
      performanceRef.current.lastSearch = Date.now()

      return results
    } finally {
      setIsLoading(false)
    }
  }, [data, debouncedSearchTerm, searchFields, enableFuzzySearch, highlightResults])

  // MY ADDITION: Apply filters
  const filteredResults = useMemo(() => {
    const startTime = Date.now()
    
    if (filters.length === 0) {
      performanceRef.current.filterTime = Date.now() - startTime
      return searchResults
    }

    const filtered = searchResults.filter(result => {
      return filters.every(filter => {
        const value = result.item[filter.field]
        const filterValue = filter.value

        switch (filter.operator) {
          case 'equals':
            return value === filterValue
          case 'contains':
            const strValue = String(value || '')
            const strFilter = String(filterValue)
            return filter.caseSensitive 
              ? strValue.includes(strFilter)
              : strValue.toLowerCase().includes(strFilter.toLowerCase())
          case 'starts_with':
            const startValue = String(value || '')
            const startFilter = String(filterValue)
            return filter.caseSensitive
              ? startValue.startsWith(startFilter)
              : startValue.toLowerCase().startsWith(startFilter.toLowerCase())
          case 'ends_with':
            const endValue = String(value || '')
            const endFilter = String(filterValue)
            return filter.caseSensitive
              ? endValue.endsWith(endFilter)
              : endValue.toLowerCase().endsWith(endFilter.toLowerCase())
          case 'regex':
            try {
              const regex = new RegExp(String(filterValue), filter.caseSensitive ? '' : 'i')
              return regex.test(String(value || ''))
            } catch {
              return false
            }
          case 'range':
            if (Array.isArray(filterValue) && filterValue.length === 2) {
              const [min, max] = filterValue
              return value >= min && value <= max
            }
            return false
          case 'in':
            if (Array.isArray(filterValue)) {
              return filterValue.includes(value)
            }
            return false
          case 'not_in':
            if (Array.isArray(filterValue)) {
              return !filterValue.includes(value)
            }
            return false
          default:
            return true
        }
      })
    })

    performanceRef.current.filterTime = Date.now() - startTime
    return filtered
  }, [searchResults, filters])

  // MY ADDITION: Apply sorting
  const sortedResults = useMemo(() => {
    const startTime = Date.now()
    
    if (sortOptions.length === 0) {
      // Default sort by search score
      const sorted = [...filteredResults].sort((a, b) => b.score - a.score)
      performanceRef.current.sortTime = Date.now() - startTime
      return sorted
    }

    const sorted = [...filteredResults].sort((a, b) => {
      for (const sortOption of sortOptions) {
        const aValue = a.item[sortOption.field]
        const bValue = b.item[sortOption.field]
        
        if (aValue < bValue) {
          return sortOption.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortOption.direction === 'asc' ? 1 : -1
        }
      }
      
      // Fallback to search score
      return b.score - a.score
    })

    performanceRef.current.sortTime = Date.now() - startTime
    return sorted
  }, [filteredResults, sortOptions])

  // MY ADDITION: Apply max results limit
  const finalResults = useMemo(() => {
    if (maxResults) {
      return sortedResults.slice(0, maxResults)
    }
    return sortedResults
  }, [sortedResults, maxResults])

  // MY ADDITION: Get filtered data without search metadata
  const filteredData = useMemo(() => {
    return finalResults.map(result => result.item)
  }, [finalResults])

  return {
    results: finalResults,
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters: useCallback((newFilters: SearchFilter<T>[]) => {
      // This would be implemented with state management
    }, []),
    sortOptions,
    setSortOptions: useCallback((newSortOptions: SortOption<T>[]) => {
      // This would be implemented with state management
    }, []),
    isLoading,
    totalResults: finalResults.length,
    performance: performanceRef.current
  }
}

// MY ADDITION: Virtualized search for large datasets
export function useVirtualizedSearch<T>(
  options: SearchOptions<T> & { itemHeight: number; containerHeight: number }
) {
  const searchResults = useSearch(options)
  const { itemHeight, containerHeight } = options

  const visibleItemCount = Math.ceil(containerHeight / itemHeight)
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleItemCount, searchResults.results.length)

  const visibleResults = searchResults.results.slice(startIndex, endIndex)
  const totalHeight = searchResults.results.length * itemHeight

  return {
    ...searchResults,
    visibleResults,
    startIndex,
    endIndex,
    totalHeight,
    itemHeight,
    scrollTop,
    setScrollTop
  }
}

// MY ADDITION: Search suggestions hook
export function useSearchSuggestions<T>(
  data: T[],
  searchFields: (keyof T)[],
  maxSuggestions: number = 5
) {
  const [suggestions, setSuggestions] = useState<T[]>([])

  const updateSuggestions = useCallback((query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    const queryLower = query.toLowerCase()
    const matches: Array<{ item: T; score: number }> = []

    for (const item of data) {
      let maxScore = 0
      
      for (const field of searchFields) {
        const fieldValue = String(item[field] || '')
        const score = fuzzySearch(fieldValue, queryLower)
        maxScore = Math.max(maxScore, score)
      }

      if (maxScore > 0.5) {
        matches.push({ item, score: maxScore })
      }
    }

    const sortedMatches = matches
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSuggestions)
      .map(match => match.item)

    setSuggestions(sortedMatches)
  }, [data, searchFields, maxSuggestions])

  return {
    suggestions,
    updateSuggestions
  }
} 