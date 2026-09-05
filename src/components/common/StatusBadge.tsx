import { CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react'
import { STATUS_COLORS } from '../../constants/colors'
import type { InvoiceStatus } from '../../features/invoices/types/invoice.types'
import { cn } from '../../lib/utils'

interface StatusBadgeProps {
  status: InvoiceStatus
  className?: string
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const config = {
    PAID: {
      label: 'Paid',
      icon: CheckCircle2,
      styles: STATUS_COLORS.PAID.badge,
    },
    PENDING: {
      label: 'Pending',
      icon: Clock,
      styles: STATUS_COLORS.PENDING.badge,
    },
    OVERDUE: {
      label: 'Overdue',
      icon: AlertTriangle,
      styles: STATUS_COLORS.OVERDUE.badge,
    },
    DRAFT: {
      label: 'Draft',
      icon: FileText,
      styles: STATUS_COLORS.DRAFT.badge,
    },
  }[status]

  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors select-none',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        config.styles,
        className
      )}
      role="status"
      aria-label={`Invoice status: ${config.label}`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0'} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}
