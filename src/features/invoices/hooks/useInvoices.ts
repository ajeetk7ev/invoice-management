import { useCallback, useEffect, useState } from 'react'
import { invoiceService } from '../services/invoice.service'
import { useInvoiceStore } from '../store/invoice.store'
import type {
  Invoice,
  InvoiceFilterParams,
  InvoiceSortConfig,
  InvoiceStats,
  PaginationMeta,
  PaginationParams,
} from '../types/invoice.types'

interface UseInvoicesProps {
  filters: InvoiceFilterParams
  sort: InvoiceSortConfig
  pagination: PaginationParams
}

export function useInvoices({ filters, sort, pagination }: UseInvoicesProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  })
  const [stats, setStats] = useState<InvoiceStats | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refreshKey = useInvoiceStore((state) => state.refreshKey)
  const isSimulatingError = useInvoiceStore((state) => state.isSimulatingError)

  // Fetch paginated invoices
  const fetchInvoices = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await invoiceService.getInvoices({
        filters,
        sort,
        pagination,
      })
      setInvoices(response.data)
      setMeta(response.meta)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while fetching invoices.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters, sort, pagination])

  // Fetch overall statistics
  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true)
    try {
      const statsData = await invoiceService.getInvoiceStats()
      setStats(statsData)
    } catch {
      // In error simulation, we let error handle main UI
    } finally {
      setIsStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices, refreshKey, isSimulatingError])

  useEffect(() => {
    fetchStats()
  }, [fetchStats, refreshKey, isSimulatingError])

  const refetch = useCallback(() => {
    fetchInvoices()
    fetchStats()
  }, [fetchInvoices, fetchStats])

  return {
    invoices,
    meta,
    stats,
    isLoading,
    isStatsLoading,
    error,
    refetch,
  }
}
