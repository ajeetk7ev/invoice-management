import { useState } from 'react'
import { CheckCheck, Trash2, X } from 'lucide-react'
import { ConfirmDialog } from '../../../components/common/ConfirmDialog'
import { Button } from '../../../components/ui/Button'
import { hasPermission } from '../../../constants/permissions'
import { invoiceService } from '../services/invoice.service'
import { useInvoiceStore } from '../store/invoice.store'

interface BulkActionsProps {
  selectedCount: number
  selectedIds: string[]
  onClearSelection: () => void
}

export function BulkActions({ selectedCount, selectedIds, onClearSelection }: BulkActionsProps) {
  const currentRole = useInvoiceStore((state) => state.currentRole)
  const triggerRefresh = useInvoiceStore((state) => state.triggerRefresh)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [actionType, setActionType] = useState<'MARK_PAID' | 'DELETE' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (selectedCount === 0) return null

  const canMarkPaid = hasPermission(currentRole, 'invoice:mark_paid')
  const canDelete = hasPermission(currentRole, 'invoice:delete')

  const handleOpenAction = (type: 'MARK_PAID' | 'DELETE') => {
    setActionType(type)
    setIsConfirmOpen(true)
  }

  const handleExecuteAction = async () => {
    if (!actionType) return
    setIsLoading(true)
    try {
      if (actionType === 'MARK_PAID') {
        await invoiceService.bulkUpdateStatus(selectedIds, 'PAID')
      } else if (actionType === 'DELETE') {
        for (const id of selectedIds) {
          await invoiceService.deleteInvoice(id)
        }
      }
      onClearSelection()
      triggerRefresh()
      setIsConfirmOpen(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Bulk action failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-primary/10 dark:bg-primary/20 border border-primary/30 px-4 py-2.5 rounded-lg shadow-xs animate-in fade-in-0 duration-200">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            {selectedCount}
          </span>
          <span className="text-xs font-semibold text-foreground">
            {selectedCount === 1 ? '1 invoice selected' : `${selectedCount} invoices selected`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {canMarkPaid && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenAction('MARK_PAID')}
              className="h-8 text-xs gap-1.5 bg-background border-border text-foreground hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40"
            >
              <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Mark as Paid</span>
            </Button>
          )}

          {canDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenAction('DELETE')}
              className="h-8 text-xs gap-1.5 bg-background border-border text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <X className="h-3.5 w-3.5" />
            <span>Deselect</span>
          </Button>
        </div>
      </div>

      {/* Confirmation modal */}
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={
          actionType === 'MARK_PAID'
            ? `Mark ${selectedCount} Invoices as Paid?`
            : `Delete ${selectedCount} Invoices?`
        }
        description={
          actionType === 'MARK_PAID'
            ? `This will update ${selectedCount} selected invoices to PAID status and clear their outstanding balance due.`
            : `This action will permanently delete ${selectedCount} selected invoices from the system.`
        }
        variant={actionType === 'DELETE' ? 'destructive' : 'default'}
        confirmText={actionType === 'DELETE' ? 'Delete Selected' : 'Mark as Paid'}
        isLoading={isLoading}
        onConfirm={handleExecuteAction}
      />
    </>
  )
}
