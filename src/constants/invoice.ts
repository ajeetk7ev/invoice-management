/**
 * Centralized invoice domain constants and pagination defaults
 */

export const INVOICE_STATUSES = ['ALL', 'PAID', 'PENDING', 'OVERDUE', 'DRAFT'] as const
export type InvoiceStatusFilter = typeof INVOICE_STATUSES[number]

export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const

export const DEFAULT_SORT_FIELD = 'issueDate' as const
export const DEFAULT_SORT_DIRECTION = 'desc' as const

export const CURRENCY_CODE = 'INR'
export const CURRENCY_SYMBOL = '₹'

export const DATE_DISPLAY_FORMAT = 'dd MMM yyyy'
export const DATE_INPUT_FORMAT = 'yyyy-MM-dd'
