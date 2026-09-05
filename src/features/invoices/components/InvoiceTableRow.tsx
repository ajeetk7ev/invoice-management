import * as React from 'react'
import { Eye, Download, CheckCircle2, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { StatusBadge } from '../../../components/common/StatusBadge'
import { Checkbox } from '../../../components/ui/Checkbox'
import { TableCell, TableRow } from '../../../components/ui/Table'
import { hasPermission } from '../../../constants/permissions'
import { useInvoiceStore } from '../store/invoice.store'
import type { Invoice } from '../types/invoice.types'
import { formatCurrency } from '../utils/invoice-calculations'
import { printInvoice } from '../utils/invoice-download'

interface InvoiceTableRowProps {
  invoice: Invoice
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onMarkPaid: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
}

export const InvoiceTableRow = React.memo(function InvoiceTableRow({
  invoice,
  isSelected,
  onToggleSelect,
  onMarkPaid,
  onDelete,
}: InvoiceTableRowProps) {
  const navigate = useNavigate()
  const currentRole = useInvoiceStore((state) => state.currentRole)

  const canMarkPaid = hasPermission(currentRole, 'invoice:mark_paid') && invoice.status !== 'PAID'
  const canDelete = hasPermission(currentRole, 'invoice:delete')

  return (
    <TableRow
      data-state={isSelected ? 'selected' : undefined}
      className="group cursor-pointer hover:bg-muted/40 transition-colors"
      onClick={() => navigate(`/invoices/${invoice.id}`)}
    >
      {/* Checkbox */}
      <TableCell
        className="w-10 px-4"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Checkbox
          checked={isSelected}
          onChange={() => onToggleSelect(invoice.id)}
          aria-label={`Select invoice ${invoice.invoiceNumber}`}
        />
      </TableCell>

      {/* Invoice # */}
      <TableCell className="font-semibold text-foreground">
        <Link
          to={`/invoices/${invoice.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-primary hover:underline font-mono text-xs"
        >
          {invoice.invoiceNumber}
        </Link>
        {invoice.trackingNumber && (
          <div className="text-[11px] text-muted-foreground font-mono">
            {invoice.trackingNumber}
          </div>
        )}
      </TableCell>

      {/* Customer */}
      <TableCell>
        <div className="font-medium text-foreground text-sm leading-tight">
          {invoice.customer.company}
        </div>
        <div className="text-xs text-muted-foreground">{invoice.customer.name}</div>
      </TableCell>

      {/* Issue Date */}
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {invoice.issueDate}
      </TableCell>

      {/* Due Date */}
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {invoice.dueDate}
      </TableCell>

      {/* Amount & Due Balance */}
      <TableCell className="text-right">
        <div className="font-bold text-foreground text-sm">
          {formatCurrency(invoice.total, invoice.currency)}
        </div>
        {invoice.amountDue > 0 && invoice.status !== 'PAID' && (
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            Due: {formatCurrency(invoice.amountDue, invoice.currency)}
          </div>
        )}
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusBadge status={invoice.status} size="sm" />
      </TableCell>

      {/* Actions */}
      <TableCell
        className="text-right"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="flex items-center justify-end gap-1">
          {/* View Details */}
          <Link
            to={`/invoices/${invoice.id}`}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="View invoice details"
            aria-label={`View invoice ${invoice.invoiceNumber}`}
          >
            <Eye className="h-4 w-4" />
          </Link>

          {/* Download / Print */}
          <button
            type="button"
            onClick={() => printInvoice(invoice)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Download / Print invoice"
            aria-label={`Print invoice ${invoice.invoiceNumber}`}
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Mark as Paid (RBAC gated) */}
          {canMarkPaid && (
            <button
              type="button"
              onClick={() => onMarkPaid(invoice)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              title="Mark as Paid"
              aria-label={`Mark invoice ${invoice.invoiceNumber} as paid`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </button>
          )}

          {/* Delete (RBAC gated) */}
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(invoice)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete invoice"
              aria-label={`Delete invoice ${invoice.invoiceNumber}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
})
