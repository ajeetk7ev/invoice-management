import { useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { ConfirmDialog } from '../../../components/common/ConfirmDialog'
import { EmptyState } from '../../../components/common/EmptyState'
import { ErrorState } from '../../../components/common/ErrorState'
import { TableSkeleton } from '../../../components/common/LoadingSkeleton'
import { Checkbox } from '../../../components/ui/Checkbox'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../../components/ui/Table'
import { invoiceService } from '../services/invoice.service'
import { useInvoiceStore } from '../store/invoice.store'
import type {
  Invoice,
  InvoiceSortConfig,
  InvoiceSortField,
} from '../types/invoice.types'
import { InvoiceTableRow } from './InvoiceTableRow'

interface InvoiceTableProps {
  invoices: Invoice[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  sort: InvoiceSortConfig
  onSort: (field: InvoiceSortField) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
  // Selection
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  isAllSelected: boolean
  isSomeSelected: boolean
}

export function InvoiceTable({
  invoices,
  isLoading,
  error,
  onRetry,
  sort,
  onSort,
  hasActiveFilters,
  onClearFilters,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
}: InvoiceTableProps) {
  const triggerRefresh = useInvoiceStore((state) => state.triggerRefresh)

  // Single action confirm dialog states
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null)
  const [confirmAction, setConfirmAction] = useState<'MARK_PAID' | 'DELETE' | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const handleConfirmAction = async () => {
    if (!activeInvoice || !confirmAction) return
    setIsActionLoading(true)
    try {
      if (confirmAction === 'MARK_PAID') {
        await invoiceService.updateInvoiceStatus(activeInvoice.id, 'PAID')
      } else if (confirmAction === 'DELETE') {
        await invoiceService.deleteInvoice(activeInvoice.id)
      }
      triggerRefresh()
      setActiveInvoice(null)
      setConfirmAction(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed.')
    } finally {
      setIsActionLoading(false)
    }
  }

  // 1. Error state
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />
  }

  // 2. Loading state
  if (isLoading) {
    return <TableSkeleton rowCount={8} />
  }

  // 3. Empty state
  if (invoices.length === 0) {
    return (
      <EmptyState
        title={hasActiveFilters ? 'No Matching Invoices' : 'No Invoices in System'}
        description={
          hasActiveFilters
            ? 'No invoices match your current search, status, or date range filters.'
            : 'There are currently no invoice records created yet.'
        }
        actionLabel={hasActiveFilters ? 'Clear All Filters' : undefined}
        onAction={hasActiveFilters ? onClearFilters : undefined}
      />
    )
  }

  // Render sort icon based on current sort state
  const renderSortIcon = (field: InvoiceSortField) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50 inline" />
    }
    return sort.direction === 'asc' ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary inline font-bold" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary inline font-bold" />
    )
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Checkbox Column */}
              <TableHead className="w-10 px-4">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all visible invoices"
                />
              </TableHead>

              {/* Invoice # Column */}
              <TableHead
                className="cursor-pointer select-none hover:text-foreground font-semibold"
                onClick={() => onSort('invoiceNumber')}
              >
                <span>Invoice #</span>
                {renderSortIcon('invoiceNumber')}
              </TableHead>

              {/* Customer Column */}
              <TableHead
                className="cursor-pointer select-none hover:text-foreground font-semibold"
                onClick={() => onSort('customer')}
              >
                <span>Customer</span>
                {renderSortIcon('customer')}
              </TableHead>

              {/* Issue Date Column */}
              <TableHead
                className="cursor-pointer select-none hover:text-foreground font-semibold whitespace-nowrap"
                onClick={() => onSort('issueDate')}
              >
                <span>Issue Date</span>
                {renderSortIcon('issueDate')}
              </TableHead>

              {/* Due Date Column */}
              <TableHead
                className="cursor-pointer select-none hover:text-foreground font-semibold whitespace-nowrap"
                onClick={() => onSort('dueDate')}
              >
                <span>Due Date</span>
                {renderSortIcon('dueDate')}
              </TableHead>

              {/* Amount Column */}
              <TableHead
                className="cursor-pointer select-none hover:text-foreground font-semibold text-right"
                onClick={() => onSort('total')}
              >
                <span>Total (INR)</span>
                {renderSortIcon('total')}
              </TableHead>

              {/* Status Column */}
              <TableHead
                className="cursor-pointer select-none hover:text-foreground font-semibold"
                onClick={() => onSort('status')}
              >
                <span>Status</span>
                {renderSortIcon('status')}
              </TableHead>

              {/* Actions Column */}
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices.map((invoice) => (
              <InvoiceTableRow
                key={invoice.id}
                invoice={invoice}
                isSelected={selectedIds.includes(invoice.id)}
                onToggleSelect={onToggleSelect}
                onMarkPaid={(inv) => {
                  setActiveInvoice(inv)
                  setConfirmAction('MARK_PAID')
                }}
                onDelete={(inv) => {
                  setActiveInvoice(inv)
                  setConfirmAction('DELETE')
                }}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Action confirmation dialog */}
      <ConfirmDialog
        open={Boolean(activeInvoice && confirmAction)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveInvoice(null)
            setConfirmAction(null)
          }
        }}
        title={
          confirmAction === 'MARK_PAID'
            ? `Mark ${activeInvoice?.invoiceNumber} as Paid?`
            : `Delete ${activeInvoice?.invoiceNumber}?`
        }
        description={
          confirmAction === 'MARK_PAID'
            ? `This will mark invoice ${activeInvoice?.invoiceNumber} (${activeInvoice?.customer.company}) as fully paid and clear the balance due.`
            : `Are you sure you want to delete invoice ${activeInvoice?.invoiceNumber}? This action cannot be undone.`
        }
        variant={confirmAction === 'DELETE' ? 'destructive' : 'default'}
        confirmText={confirmAction === 'DELETE' ? 'Delete Invoice' : 'Mark as Paid'}
        isLoading={isActionLoading}
        onConfirm={handleConfirmAction}
      />
    </>
  )
}
