import { StatsCardSkeleton } from '../../../components/common/LoadingSkeleton'
import { useInvoiceFilters } from '../hooks/useInvoiceFilters'
import { useInvoices } from '../hooks/useInvoices'
import { useInvoiceSelection } from '../hooks/useInvoiceSelection'
import { BulkActions } from './BulkActions'
import { InvoicePagination } from './InvoicePagination'
import { InvoiceStats } from './InvoiceStats'
import { InvoiceTable } from './InvoiceTable'
import { InvoiceToolbar } from './InvoiceToolbar'

export function InvoiceDashboard() {
  const {
    search,
    status,
    fromDate,
    toDate,
    sort,
    filters,
    pagination,
    hasActiveFilters,
    setSearch,
    setStatus,
    setDateRange,
    toggleSort,
    setPage,
    setPageSize,
    clearAllFilters,
  } = useInvoiceFilters()

  const { invoices, meta, stats, isLoading, isStatsLoading, error, refetch } = useInvoices({
    filters,
    sort,
    pagination,
  })

  const {
    selectedIds,
    selectedCount,
    isAllVisibleSelected,
    isSomeVisibleSelected,
    toggleSelectInvoice,
    toggleSelectAllVisible,
    clearSelection,
    getSelectedVisibleInvoices,
  } = useInvoiceSelection(invoices)

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Freight Invoices
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit, track, and manage commercial freight charges and customer settlements.
          </p>
        </div>
      </div>

      {/* KPI Statistics */}
      {isStatsLoading && !stats ? (
        <StatsCardSkeleton />
      ) : (
        <InvoiceStats stats={stats} isLoading={isStatsLoading} />
      )}

      {/* Bulk actions banner if any selected */}
      <BulkActions
        selectedCount={selectedCount}
        selectedIds={selectedIds}
        onClearSelection={clearSelection}
      />

      {/* Search, Filter, Export & Create Toolbar */}
      <InvoiceToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        fromDate={fromDate}
        toDate={toDate}
        onDateRangeChange={setDateRange}
        hasActiveFilters={hasActiveFilters}
        onClearAll={clearAllFilters}
        selectedInvoices={getSelectedVisibleInvoices()}
        filters={filters}
        sort={sort}
        totalFilteredCount={meta.totalItems}
      />

      {/* Table & Pagination */}
      <div className="space-y-4">
        <InvoiceTable
          invoices={invoices}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          sort={sort}
          onSort={toggleSort}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelectInvoice}
          onToggleSelectAll={toggleSelectAllVisible}
          isAllSelected={isAllVisibleSelected}
          isSomeSelected={isSomeVisibleSelected}
        />

        <InvoicePagination
          meta={meta}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  )
}
