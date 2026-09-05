import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_PAGE_SIZE, DEFAULT_SORT_DIRECTION, DEFAULT_SORT_FIELD } from '../../../constants/invoice'
import type {
  InvoiceFilterParams,
  InvoiceSortConfig,
  InvoiceSortField,
  InvoiceStatus,
  PaginationParams,
  SortDirection,
} from '../types/invoice.types'

export function useInvoiceFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Extract from query params with safe defaults
  const page = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10)
    return isNaN(p) || p < 1 ? 1 : p
  }, [searchParams])

  const pageSize = useMemo(() => {
    const ps = parseInt(searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE), 10)
    return isNaN(ps) || ps < 1 ? DEFAULT_PAGE_SIZE : ps
  }, [searchParams])

  const search = useMemo(() => searchParams.get('search') || '', [searchParams])

  const status = useMemo<InvoiceStatus | 'ALL'>(() => {
    const s = searchParams.get('status')?.toUpperCase()
    if (s === 'PAID' || s === 'PENDING' || s === 'OVERDUE' || s === 'DRAFT') {
      return s as InvoiceStatus
    }
    return 'ALL'
  }, [searchParams])

  const fromDate = useMemo(() => searchParams.get('from') || '', [searchParams])
  const toDate = useMemo(() => searchParams.get('to') || '', [searchParams])

  const sortField = useMemo<InvoiceSortField>(() => {
    const sf = searchParams.get('sort') as InvoiceSortField
    const validFields: InvoiceSortField[] = ['invoiceNumber', 'customer', 'issueDate', 'dueDate', 'total', 'status']
    return validFields.includes(sf) ? sf : DEFAULT_SORT_FIELD
  }, [searchParams])

  const sortDirection = useMemo<SortDirection>(() => {
    const sd = searchParams.get('direction') as SortDirection
    return sd === 'asc' || sd === 'desc' ? sd : DEFAULT_SORT_DIRECTION
  }, [searchParams])

  // Helper to update search params while maintaining history or replacing
  const updateParams = useCallback(
    (updater: (prev: URLSearchParams) => void) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        updater(next)
        return next
      })
    },
    [setSearchParams]
  )

  const setSearch = useCallback(
    (newSearch: string) => {
      updateParams((params) => {
        if (newSearch.trim()) {
          params.set('search', newSearch.trim())
        } else {
          params.delete('search')
        }
        params.set('page', '1') // Reset to page 1 on search change
      })
    },
    [updateParams]
  )

  const setStatus = useCallback(
    (newStatus: InvoiceStatus | 'ALL') => {
      updateParams((params) => {
        if (newStatus && newStatus !== 'ALL') {
          params.set('status', newStatus)
        } else {
          params.delete('status')
        }
        params.set('page', '1') // Reset to page 1 on status change
      })
    },
    [updateParams]
  )

  const setDateRange = useCallback(
    (from?: string, to?: string) => {
      updateParams((params) => {
        if (from) {
          params.set('from', from)
        } else {
          params.delete('from')
        }
        if (to) {
          params.set('to', to)
        } else {
          params.delete('to')
        }
        params.set('page', '1') // Reset to page 1 on date filter change
      })
    },
    [updateParams]
  )

  const toggleSort = useCallback(
    (field: InvoiceSortField) => {
      updateParams((params) => {
        const currentField = params.get('sort') || DEFAULT_SORT_FIELD
        const currentDirection = (params.get('direction') as SortDirection) || DEFAULT_SORT_DIRECTION

        if (currentField === field) {
          // Toggle direction
          params.set('direction', currentDirection === 'asc' ? 'desc' : 'asc')
        } else {
          params.set('sort', field)
          params.set('direction', 'asc')
        }
      })
    },
    [updateParams]
  )

  const setPage = useCallback(
    (newPage: number) => {
      updateParams((params) => {
        params.set('page', String(newPage))
      })
    },
    [updateParams]
  )

  const setPageSize = useCallback(
    (newPageSize: number) => {
      updateParams((params) => {
        params.set('pageSize', String(newPageSize))
        params.set('page', '1')
      })
    },
    [updateParams]
  )

  const clearAllFilters = useCallback(() => {
    updateParams((params) => {
      params.delete('search')
      params.delete('status')
      params.delete('from')
      params.delete('to')
      params.set('page', '1')
    })
  }, [updateParams])

  const hasActiveFilters = Boolean(search || status !== 'ALL' || fromDate || toDate)

  // Memoized filters and configs for service calls
  const filters = useMemo<InvoiceFilterParams>(
    () => ({
      search,
      status,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [search, status, fromDate, toDate]
  )

  const sort = useMemo<InvoiceSortConfig>(
    () => ({
      field: sortField,
      direction: sortDirection,
    }),
    [sortField, sortDirection]
  )

  const pagination = useMemo<PaginationParams>(
    () => ({
      page,
      pageSize,
    }),
    [page, pageSize]
  )

  return {
    page,
    pageSize,
    search,
    status,
    fromDate,
    toDate,
    sortField,
    sortDirection,
    filters,
    sort,
    pagination,
    hasActiveFilters,
    setSearch,
    setStatus,
    setDateRange,
    toggleSort,
    setPage,
    setPageSize,
    clearAllFilters,
  }
}
