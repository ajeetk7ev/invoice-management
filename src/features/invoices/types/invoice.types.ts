/**
 * Strongly-typed Invoice Domain Models
 */

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT'

export interface Customer {
  id: string
  name: string
  email: string
  company: string
  taxId?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number // e.g. 0.18 for 18% GST
  amount: number // (quantity * unitPrice) * (1 + taxRate) or pre-tax amount
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customer: Customer
  customerEmail: string
  issueDate: string // YYYY-MM-DD
  dueDate: string   // YYYY-MM-DD
  status: InvoiceStatus
  subtotal: number
  tax: number
  total: number
  amountPaid: number
  amountDue: number
  currency: string
  lineItems: LineItem[]
  notes?: string
  paymentTerms?: string
  originHub?: string
  destinationHub?: string
  trackingNumber?: string
  createdAt: string
  updatedAt?: string
}

export type InvoiceSortField =
  | 'invoiceNumber'
  | 'customer'
  | 'issueDate'
  | 'dueDate'
  | 'total'
  | 'status'

export type SortDirection = 'asc' | 'desc'

export interface InvoiceSortConfig {
  field: InvoiceSortField
  direction: SortDirection
}

export interface InvoiceFilterParams {
  search?: string
  status?: InvoiceStatus | 'ALL'
  fromDate?: string // YYYY-MM-DD
  toDate?: string   // YYYY-MM-DD
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationMeta {
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface InvoiceListResponse {
  data: Invoice[]
  meta: PaginationMeta
}

export interface InvoiceStats {
  totalInvoices: number
  paidInvoices: number
  pendingInvoices: number
  overdueInvoices: number
  draftInvoices: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  overdueAmount: number
}

export interface CreateInvoiceInput {
  invoiceNumber: string
  customer: Omit<Customer, 'id'>
  issueDate: string
  dueDate: string
  status?: InvoiceStatus
  lineItems: Omit<LineItem, 'id' | 'amount'>[]
  notes?: string
  paymentTerms?: string
  originHub?: string
  destinationHub?: string
}
