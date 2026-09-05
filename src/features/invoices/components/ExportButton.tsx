import { useState } from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { hasPermission } from '../../../constants/permissions'
import { invoiceService } from '../services/invoice.service'
import { useInvoiceStore } from '../store/invoice.store'
import type { Invoice, InvoiceFilterParams, InvoiceSortConfig } from '../types/invoice.types'
import { exportInvoicesToCsv } from '../utils/csv-export'

interface ExportButtonProps {
  selectedInvoices: Invoice[]
  filters: InvoiceFilterParams
  sort: InvoiceSortConfig
  totalFilteredCount: number
}

export function ExportButton({
  selectedInvoices,
  filters,
  sort,
  totalFilteredCount,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const currentRole = useInvoiceStore((state) => state.currentRole)

  const canExport = hasPermission(currentRole, 'invoice:export')

  if (!canExport) {
    return null
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      if (selectedInvoices.length > 0) {
        // Export only selected
        exportInvoicesToCsv(
          selectedInvoices,
          `freightfox_selected_${selectedInvoices.length}_invoices.csv`
        )
      } else {
        // Fetch all currently filtered invoices
        const allFiltered = await invoiceService.getAllFilteredInvoices(filters, sort)
        exportInvoicesToCsv(
          allFiltered,
          `freightfox_all_${allFiltered.length}_invoices.csv`
        )
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed.')
    } finally {
      setIsExporting(false)
    }
  }

  const label =
    selectedInvoices.length > 0
      ? `Export Selected (${selectedInvoices.length})`
      : `Export CSV (${totalFilteredCount})`

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      isLoading={isExporting}
      className="h-9 gap-1.5 text-xs font-medium"
      title={
        selectedInvoices.length > 0
          ? 'Export selected invoices to CSV'
          : 'Export all matching invoices to CSV'
      }
    >
      {isExporting ? (
        <Download className="h-3.5 w-3.5" />
      ) : (
        <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      )}
      <span>{label}</span>
    </Button>
  )
}
