import { Calendar, FilterX } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { INVOICE_STATUSES, type InvoiceStatusFilter } from '../../../constants/invoice'
import { STATUS_COLORS } from '../../../constants/colors'
import type { InvoiceStatus } from '../types/invoice.types'

interface InvoiceFiltersProps {
  status: InvoiceStatus | 'ALL'
  onStatusChange: (status: InvoiceStatus | 'ALL') => void
  fromDate: string
  toDate: string
  onDateRangeChange: (from?: string, to?: string) => void
  hasActiveFilters: boolean
  onClearAll: () => void
}

export function InvoiceFilters({
  status,
  onStatusChange,
  fromDate,
  toDate,
  onDateRangeChange,
  hasActiveFilters,
  onClearAll,
}: InvoiceFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter Buttons */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
        {INVOICE_STATUSES.map((st: InvoiceStatusFilter) => {
          const isActive = status === st
          const dotColor =
            st === 'PAID'
              ? STATUS_COLORS.PAID.dot
              : st === 'PENDING'
              ? STATUS_COLORS.PENDING.dot
              : st === 'OVERDUE'
              ? STATUS_COLORS.OVERDUE.dot
              : st === 'DRAFT'
              ? STATUS_COLORS.DRAFT.dot
              : 'bg-primary'

          return (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(st)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
              aria-pressed={isActive}
            >
              {st !== 'ALL' && (
                <span className={`h-2 w-2 rounded-full ${dotColor}`} aria-hidden="true" />
              )}
              <span>{st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}</span>
            </button>
          )
        })}
      </div>

      {/* Date Range Inputs */}
      <div className="flex items-center gap-2 bg-background border border-input rounded-md px-3 py-1.5 text-xs shadow-xs">
        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">From:</span>
        <input
          type="date"
          value={fromDate}
          max={toDate || undefined}
          onChange={(e) => onDateRangeChange(e.target.value || undefined, toDate || undefined)}
          className="bg-transparent border-0 text-xs text-foreground p-0 w-[115px] focus:outline-none focus:ring-0 cursor-pointer"
          aria-label="Filter from date"
        />
        <span className="text-muted-foreground font-semibold text-[11px] uppercase tracking-wider ml-1">To:</span>
        <input
          type="date"
          value={toDate}
          min={fromDate || undefined}
          onChange={(e) => onDateRangeChange(fromDate || undefined, e.target.value || undefined)}
          className="bg-transparent border-0 text-xs text-foreground p-0 w-[115px] focus:outline-none focus:ring-0 cursor-pointer"
          aria-label="Filter to date"
        />
        {(fromDate || toDate) && (
          <button
            type="button"
            onClick={() => onDateRangeChange(undefined, undefined)}
            className="text-muted-foreground hover:text-foreground text-xs ml-1 px-1.5 py-0.5 rounded hover:bg-muted font-bold"
            title="Clear date range"
          >
            ×
          </button>
        )}
      </div>

      {/* Reset Filters button if any are active */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
        >
          <FilterX className="h-3.5 w-3.5" />
          <span>Clear Filters</span>
        </Button>
      )}
    </div>
  )
}
