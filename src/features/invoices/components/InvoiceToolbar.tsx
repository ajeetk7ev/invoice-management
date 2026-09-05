import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { hasPermission } from '../../../constants/permissions'
import { useInvoiceStore } from '../store/invoice.store'
import type {
  Invoice,
  InvoiceFilterParams,
  InvoiceSortConfig,
  InvoiceStatus,
} from '../types/invoice.types'
import { CreateInvoiceDialog } from './CreateInvoiceDialog'
import { ExportButton } from './ExportButton'
import { InvoiceFilters } from './InvoiceFilters'
import { InvoiceSearch } from './InvoiceSearch'

interface InvoiceToolbarProps {
  search: string
  onSearchChange: (search: string) => void
  status: InvoiceStatus | 'ALL'
  onStatusChange: (status: InvoiceStatus | 'ALL') => void
  fromDate: string
  toDate: string
  onDateRangeChange: (from?: string, to?: string) => void
  hasActiveFilters: boolean
  onClearAll: () => void
  selectedInvoices: Invoice[]
  filters: InvoiceFilterParams
  sort: InvoiceSortConfig
  totalFilteredCount: number
}

export function InvoiceToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  fromDate,
  toDate,
  onDateRangeChange,
  hasActiveFilters,
  onClearAll,
  selectedInvoices,
  filters,
  sort,
  totalFilteredCount,
}: InvoiceToolbarProps) {
  const currentRole = useInvoiceStore((state) => state.currentRole)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const canCreate = hasPermission(currentRole, 'invoice:create')

  return (
    <div className="space-y-3">
      {/* Top row: Search, Export, Create */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <InvoiceSearch value={search} onChange={onSearchChange} />

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ExportButton
            selectedInvoices={selectedInvoices}
            filters={filters}
            sort={sort}
            totalFilteredCount={totalFilteredCount}
          />

          {canCreate && (
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="h-9 gap-1.5 text-xs font-semibold"
            >
              <Plus className="h-4 w-4" />
              <span>Create Invoice</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom row: Status Pills & Date pickers */}
      <InvoiceFilters
        status={status}
        onStatusChange={onStatusChange}
        fromDate={fromDate}
        toDate={toDate}
        onDateRangeChange={onDateRangeChange}
        hasActiveFilters={hasActiveFilters}
        onClearAll={onClearAll}
      />

      {/* Create Modal */}
      {isCreateOpen && <CreateInvoiceDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />}
    </div>
  )
}
