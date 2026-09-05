import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorState } from '../components/common/ErrorState'
import { DetailsSkeleton } from '../components/common/LoadingSkeleton'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { InvoiceDetails } from '../features/invoices/components/InvoiceDetails'
import { invoiceService } from '../features/invoices/services/invoice.service'
import { useInvoiceStore } from '../features/invoices/store/invoice.store'
import type { Invoice } from '../features/invoices/types/invoice.types'

export default function InvoiceDetailsPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const refreshKey = useInvoiceStore((state) => state.refreshKey)
  const isSimulatingError = useInvoiceStore((state) => state.isSimulatingError)

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoice = useCallback(async () => {
    if (!invoiceId) {
      setError('Invoice identifier parameter is missing from the URL.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const data = await invoiceService.getInvoiceById(invoiceId)
      setInvoice(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve invoice details.')
    } finally {
      setIsLoading(false)
    }
  }, [invoiceId])

  useEffect(() => {
    fetchInvoice()
  }, [fetchInvoice, refreshKey, isSimulatingError])

  return (
    <DashboardLayout>
      {isLoading ? (
        <DetailsSkeleton />
      ) : error ? (
        <ErrorState
          title="Invoice Not Found"
          message={error}
          onRetry={fetchInvoice}
        />
      ) : invoice ? (
        <InvoiceDetails invoice={invoice} onInvoiceUpdated={setInvoice} />
      ) : null}
    </DashboardLayout>
  )
}
