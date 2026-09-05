import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Download, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../../../components/common/ConfirmDialog'
import { Button } from '../../../components/ui/Button'
import { hasPermission } from '../../../constants/permissions'
import { invoiceService } from '../services/invoice.service'
import { useInvoiceStore } from '../store/invoice.store'
import type { Invoice } from '../types/invoice.types'
import { printInvoice } from '../utils/invoice-download'

interface InvoiceActionsProps {
  invoice: Invoice
  onInvoiceUpdated?: (updated: Invoice) => void
}

export function InvoiceActions({ invoice, onInvoiceUpdated }: InvoiceActionsProps) {
  const navigate = useNavigate()
  const currentRole = useInvoiceStore((state) => state.currentRole)
  const triggerRefresh = useInvoiceStore((state) => state.triggerRefresh)

  const [confirmModal, setConfirmModal] = useState<'MARK_PAID' | 'DELETE' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const canMarkPaid = hasPermission(currentRole, 'invoice:mark_paid') && invoice.status !== 'PAID'
  const canDelete = hasPermission(currentRole, 'invoice:delete')
  const canDownload = hasPermission(currentRole, 'invoice:download')

  const handleExecuteAction = async () => {
    if (!confirmModal) return
    setIsLoading(true)
    try {
      if (confirmModal === 'MARK_PAID') {
        const updated = await invoiceService.updateInvoiceStatus(invoice.id, 'PAID')
        if (onInvoiceUpdated) onInvoiceUpdated(updated)
        triggerRefresh()
        setConfirmModal(null)
      } else if (confirmModal === 'DELETE') {
        await invoiceService.deleteInvoice(invoice.id)
        triggerRefresh()
        navigate('/invoices')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        {/* Back Link */}
        <Link to="/invoices">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Invoices</span>
          </Button>
        </Link>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {canDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => printInvoice(invoice)}
              className="gap-1.5 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download / Print</span>
            </Button>
          )}

          {canMarkPaid && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmModal('MARK_PAID')}
              className="gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Mark as Paid</span>
            </Button>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmModal('DELETE')}
              className="gap-1.5 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Invoice</span>
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmModal)}
        onOpenChange={(open) => !open && setConfirmModal(null)}
        title={confirmModal === 'MARK_PAID' ? 'Mark Invoice as Paid?' : 'Delete Invoice?'}
        description={
          confirmModal === 'MARK_PAID'
            ? `Update status to PAID and settle balance due of ${invoice.currency} ${invoice.amountDue.toFixed(2)}.`
            : `Permanently delete invoice ${invoice.invoiceNumber}. This action cannot be reversed.`
        }
        variant={confirmModal === 'DELETE' ? 'destructive' : 'default'}
        confirmText={confirmModal === 'DELETE' ? 'Delete Permanently' : 'Mark as Paid'}
        isLoading={isLoading}
        onConfirm={handleExecuteAction}
      />
    </>
  )
}
